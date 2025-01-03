'use server'

import { FormState } from '@/models/targets'
import { Students } from '@/utils/supabase/models/students'

export async function update(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('formData', formData)

  const id = Number(formData.get('id'))
  const studentsInstance = new Students()
  const { error } = await studentsInstance.update(id, {
    target_page_count: Number(formData.get('target_page_count'))
  })

  console.log('error', error)

  if (error) {
    return {
      message: error.message,
      success: false
    }
  }

  return {
    success: true
  }
}
