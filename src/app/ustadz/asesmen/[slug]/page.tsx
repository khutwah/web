import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/Card/Card'
import { Layout } from '@/components/Layouts/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ASSESSMENT_TYPES, AssessmentType } from '@/models/assessments'
import SantriImage from '@/assets/sample-santri-photo.png'
import { Assessments } from '@/utils/supabase/models/assessments'
import Image from 'next/image'
import { Badge } from '@/components/Badge/Badge'
import { AssessmentCounters } from './components/AssessmentCounters/AssessmentCounters'

interface AsesmenPageProps {
  params: Promise<{ slug: number }>
}

export default async function AsesemenPage({
  params: paramsPromise
}: Readonly<AsesmenPageProps>) {
  const { slug } = await paramsPromise

  const assessmentsInstance = new Assessments()
  const assessments = await assessmentsInstance.list({
    parent_assessment_id: slug
  })

  if (assessments.error) {
    return (
      <StateMessage
        type='error'
        title='Maaf, Ada Kesalahan di Sistem'
        description='Terjadi kesalahan. Kami sedang memperbaiki. Mohon coba lagi nanti.'
      />
    )
  }

  const [rootAssessment, ...childAssessments] = assessments.data
  const assessmentTypeFormatted =
    ASSESSMENT_TYPES[rootAssessment.session_type as AssessmentType].title

  const checkpointNumber = childAssessments.length
  // We always create 2 assessments when starting one, so this will never be out of bounds.
  const lastAssessment = childAssessments[checkpointNumber - 1]

  return (
    <Layout>
      <Navbar text={rootAssessment.session_name!} />

      <div className='p-6'>
        <Card className='bg-mtmh-neutral-white text-mtmh-grey-base shadow-md border border-mtmh-snow-lighter rounded-md'>
          <CardHeader className='rounded-t-xl p-5 pb-3'>
            <CardTitle className='flex justify-between'>
              <div className='flex-col'>
                <div className='text-mtmh-m-regular text-mtmh-grey-lightest'>
                  Asesmen {assessmentTypeFormatted}
                </div>
                <div className='text-mtmh-l-semibold'>
                  {rootAssessment.student?.name}
                </div>
              </div>

              <Image
                src={SantriImage}
                alt=''
                width={52}
                height={52}
                className='rounded-full'
              />
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col p-5 pt-0 gap-y-3 items-center'>
            <Badge
              color='tamarind'
              text={`Checkpoint ${checkpointNumber}`}
              dashed
            />

            <AssessmentCounters assessment={lastAssessment} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
