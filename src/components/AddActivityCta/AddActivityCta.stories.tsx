import { AddActivityCta } from './AddActivityCta'

export function Default() {
  return (
    <div className='flex gap-2'>
      <AddActivityCta activityType='Sabqi' studentId='1' halaqahId='A' />
      <AddActivityCta activityType='Sabaq' studentId='2' halaqahId='A' />
      <AddActivityCta activityType='Manzil' studentId='2' halaqahId='A' />
    </div>
  )
}
