'use client'

import { useFormState } from 'react-dom'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { message: '' })

  return (
    <form action={formAction}>
      <label htmlFor='username'>Username:</label>
      <input id='username' name='username' type='text' required />
      <label htmlFor='password'>Password:</label>
      <input id='password' name='password' type='password' required />
      <button>Log in</button>
      <div>{state?.message}</div>
    </form>
  )
}
