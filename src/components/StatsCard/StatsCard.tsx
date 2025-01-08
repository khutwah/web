import { Card, CardContent } from '@/components/Card/Card'
import {
  BookOpenText as HalamanCount,
  Flame as LajnahCount,
  Clock as HalaqahCount
} from 'lucide-react'
import { getAyahLocationSummary, getSurahName } from '@/utils/mushaf'

interface StatsCardProps {
  surah: number
  ayah: number
  halaqahCount: number
}

export function StatsCard({ surah, ayah, halaqahCount }: StatsCardProps) {
  const summary = getAyahLocationSummary(surah, ayah)

  return (
    <div className='w-full'>
      <Card className='border'>
        <CardContent className='p-6'>
          <h2 className='text-lg text-khutwah-l-semibold mb-2 text-khutwah-tamarind-dark'>
            Menuju 30 Juz Mutqin
          </h2>

          <div className='grid grid-cols-1 gap-8 mb-6'>
            <div>
              <div className='text-xs text-khutwah-grey-lightest'>
                Total setoran
              </div>
              <div className='text-xl font-bold'>
                {summary?.juz.juz} Juz{' '}
                {summary?.juz.pages &&
                  summary?.juz.pages > 0 &&
                  `dan ${summary?.juz.pages} halaman`}
              </div>
              <div className='text-khutwah-grey-lightest'>
                {summary?.juz.progress.toFixed(2) || 0}% perjalanan
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-8 mb-6'>
            <div>
              <div className='text-xs text-khutwah-grey-lightest'>
                Posisi setoran terakhir
              </div>
              <div className='text-xl font-bold'>
                Juz {summary?.current.juz}
              </div>
              <div className='text-khutwah-grey-lightest'>
                QS. {getSurahName(surah)}: {ayah}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='flex items-center gap-2'>
              <HalamanCount className='w-4 h-4 text-khutwah-tamarind-dark' />
              <div>
                <div className='font-medium'>{summary?.pages || 0}</div>
                <div className='text-xs text-khutwah-grey-lightest'>
                  Halaman
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <HalaqahCount className='w-4 h-4 text-khutwah-tamarind-dark' />
              <div>
                <div className='font-medium'>{halaqahCount || 0}x</div>
                <div className='text-xs text-khutwah-grey-lightest'>
                  Halaqah
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <LajnahCount className='w-4 h-4 text-khutwah-tamarind-dark' />
              <div>
                <div className='font-medium'>
                  {summary?.lajnah.previous && summary?.lajnah.previous > 0
                    ? summary?.lajnah.previous / 5
                    : 0}
                  x
                </div>
                <div className='text-xs text-khutwah-grey-lightest'>
                  Ikhtibar
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
