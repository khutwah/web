import Link from 'next/link'
import { Card, CardContent } from '../Card/Card'
import { StickyNote } from '../icons'
import { cn } from '@/utils/classnames'
import { MENU_PATH_RECORD } from '@/utils/menus/ustadz'

interface Props {
  id: number
  name: string
  venue: string
  substituteeName?: string
  hasGutter?: boolean
  isOwner: boolean
}

export function HalaqahCard({
  id,
  name,
  venue,
  substituteeName,
  isOwner,
  hasGutter
}: Props) {
  return (
    // At the moment, the halaqah information is only available for Ustadz role, so we just hardcode the ustadz role here.
    <Link href={`${MENU_PATH_RECORD.halaqah}/${id}`}>
      <Card
        className={cn(
          'w-full bg-mtmh-neutral-10 text-mtmh-grey-base rounded-none',
          {
            'border-l-[3px] border-l-mtmh-tamarind-base': hasGutter
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

function HalaqahIcon({ className }: { className: string }) {
  return (
    <svg
      width='20'
      height='20'
      className={className}
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M9.00008 4.00008C9.92056 4.00008 10.6667 3.25389 10.6667 2.33341C10.6667 1.41294 9.92056 0.666748 9.00008 0.666748C8.07961 0.666748 7.33342 1.41294 7.33342 2.33341C7.33342 3.25389 8.07961 4.00008 9.00008 4.00008Z' />
      <path d='M9.00008 14.0001C9.92056 14.0001 10.6667 13.2539 10.6667 12.3334V9.83342C11.5872 9.83342 12.3334 9.08722 12.3334 8.16675V6.50008C12.3334 5.58091 11.5859 4.83342 10.6667 4.83342H7.33342C6.41425 4.83342 5.66675 5.58091 5.66675 6.50008V8.16675C5.66675 9.08722 6.41294 9.83342 7.33342 9.83342V12.3334C7.33342 13.2539 8.07961 14.0001 9.00008 14.0001Z' />
      <path d='M15.0969 8.89752C14.7092 8.65014 14.2053 8.82188 13.9999 9.23339C13.7943 9.64524 13.9675 10.139 14.3481 10.3978C15.195 10.9739 15.6667 11.6563 15.6667 12.3334C15.6667 13.9101 12.9292 15.6667 9.00008 15.6667C5.07091 15.6667 2.33341 13.9101 2.33341 12.3334C2.33341 11.6563 2.80507 10.974 3.65149 10.3979C4.03198 10.139 4.20508 9.64535 3.99953 9.23355C3.79408 8.82198 3.29009 8.65025 2.90236 8.89776C1.47132 9.81127 0.666748 11.0332 0.666748 12.3334C0.666748 15.1367 4.32758 17.3334 9.00008 17.3334C13.6726 17.3334 17.3334 15.1367 17.3334 12.3334C17.3334 11.0331 16.5287 9.81106 15.0969 8.89752Z' />
    </svg>
  )
}
