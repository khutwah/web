import { AddActivityCta } from '@/components/AddActivityCta/AddActivityCta'
import { StateMessage } from '@/components/StateMessage/StateMessage'

interface Student {
  id: number
  circles: {
    id: number
  } | null
}

interface ActivityCtaSectionProps {
  student: Student | null
  searchStringRecords?: Record<string, string>
}

export default function ActivityCtaSection({
  student,
  searchStringRecords
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
        <AddActivityCta
          activityType='Sabaq'
          className='w-full'
          halaqahId={student.circles.id}
          size='sm'
          studentId={student.id}
          searchStringRecords={searchStringRecords}
        />
        <AddActivityCta
          activityType='Sabqi'
          className='w-full'
          halaqahId={student.circles.id}
          size='sm'
          studentId={student.id}
          searchStringRecords={searchStringRecords}
        />
        <AddActivityCta
          activityType='Manzil'
          className='w-full'
          halaqahId={student.circles.id}
          size='sm'
          studentId={student.id}
          searchStringRecords={searchStringRecords}
        />
      </div>
    </section>
  )
}
