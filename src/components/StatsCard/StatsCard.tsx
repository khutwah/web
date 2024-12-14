import { Card, CardContent } from '@/components/Card/Card'
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs/Tabs'
import { BookOpenText, AlignJustify, Clock } from 'lucide-react'

export function StatsCard() {
  return (
    <div className='w-full'>
      <Tabs defaultValue='all-time' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 mb-4'>
          <TabsTrigger value='all-time' className='text-sm'>
            ALL-TIME
          </TabsTrigger>
          <TabsTrigger value='2023' className='text-sm'>
            2023
          </TabsTrigger>
          <TabsTrigger value='2022' className='text-sm'>
            2022
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className='border shadow-md'>
        <CardContent className='p-6'>
          <h2 className='text-lg text-mtmh-l-semibold mb-2 text-mtmh-tamarind-dark'>
            Menuju 30 Juz Mutqin
          </h2>

          <div className='grid grid-cols-2 gap-8 mb-6'>
            <div>
              <h3 className='text-mtmh-m-regular text-mtmh-grey-lightest mb-1'>
                Juz
              </h3>
              <div className='text-3xl font-bold'>20.50</div>
              <div className='text-mtmh-grey-lightest'>68.33% perjalanan</div>
            </div>
            <div>
              <h3 className='text-mtmh-m-regular text-mtmh-grey-lightest mb-1'>
                Lajnah
              </h3>
              <div className='text-3xl font-bold'>4x</div>
              <div className='text-mtmh-grey-lightest'>20 juz sekali duduk</div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='flex items-center gap-2'>
              <BookOpenText className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>300</div>
                <div className='text-xs text-mtmh-grey-lightest'>Halaman</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <AlignJustify className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>4000</div>
                <div className='text-xs text-mtmh-grey-lightest'>Ayat</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-4 h-4 text-mtmh-tamarind-dark' />
              <div>
                <div className='font-medium'>300x</div>
                <div className='text-xs text-mtmh-grey-lightest'>Halaqah</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
