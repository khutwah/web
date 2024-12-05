'use client'
import { useFormState } from 'react-dom'
import { login } from './actions'

export default function Pin() {
  const [state, formAction] = useFormState(login, { message: '' })

  return (
    <div>
      <form action={formAction}>
        <label htmlFor='pin'>INPUT PIN</label>
        <input id='pin' name='pin' type='number' minLength={6} maxLength={6} />
        <div>{state?.message}</div>
      </form>
    </div>
  )
}
