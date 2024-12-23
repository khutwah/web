'use server'

import { FormState, UpdatePayload, InsertPayload } from '@/models/checkpoint'
import {
  createCheckpointSchema,
  updateCheckpointSchema
} from '@/utils/schemas/checkpoint'
import { Checkpoint } from '@/utils/supabase/models/checkpoint'
import { validateOrFail } from '@/utils/validate-or-fail'
import { InferType } from 'yup'

type UpdateSchema = InferType<typeof updateCheckpointSchema>
type CreateSchema = InferType<typeof createCheckpointSchema>

async function upsertOrFail(
  id: undefined,
  payload: InsertPayload
): Promise<{ success: boolean } | { message: string }>
async function upsertOrFail(
  id: number,
  payload: UpdatePayload
): Promise<{ success: boolean } | { message: string }>
async function upsertOrFail(
  id: number | undefined,
  payload: InsertPayload | UpdatePayload
): Promise<{ success: boolean } | { message: string }> {
  const checkpointInstance = new Checkpoint()
  try {
    let response
    if (typeof id === 'number') {
      response = await checkpointInstance.update(id, payload as UpdatePayload)
    } else {
      response = await checkpointInstance.create(payload as InsertPayload)
    }

    if (response.error) {
      return {
        message: response.error.message
      }
    }

    return {
      success: true
    }
  } catch (error: unknown) {
    return {
      message: String(error)
    }
  }
}

export async function upsert(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const _id = formData.get('id')
  if (_id) {
    const validatedFields = await validateOrFail<UpdateSchema>(() =>
      updateCheckpointSchema.validate({
        id: _id,
        status: formData.get('status'),
        notes: formData.get('notes'),
        end_date: formData.get('end_date'),
        part_count: formData.get('part_count'),
        page_count_accumulation: formData.get('page_count_accumulation'),
        last_activity_id: formData.get('last_activity_id')
      })
    )

    if ('message' in validatedFields) {
      return {
        message: validatedFields.message
      }
    }

    const { id, ...payload } = validatedFields
    return await upsertOrFail(id, payload)
  }

  const validatedFields = await validateOrFail<CreateSchema>(() =>
    createCheckpointSchema.validate({
      status: formData.get('status'),
      notes: formData.get('notes'),
      start_date: formData.get('start_date'),
      part_count: formData.get('part_count'),
      page_count_accumulation: formData.get('page_count_accumulation'),
      last_activity_id: formData.get('last_activity_id'),
      student_id: formData.get('student_id')
    })
  )

  if ('message' in validatedFields) {
    return {
      message: validatedFields.message
    }
  }

  return await upsertOrFail(undefined, validatedFields)
}
