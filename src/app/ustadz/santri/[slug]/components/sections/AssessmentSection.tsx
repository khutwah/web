import { Assessments } from '@/utils/supabase/models/assessments'
import { AddAsesmen } from '../AddAsesmen/AddAsesmen'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import Link from 'next/link'
import { MENU_USTADZ_PATH_RECORDS } from '@/utils/menus/ustadz'
import { Button } from '@/components/Button/Button'
import { LogIn } from 'lucide-react'
import { StatusCheckpoint } from '@/models/checkpoints'
import { AssessmentType } from '@/models/assessments'
import { ROLE } from '@/models/auth'

interface Assessment {
  id?: number
  session_name?: string | null
  session_type: string | null
}

interface AssessmentSectionProps {
  studentId: number
  role: number
  sessionRangeId?: number
  ongoingAssessment?: Assessment

  // Props for updating status
  checkpoint?: StatusCheckpoint
}

export default async function AssessmentSection({
  studentId,
  role,
  sessionRangeId,
  ongoingAssessment,
  checkpoint
}: AssessmentSectionProps) {
  const isLajnahAssessement =
    ongoingAssessment?.session_type === AssessmentType.lajnah

  return (
    <>
      {(isLajnahAssessement && role === ROLE.LAJNAH) ||
        (!isLajnahAssessement && (
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
              <AddAsesmen
                role={role}
                sessionRangeId={sessionRangeId}
                checkpoint={checkpoint}
              />
            )}
          </section>
        ))}
    </>
  )
}
