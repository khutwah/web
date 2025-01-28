import { Plus } from 'lucide-react'

import { Button, ButtonProps } from '@/components/Button/Button'
import { ActivityTypeKey } from '@/models/activities'
import { cn } from '@/utils/classnames'
import Link from 'next/link'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'

interface Activity {
  id: number
}

interface AddActivityCtaProps extends ButtonProps {
  activityType: ActivityTypeKey
  halaqahId: number
  studentId: number
  searchStringRecords?: Record<string, string>
  activityForToday?: Activity
  alwaysCreate?: boolean
}

const ACTIVITY_TYPE_TO_BUTTON_PROPS: Record<
  ActivityTypeKey,
  { label: string; className: string }
> = {
  Sabaq: {
    label: 'Sabaq',
    className:
      'bg-khutwah-blue-base hover:bg-khutwah-blue-dark active:bg-khutwah-blue-darker'
  },
  Sabqi: {
    label: 'Sabqi',
    className:
      'bg-khutwah-green-dark hover:bg-khutwah-green-darker active:bg-khutwah-green-darkest'
  },
  Manzil: {
    label: 'Manzil',
    className:
      'bg-khutwah-warning-70 hover:bg-khutwah-warning-80 active:bg-khutwah-warning-90'
  }
}

export function AddActivityCta({
  activityType,
  halaqahId,
  studentId,
  searchStringRecords,
  activityForToday,
  alwaysCreate,
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
          pathname: activityForToday
            ? `${MENU_USTADZ_PATH_RECORDS.santri}/${studentId}` // FIXME(dio): We need to keep on the current page.
            : `${MENU_USTADZ_PATH_RECORDS.santri}/${studentId}/aktivitas/add`,
          query: {
            activity_type: activityType,
            halaqah_id: halaqahId,
            activity: activityForToday?.id,
            alwaysCreate,
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
