import { Plus } from 'lucide-react'

import { Button, ButtonProps } from '@/components/Button/Button'
import { ActivityTypeKey } from '@/models/activities'
import { cn } from '@/utils/classnames'
import Link from 'next/link'

interface AddActivityCtaProps extends ButtonProps {
  activityType: ActivityTypeKey
  halaqahId: number
  studentId: number
  searchStringRecords?: Record<string, string>
}

const ACTIVITY_TYPE_TO_BUTTON_PROPS: Record<
  ActivityTypeKey,
  { label: string; className: string }
> = {
  Sabaq: {
    label: 'Sabaq',
    className:
      'bg-mtmh-blue-base hover:bg-mtmh-blue-dark active:bg-mtmh-blue-darker'
  },
  Sabqi: {
    label: 'Sabqi',
    className:
      'bg-mtmh-green-dark hover:bg-mtmh-green-darker active:bg-mtmh-green-darkest'
  },
  Manzil: {
    label: 'Manzil',
    className:
      'bg-mtmh-warning-70 hover:bg-mtmh-warning-80 active:bg-mtmh-warning-90'
  }
}

export function AddActivityCta({
  activityType,
  halaqahId,
  studentId,
  searchStringRecords,
  ...buttonProps
}: AddActivityCtaProps) {
  const { label, className } = ACTIVITY_TYPE_TO_BUTTON_PROPS[activityType]

  return (
    <Button
      {...buttonProps}
      className={cn('gap-1.5', className, buttonProps.className)}
      asChild
    >
      <Link
        href={{
          pathname: `/ustadz/santri/${studentId}/aktivitas/add`,
          query: {
            activity_type: activityType,
            halaqah_id: halaqahId,
            ...searchStringRecords
          }
        }}
      >
        <Plus aria-hidden='true' />
        <span className='sr-only'>Input</span>
        <span>{label}</span>
      </Link>
    </Button>
  )
}
