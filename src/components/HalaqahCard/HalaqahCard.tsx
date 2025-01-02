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
          'w-full bg-khutwah-neutral-10 text-khutwah-grey-base rounded-lg ',
          {
            'border-l-[3px] border-l-khutwah-tamarind-base rounded-l-none':
              hasGutter
          }
        )}
      >
        <CardContent className='flex flex-col p-4 gap-y-3'>
          <div className='flex gap-x-3'>
            <div>
              <HalaqahIcon className='fill-khutwah-grey-lighter' />
            </div>

            <div className='flex flex-col gap-y-1'>
              <div className='flex flex-col text-khutwah-grey-base text-khutwah-m-regular'>
                {name}
              </div>

              <div className='text-khutwah-sm-regular text-khutwah-grey-lighter'>
                {venue}
              </div>
            </div>
          </div>

          {substituteeName && (
            <div className='flex justify-end'>
              <div className='flex gap-x-1 text-khutwah-grey-base py-0.5 px-2 bg-khutwah-neutral-white rounded-md'>
                <StickyNote className='fill-khutwah-grey-base' />

                <div className='text-khutwah-sm-regular'>
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
