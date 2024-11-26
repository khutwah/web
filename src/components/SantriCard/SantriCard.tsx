import { ActivityTypeKey } from '@/models/activities'
import Link from 'next/link'
import Image from 'next/image'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { useId } from 'react'

interface SantriCardProps {
  activities: Array<ActivityTypeKey>
  avatarUrl: string
  halaqahName: string
  name: string
}

const ACTIVITY_TYPES: Array<ActivityTypeKey> = ['Sabaq', 'Sabqi', 'Manzil']

export function SantriCard({
  activities,
  avatarUrl,
  halaqahName,
  name
}: SantriCardProps) {
  const labelId = useId()
  const descriptionId = useId()

  return (
    <Link
      href='#'
      className='w-full'
      aria-labelledby={`mtmh-santri-card${labelId}`}
      aria-describedby={`mtmh-santri-card${descriptionId}`}
    >
      <div className='flex gap-3 items-center p-3 rounded-t-lg bg-mtmh-neutral-10'>
        <Image
          src={avatarUrl}
          alt=''
          width={40}
          height={40}
          className='rounded-full'
        />
        <div className='min-w-0'>
          <h3
            className='font-normal text-sm text-mtmh-grey-base line-clamp-2'
            id={`mtmh-santri-card${labelId}`}
          >
            {name}
          </h3>
          <p
            className='text-mtmh-neutral-60 text-xs'
            id={`mtmh-santri-card${descriptionId}`}
          >
            {halaqahName}
          </p>
        </div>
      </div>
      <div className='flex flex-wrap py-2 pr-2 pl-3 gap-1 bg-mtmh-snow-lighter rounded-b-lg'>
        <div className='text-sm grow min-w-0 text-mtmh-neutral-60'>
          Hari ini:
        </div>
        <div className='flex flex-wrap gap-1'>
          {ACTIVITY_TYPES.map((activityKey) => {
            const isStudentPresent = activities.includes(activityKey)

            return (
              <ActivityBadge
                key={activityKey}
                type={activityKey}
                isStudentPresent={isStudentPresent}
              />
            )
          })}
        </div>
      </div>
    </Link>
  )
}
