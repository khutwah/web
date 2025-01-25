'use client'

import { UpdatePasswordProps } from '../models/update-password'
import { UpdatePasswordForm } from './UpdatePasswordForm'

export function UpdatePassword({ action }: UpdatePasswordProps) {
  return <UpdatePasswordForm action={action} />
}
