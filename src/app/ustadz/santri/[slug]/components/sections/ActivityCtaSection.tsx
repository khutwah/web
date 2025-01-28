import { AddActivityCta } from '@/components/AddActivityCta/AddActivityCta'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ActivityType } from '@/models/activities'

interface Student {
  id: number
  circles: {
    id: number
  } | null
}

interface Activity {
  id: number
  type: ActivityType | null
  status: string
}

interface ActivityCtaSectionProps {
  student: Student | null
  searchStringRecords?: Record<string, string>
  activitiesForToday: Activity[]
  isManzilOnly?: boolean
}

export default function ActivityCtaSection({
  student,
  searchStringRecords,
  activitiesForToday,
  isManzilOnly
}: ActivityCtaSectionProps) {
  if (!student || !student.circles) {
    return (
      <StateMessage
        type='error'
        className='py-8'
        title='Terjadi kesalahan'
        description='Tidak dapat memuat data Santri.'
      />
    )
  }

  return (
    <section className='mx-6 mb-6'>
      <h2 className='text-khutwah-grey-base mb-3 font-semibold text-sm'>
        Tambah Input
      </h2>
      <div className='flex gap-1.5'>
        {!isManzilOnly && (
          <AddActivityCta
            activityType='Sabaq'
            className='w-full'
            halaqahId={student.circles.id}
            size='sm'
            studentId={student.id}
            searchStringRecords={searchStringRecords}
            activityForToday={activitiesForToday.find(
              ({ type }) => ActivityType.Sabaq === type
            )}
          />
        )}
        {!isManzilOnly && (
          <AddActivityCta
            activityType='Sabqi'
            className='w-full'
            halaqahId={student.circles.id}
            size='sm'
            studentId={student.id}
            searchStringRecords={searchStringRecords}
            activityForToday={activitiesForToday.find(
              ({ type }) => ActivityType.Sabqi === type
            )}
          />
        )}
        <AddActivityCta
          activityType='Manzil'
          className='w-full'
          halaqahId={student.circles.id}
          size='sm'
          studentId={student.id}
          searchStringRecords={searchStringRecords}
          activityForToday={
            isManzilOnly
              ? undefined
              : activitiesForToday.find(
                  ({ type }) => ActivityType.Manzil === type
                )
          }
        />
      </div>
    </section>
  )
}
