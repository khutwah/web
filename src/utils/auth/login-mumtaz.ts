import {
  MUMTAZ_AUTH_API,
  TEMPORARY_PIN_PAGE_ID_COOKIE,
  PIN_IS_SUBMMITTED
} from '@/models/auth'
import { LoginMumtazArgs } from '@/models/login-mumtaz'
import { registerStudent } from './register-user'
import { Students } from '../supabase/models/students'
import { loginSupabase } from './login-supabase'
import { cookies } from 'next/headers'

export async function loginMumtaz({ username, password }: LoginMumtazArgs) {
  try {
    const response = await fetch(MUMTAZ_AUTH_API, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (json.status === 200 && json.user.verified === true) {
      return {
        status: 200,
        data: json.user
      }
    }
    if (json.status === 401 || json.user.verified !== true) {
      return {
        status: 401,
        data: null
      }
    }
  } catch (error) {
    console.error(error)
  }
  return {
    status: 500,
    data: null
  }
}

export async function successLoginStudentCallback(
  mumtazResponse: Record<string, string>
) {
  const student = new Students()
  const studentResult = await student.list({
    virtual_account: mumtazResponse.virtual_account
  })
  const user = studentResult.data?.[0]
  const cookie = await cookies()

  if (!user) {
    // sign up
    await registerStudent({
      email: mumtazResponse.email,
      name: mumtazResponse.name,
      password: process.env.DEFAULT_STUDENT_PASSWORD!,
      virtual_account: mumtazResponse.virtual_account
    })
    cookie.set(PIN_IS_SUBMMITTED, 'false', {
      httpOnly: true,
      secure: true
    })
    return '/get-started'
  }

  // sign in
  const emailStudent = user.users?.email ?? ''
  await loginSupabase({
    email: emailStudent,
    password: process.env.DEFAULT_STUDENT_PASSWORD!
  })

  const isPinSubmitted = await student.isPinSubmitted(
    mumtazResponse.virtual_account
  )

  if (isPinSubmitted) {
    cookie.delete(PIN_IS_SUBMMITTED)
  } else {
    cookie.set(PIN_IS_SUBMMITTED, 'false', {
      httpOnly: true,
      secure: true
    })
    return '/get-started'
  }

  return '/'
}

export async function loginUsingPinPrep(userId: string) {
  const cookie = await cookies()
  cookie.set(TEMPORARY_PIN_PAGE_ID_COOKIE, userId, {
    httpOnly: true,
    secure: true
  })

  return '/login/pin'
}
