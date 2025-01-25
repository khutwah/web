import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../Card/Card'
import { dayjs } from '@/utils/dayjs'
import { ActivityBadge } from '../Badge/ActivityBadge'
import { convertSearchParamsToStringRecords } from '@/utils/url'
import { File, Flame } from 'lucide-react'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'

interface AssessmentCardProps {
  id: string
  studentId: string
  timestamp: string
  tz: string
  finalMark?: string | null
  name?: string | null
  notes?: string | null
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function AssessmentCard({
  id,
  studentId,
  timestamp,
  tz,
  finalMark,
  name,
  notes,
  searchParams
}: AssessmentCardProps) {
  let query = ''
  if (searchParams) {
    const params = new URLSearchParams(
      convertSearchParamsToStringRecords(searchParams)
    )
    params.set('id', studentId)
    query = params.toString()
  }

  const isCancelled = finalMark?.startsWith('CANCELLED')

  return (
    <Link
      href={{
        pathname: `${MENU_USTADZ_PATH_RECORDS.home}/santri/${studentId}/asesmen/${id}`,
        query
      }}
    >
      <Card className='w-full bg-khutwah-neutral-10 text-khutwah-grey-base relative h-full flex flex-col'>
        <CardHeader className='rounded-t-xl p-5 pb-2'>
          <CardTitle className='flex justify-between items-start'>
            <div className='flex flex-col gap-y-1'>
              <div className='text-xs text-khutwah-neutral-50'>
                {dayjs.utc(timestamp).tz(tz).format('DD MMM YYYY HH:mm')}
              </div>
              <div className='text-khutwah-m-semibold'>{name}</div>
            </div>
            <ActivityBadge
              type={'Manzil'}
              attendance={isCancelled ? 'absent' : 'present'}
              text={isCancelled ? 'Ditunda' : 'Selesai'}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-y-4'>
          <div className='flex items-center gap-x-2 text-sm'>
            <div>
              <Flame className='text-khutwah-grey-lightest' size={16} />
            </div>
            <div className='flex items-center gap-x-2'>
              <div>{displayMarkValue(finalMark || '')}</div>
            </div>
          </div>

          <div className='flex items-center gap-x-2 text-sm'>
            <div>
              <File className='text-khutwah-grey-lightest' size={16} />
            </div>
            <div className='flex items-center gap-x-2'>
              <div>{notes || '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function displayMarkValue(mark?: string) {
  if (!mark) {
    return ''
  }
  const parts = mark.split(':')
  return parts.length === 2 ? parts[1] : parts[0]
}
