import { Assessments } from '@/utils/supabase/models/assessments'
import { AddAsesmen } from '../AddAsesmen/AddAsesmen'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import Link from 'next/link'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { Button } from '@/components/Button/Button'
import { LogIn } from 'lucide-react'

interface AssessmentSectionProps {
  studentId: number
  role: number
  sessionRangeId?: number
}

export default async function AssessmentSection({
  studentId,
  role,
  sessionRangeId
}: AssessmentSectionProps) {
  const assessmentsInstance = new Assessments()
  const assessments = await assessmentsInstance.list({
    student_id: studentId,
    parent_assessment_id: null
  })

  if (assessments.error) {
    return (
      <StateMessage
        type='error'
        className='py-8'
        title='Terjadi kesalahan'
        description='Tidak dapat memuat data asesmen Santri.'
      />
    )
  }

  const ongoingAssessment = assessments.data.find(
    (assessment) => !assessment.final_mark
  )

  return (
    <section className='mx-6 mb-6'>
      {ongoingAssessment ? (
        <Link
          href={`${MENU_USTADZ_PATH_RECORDS.santri}/${studentId}/asesmen/${ongoingAssessment.id}`}
        >
          <Button variant='primary' className='w-full'>
            <LogIn size={16} />
            Lanjutkan {ongoingAssessment.session_name}
          </Button>
        </Link>
      ) : (
        <AddAsesmen role={role} sessionRangeId={sessionRangeId} />
      )}
    </section>
  )
}
