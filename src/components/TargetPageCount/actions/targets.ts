'use server'

import { FormState } from '@/models/targets'
import { Activities } from '@/utils/supabase/models/activities'
import { Circles } from '@/utils/supabase/models/circles'
import { Students } from '@/utils/supabase/models/students'

export async function updateStudent(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const id = Number(formData.get('id'))
  const studentsInstance = new Students()
  const { error } = await studentsInstance.update(id, {
    target_page_count: Number(formData.get('target_page_count'))
  })

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
  const id = Number(formData.get('id'))
  const circleInstance = new Circles()
  const { error } = await circleInstance.update(id, {
    target_page_count: Number(formData.get('target_page_count'))
  })

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

export async function updateActivity(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const activitiesInstance = new Activities()
  const { error } = await activitiesInstance.updateTargetPageCount(
    Number(formData.get('id')),
    Number(formData.get('target_page_count'))
  )

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
