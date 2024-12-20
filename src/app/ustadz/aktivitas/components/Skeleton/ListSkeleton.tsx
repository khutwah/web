import { Skeleton } from '@/components/Skeleton/Skeleton'

export function ListSkeleton() {
  return (
    <ul className='flex flex-col p-4 gap-4'>
      <li>
        <Skeleton className='w-full h-60'></Skeleton>
      </li>
      <li>
        <Skeleton className='w-full h-60'></Skeleton>
      </li>
      <li>
        <Skeleton className='w-full h-60'></Skeleton>
      </li>
    </ul>
  )
}