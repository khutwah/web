import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import { useId } from 'react'

import { ActivityTypeKey, MappedActivityStatus } from '@/models/activities'
import { ActivityBadge } from '@/components/Badge/ActivityBadge'
import { Skeleton } from '../Skeleton/Skeleton'
import { getAyahLocationSummary } from '@/utils/mushaf'
import { CheckpointStatus } from '@/models/checkpoints'
import { Badge } from '../Badge/Badge'
import { getStatusText } from '@/utils/assessments'
import { Circle, CircleOff, Clock } from 'lucide-react'

interface SantriCardProps {
  activities: Array<MappedActivityStatus>
  avatarUrl: ImageProps['src']
  halaqahName?: string
  href: string
  name: string
  lastSabaq?: {
    end_surah: number
    end_verse: number
  }
  status?: CheckpointStatus | null
}

const ACTIVITY_TYPES: Array<ActivityTypeKey> = ['Sabaq', 'Sabqi', 'Manzil']

export function SantriCard({
  activities,
  avatarUrl,
  halaqahName,
  lastSabaq,
  href,
  name,
  status
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
          <div className='min-w-0 '>
            <div>
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
            {lastSabaq && (
              <div
                className='text-khutwah-neutral-60 text-xs'
                id={`mtmh-santri-card${descriptionId}`}
              >
                {(() => {
                  const summary = getAyahLocationSummary(
                    lastSabaq.end_surah,
                    lastSabaq.end_verse
                  )
                  if (summary) {
                    return `${summary?.juz.juz} Juz ${summary.juz.pages > 0 ? `dan ${summary.juz.pages} halaman` : ''}`
                  }
                  return ''
                })()}
              </div>
            )}
          </div>
        }
        activitiesElement={
          <>
            <div className='grow min-w-0 text-khutwah-neutral-60'></div>
            <div className='flex flex-wrap gap-1'>
              {status === 'inactive' ? (
                <Badge
                  color='red-dashed'
                  text='Tidak Aktif'
                  icon={<CircleOff size={12} />}
                />
              ) : (
                <Badge
                  color='green-outline'
                  text='Aktif'
                  icon={<Circle size={12} />}
                />
              )}

              {status && getStatusText(status) && (
                <Badge
                  color='red-dashed'
                  text={getStatusText(status) || ''}
                  icon={<Clock size={12} />}
                />
              )}

              {ACTIVITY_TYPES.map((activityKey) => {
                const selectedActivity = activities.find(
                  (activity) => activity[activityKey]
                )
                const isDraft =
                  selectedActivity?.[activityKey]?.status === 'draft'

                return (
                  <ActivityBadge
                    key={activityKey}
                    type={activityKey}
                    attendance={selectedActivity?.[activityKey]?.attendance}
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
