'use server'

import { UpdateAssessmentCheckpointSchema } from '@/utils/schemas/assessments'
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
    ...restPayload
  } = payload
  const assessmentsInstance = new Assessments()

  try {
    // Intentionally chaining, so that the new checkpoint will only be created once the current checkpoint is updated.
    await assessmentsInstance.update(id, {
      ...restPayload,
      notes,
      updated_at: new Date().toISOString(),
      surah_range: [
        [`${start_surah}:${start_verse}`],
        [`${end_surah}:${end_verse}`]
      ]
    })

    // TODO: can we have some kind of rollback here in case this update fails?
    if (final_mark) {
      // When `final_mark` exists, then we do not create a new checkpoint. Instead, we update the root assessment.
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
        final_mark,
        updated_at: new Date().toISOString(),
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
