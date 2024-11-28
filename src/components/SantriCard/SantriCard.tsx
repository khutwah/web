import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import { useId } from 'react'

import { ActivityTypeKey } from '@/models/activities'
import { ActivityBadge } from '@/components/Badge/ActivityBadge'

interface SantriCardProps {
  activities: Array<ActivityTypeKey>
  avatarUrl: ImageProps['src']
  halaqahName?: string
  href: string
  name: string
}

const ACTIVITY_TYPES: Array<ActivityTypeKey> = ['Sabaq', 'Sabqi', 'Manzil']

export function SantriCard({
  activities,
  avatarUrl,
  halaqahName,
  href,
  name
}: SantriCardProps) {
  const labelId = useId()
  const descriptionId = useId()

  return (
    <Link
      href={href}
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
          className='rounded-full flex-shrink-0'
        />
        <div className='min-w-0'>
          <div
            className='font-normal text-sm text-mtmh-grey-base line-clamp-2 break-words'
            id={`mtmh-santri-card${labelId}`}
          >
            {name}
          </div>
          {halaqahName && (
            <div
              className='text-mtmh-neutral-60 text-xs'
              id={`mtmh-santri-card${descriptionId}`}
            >
              {halaqahName}
            </div>
          )}
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
