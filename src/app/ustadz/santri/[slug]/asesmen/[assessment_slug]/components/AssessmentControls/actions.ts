'use server'

import { ROLE } from '@/models/auth'
import { UpdateAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
import { getUserRole } from '@/utils/supabase/get-user-role'
import { Assessments } from '@/utils/supabase/models/assessments'
import { validateOrFail } from '@/utils/validate-or-fail'

export async function addAssessmentCheckpoint(
  _prevState: unknown,
  formData: FormData
) {
  const payload = await validateOrFail(() =>
    UpdateAssessmentCheckpointSchema.validate(Object.fromEntries(formData), {
      stripUnknown: true
    })
  )

  if ('message' in payload) {
    return {
      message: payload.message
    }
  }

  const {
    id,
    end_surah,
    end_verse,
    start_surah,
    start_verse,
    final_mark,
    notes,
    status_checkpoint_id,
    ...restPayload
  } = payload
  const assessmentsInstance = new Assessments()

  try {
    await assessmentsInstance.prisma.$transaction(async (tx) => {
      await tx.assessments.update({
        where: { id },
        data: {
          ...restPayload,
          notes,
          updated_at: new Date().toISOString(),
          surah_range: [
            [`${start_surah}:${start_verse}`],
            [`${end_surah}:${end_verse}`]
          ]
        }
      })

      if (final_mark) {
        const [parentAssessment, childrenAssessments] = await Promise.all([
          tx.assessments.findUnique({
            where: { id: restPayload.parent_assessment_id }
          }),
          tx.assessments.findMany({
            where: { parent_assessment_id: restPayload.parent_assessment_id }
          })
        ])

        const [rootStart] = parentAssessment?.surah_range as [
          [string],
          [string] | undefined
        ]
        const [rootStartSurah, rootStartVerse] = rootStart[0].split(':')
        const now = new Date().toISOString()

        let lowMistakeCount = 0
        let mediumMistakeCount = 0
        let highMistakeCount = 0

        for (const child of childrenAssessments) {
          lowMistakeCount += child.low_mistake_count
          mediumMistakeCount += child.medium_mistake_count
          highMistakeCount += child.high_mistake_count
        }

        // We skip updating root assessment's parent_assessment_id and start_date.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { parent_assessment_id, start_date, ...payload } = restPayload
        await tx.assessments.update({
          where: { id: parent_assessment_id },
          data: {
            ...payload,
            final_mark,
            updated_at: now,
            end_date: now,
            notes, // Put the last checkpoint notes as the root assessment notes.
            surah_range: [
              [`${rootStartSurah}:${rootStartVerse}`],
              [`${end_surah}:${end_verse}`]
            ],
            low_mistake_count: lowMistakeCount,
            medium_mistake_count: mediumMistakeCount,
            high_mistake_count: highMistakeCount
          }
        })

        const role = await getUserRole()
        await tx.checkpoints.update({
          where: { id: status_checkpoint_id },
          data: {
            status:
              role === ROLE.LAJNAH
                ? 'lajnah-assessment-completed'
                : 'assessment-completed',
            end_date: now
          }
        })
      } else {
        await assessmentsInstance.create({
          start_date: new Date().toISOString(),
          surah_range: [[`${end_surah}:${end_verse}`]],
          student_id: restPayload.student_id,
          ustadz_id: restPayload.ustadz_id,
          parent_assessment_id: restPayload.parent_assessment_id,
          low_mistake_count: 0,
          medium_mistake_count: 0,
          high_mistake_count: 0
        })
      }
    })
  } catch (error) {
    const e = (error as Error).message
    return {
      message: e
    }
  }
}
