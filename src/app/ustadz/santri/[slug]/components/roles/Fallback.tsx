import { Card, CardHeader } from '@/components/Card/Card'
import { ProgressGridSkeleton } from '@/components/Progress/ProgressGrid'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'
import { Navbar } from '@/components/Navbar/Navbar'
import { ProgressViewToggle } from '../ProgressView/PorgressViewToggle'

export default function Fallback() {
  return (
    <>
      <Navbar
        text='Detail Santri'
        rightComponent={<ProgressViewToggle initialView={'grid'} isLoading />}
      />
      <div className='bg-khutwah-red-base w-full p-4 h-[225px] absolute -z-10' />
      <div className='flex flex-col p-6 gap-y-4'>
        <div className='flex justify-center gap-x-[6.5px] text-khutwah-neutral-white text-khutwah-m-regular'>
          <SantriActivityHeader />
        </div>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-md border border-khutwah-snow-lighter rounded-md mb-2'>
          <CardHeader className='flex flex-row justify-between items-center border-b border-b-khutwah-snow-lighter'>
            <Skeleton className='w-full h-12' />
          </CardHeader>
          <ProgressGridSkeleton />
        </Card>

        <Skeleton className='w-full h-16' />
        <Skeleton className='w-full h-16' />
        <section className='flex flex-col gap-3'>
          <ul className='flex overflow-x-scroll gap-3 px-6 items-start'>
            <li key={0} className='w-[300px] flex-shrink-0 h-full'>
              <Skeleton className='w-full h-36' />
            </li>
            <li key={1} className='w-[300px] flex-shrink-0 h-full'>
              <Skeleton className='w-full h-36' />
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
