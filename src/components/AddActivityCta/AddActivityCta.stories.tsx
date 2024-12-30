import { AddActivityCta } from './AddActivityCta'

export function Default() {
  return (
    <div className='flex gap-2'>
      <AddActivityCta activityType='Sabqi' studentId={1} halaqahId={1} />
      <AddActivityCta activityType='Sabaq' studentId={2} halaqahId={2} />
      <AddActivityCta activityType='Manzil' studentId={3} halaqahId={3} />
    </div>
  )
}
