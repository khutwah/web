import { SantriCard, SantriCardSkeleton } from './SantriCard'
import { ActivityStatus } from '@/models/activities'

export function Default() {
  return (
    <div className='flex flex-col gap-4'>
      <SantriCard
        activities={[
          { Sabaq: { status: ActivityStatus.draft, attendance: 'present' } },
          { Sabqi: { status: ActivityStatus.completed, attendance: 'absent' } },
          {
            Manzil: { status: ActivityStatus.completed, attendance: 'present' }
          }
        ]}
        avatarUrl='https://i.pravatar.cc/300'
        halaqahName='Halaqah 4.1'
        href='#'
        name='Kukuh Sulistyo'
      />

      <SantriCardSkeleton />
    </div>
  )
}

export function OverflowedContent() {
  return (
    <div className='max-w-56'>
      <SantriCard
        activities={[
          {
            Manzil: { status: ActivityStatus.completed, attendance: 'present' }
          }
        ]}
        avatarUrl='https://i.pravatar.cc/300'
        halaqahName='Halaqah 4.1'
        href='#'
        name='Kukuh Sulistyo Pakujoyonidiningrat Mangkubumi Hadijoyokusumo Wolfeschlegelsteinhausenbergerdorff'
      />
    </div>
  )
}
