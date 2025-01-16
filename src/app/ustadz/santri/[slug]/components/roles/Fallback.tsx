import { Card } from '@/components/Card/Card'
import { ProgressGridSkeleton } from '@/components/Progress/ProgressGrid'
import { SantriActivityHeader } from '@/components/SantriActivity/Header'

export default function Fallback() {
  return (
    <>
      <div className='flex flex-col p-6 gap-y-4'>
        <div className='flex justify-center gap-x-[6.5px] text-khutwah-neutral-white text-khutwah-m-regular'>
          <SantriActivityHeader />
        </div>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-md border border-khutwah-snow-lighter rounded-md mb-2'>
          <ProgressGridSkeleton />
        </Card>
      </div>
    </>
  )
}
