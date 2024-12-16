import Link from 'next/link'
import { Card, CardContent } from '../Card/Card'
import { StickyNote } from '../icons'
import { CircleDashed as HalaqahIcon } from 'lucide-react'
import { cn } from '@/utils/classnames'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { addQueryParams } from '@/utils/url'

interface Props {
  id: number
  name: string
  venue: string
  substituteeName?: string
  hasGutter?: boolean
  isOwner?: boolean
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function HalaqahCard({
  id,
  name,
  venue,
  substituteeName,
  isOwner,
  hasGutter,
  searchParams
}: Props) {
  return (
    // At the moment, the halaqah information is only available for Ustadz role, so we just hardcode the ustadz role here.
    <Link
      href={addQueryParams(
        `${MENU_USTADZ_PATH_RECORDS.halaqah}/${id}`,
        searchParams!
      )}
    >
      <Card
        className={cn(
          'w-full bg-mtmh-neutral-10 text-mtmh-grey-base rounded-lg ',
          {
            'border-l-[3px] border-l-mtmh-tamarind-base rounded-l-none':
              hasGutter
          }
        )}
      >
        <CardContent className='flex flex-col p-4 gap-y-3'>
          <div className='flex gap-x-3'>
            <div>
              <HalaqahIcon className='fill-mtmh-grey-lighter' />
            </div>

            <div className='flex flex-col gap-y-1'>
              <div className='flex flex-col text-mtmh-grey-base text-mtmh-m-regular'>
                {name}
              </div>

              <div className='text-mtmh-sm-regular text-mtmh-grey-lighter'>
                {venue}
              </div>
            </div>
          </div>

          {substituteeName && (
            <div className='flex justify-end'>
              <div className='flex gap-x-1 text-mtmh-grey-base py-0.5 px-2 bg-mtmh-neutral-white rounded-md'>
                <StickyNote className='fill-mtmh-grey-base' />

                <div className='text-mtmh-sm-regular'>
                  {isOwner ? 'Diwakilkan' : 'Mewakilkan'} {substituteeName}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
