'use server'

import { AddAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
import { Assessments } from '@/utils/supabase/models/assessments'
import { validateOrFail } from '@/utils/validate-or-fail'

export async function addAssessmentCheckpoint(
  _prevState: unknown,
  formData: FormData
) {
  const payload = await validateOrFail(() =>
    AddAssessmentCheckpointSchema.validate(Object.fromEntries(formData), {
      stripUnknown: true
    })
  )

  if ('message' in payload) {
    return {
      message: payload.message
    }
  }

  const { id, end_surah, end_verse, start_surah, start_verse, ...restPayload } =
    payload
  const assessmentsInstance = new Assessments()

  try {
    // Intentionally chaining, so that the new checkpoint will only be created once the current checkpoint is updated.
    await assessmentsInstance.update(id, {
      ...restPayload,
      surah_range: [
        [`${start_surah}:${start_verse}`],
        [`${end_surah}:${end_verse}`]
      ]
    })

    // TODO: can we have some kind of rollback here in case this update fails?
    if (restPayload.final_mark) {
      const parentAssessment = await assessmentsInstance.get(
        restPayload.parent_assessment_id
      )
      const [rootStart] = parentAssessment.data!.surah_range as [
        [string],
        [string] | undefined
      ]
      const [rootStartSurah, rootStartVerse] = rootStart[0].split(':')

      await assessmentsInstance.update(restPayload.parent_assessment_id, {
        ...restPayload,
        surah_range: [
          [`${rootStartSurah}:${rootStartVerse}`],
          [`${end_surah}:${end_verse}`]
        ]
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
  } catch (error) {
    const e = (error as Error).message
    return {
      message: e
    }
  }
}
