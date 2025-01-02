import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import { useId } from 'react'

import { ActivityTypeKey, MappedActivityStatus } from '@/models/activities'
import { ActivityBadge } from '@/components/Badge/ActivityBadge'
import { Skeleton } from '../Skeleton/Skeleton'

interface SantriCardProps {
  activities: Array<MappedActivityStatus>
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
      <SantriCardStructure
        imageElement={
          <Image
            src={avatarUrl}
            alt=''
            width={40}
            height={40}
            className='rounded-full flex-shrink-0'
          />
        }
        nameAndHalaqahElement={
          <div className='min-w-0'>
            <div
              className='font-normal text-sm text-khutwah-grey-base line-clamp-2 break-words'
              id={`mtmh-santri-card${labelId}`}
            >
              {name}
            </div>
            {halaqahName && (
              <div
                className='text-khutwah-neutral-60 text-xs'
                id={`mtmh-santri-card${descriptionId}`}
              >
                {halaqahName}
              </div>
            )}
          </div>
        }
        activitiesElement={
          <>
            <div className='text-sm grow min-w-0 text-khutwah-neutral-60'>
              Hari ini:
            </div>
            <div className='flex flex-wrap gap-1'>
              {ACTIVITY_TYPES.map((activityKey) => {
                const selectedActivity = activities.find(
                  (activity) => activity[activityKey]
                )
                const isStudentPresent = selectedActivity !== undefined
                const isDraft = selectedActivity?.[activityKey] === 'draft'

                return (
                  <ActivityBadge
                    key={activityKey}
                    type={activityKey}
                    isStudentPresent={isStudentPresent}
                    isDraft={isDraft}
                  />
                )
              })}
            </div>
          </>
        }
      />
    </Link>
  )
}

export function SantriCardSkeleton() {
  return (
    <div>
      <SantriCardStructure
        activitiesElement={<Skeleton className='w-full h-5' />}
        imageElement={<Skeleton className='w-10 h-10' />}
        nameAndHalaqahElement={
          <div className='flex flex-col w-full gap-y-1.5'>
            <Skeleton className='w-full h-4' />
            <Skeleton className='w-full h-4' />
          </div>
        }
      />
    </div>
  )
}

function SantriCardStructure({
  imageElement,
  nameAndHalaqahElement,
  activitiesElement
}: {
  imageElement: JSX.Element
  nameAndHalaqahElement: JSX.Element
  activitiesElement: JSX.Element
}) {
  return (
    <>
      <div className='flex gap-3 items-center p-3 rounded-t-lg bg-khutwah-neutral-10'>
        {imageElement}

        {nameAndHalaqahElement}
      </div>
      <div className='flex flex-wrap py-2 pr-2 pl-3 gap-1 bg-khutwah-snow-lighter rounded-b-lg'>
        {activitiesElement}
      </div>
    </>
  )
}
