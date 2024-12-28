import { Card, CardContent } from '@/components/Card/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs/Tabs'
import { BookOpenText, AlignJustify, Clock } from 'lucide-react'
import { getAyahLocationSummary } from '@/utils/mushaf'

interface StatsCardProps {
  surah: number
  ayah: number
  halaqahCount: number
}

export function StatsCard({ surah, ayah, halaqahCount }: StatsCardProps) {
  const summary = getAyahLocationSummary(surah, ayah)

  return (
    <div className='w-full'>
      <Tabs defaultValue='all-time' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-4'>
          <TabsTrigger value='all-time' className='text-sm'>
            ALL-TIME
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className='border'>
        <CardContent className='p-6'>
          <h2 className='text-lg text-mtmh-l-semibold mb-2 text-mtmh-tamarind-dark'>
            Menuju 30 Juz Mutqin
          </h2>

          <div className='grid grid-cols-2 gap-8 mb-6'>
            <div>
              <h3 className='text-mtmh-m-regular text-mtmh-grey-lightest mb-1'>
                Juz
              </h3>
              <div className='text-3xl font-bold'>
                {summary?.juz.total.toFixed(2) || 0}
              </div>
              <div className='text-mtmh-grey-lightest'>
                {summary?.juz.progress.toFixed(2) || 0}% perjalanan
              </div>
            </div>
            <div>
              <h3 className='text-mtmh-m-regular text-mtmh-grey-lightest mb-1'>
                Lajnah
              </h3>
              <div className='text-3xl font-bold'>
                {summary?.lajnah.previous && summary?.lajnah.previous > 0
                  ? summary?.lajnah.previous / 5
                  : 0}
                x
              </div>
              <div className='text-mtmh-grey-lightest'>
                {summary?.lajnah.previous || 0} juz sekali duduk
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='flex items-center gap-2'>
              <BookOpenText className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>{summary?.pages || 0}</div>
                <div className='text-xs text-mtmh-grey-lightest'>Halaman</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <AlignJustify className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>{summary?.ayahs || 0}</div>
                <div className='text-xs text-mtmh-grey-lightest'>Ayat</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>{halaqahCount || 0}x</div>
                <div className='text-xs text-mtmh-grey-lightest'>Halaqah</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
