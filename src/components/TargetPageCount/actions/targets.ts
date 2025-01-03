'use server'

import { FormState } from '@/models/targets'
import { Circles } from '@/utils/supabase/models/circles'
import { Students } from '@/utils/supabase/models/students'

export async function updateStudent(
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

export async function updateCircle(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  console.log('formData', formData)

  const id = Number(formData.get('id'))
  const circleInstance = new Circles()
  const { error } = await circleInstance.update(id, {
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
