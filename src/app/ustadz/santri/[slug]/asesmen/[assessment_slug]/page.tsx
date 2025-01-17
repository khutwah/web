import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/Card/Card'
import { Layout } from '@/components/Layout/Ustadz'
import { Navbar } from '@/components/Navbar/Navbar'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import { ASSESSMENT_TYPES, AssessmentType } from '@/models/assessments'
import SantriImage from '@/assets/sample-santri-photo.png'
import { Assessments } from '@/utils/supabase/models/assessments'
import Image from 'next/image'
import { Badge } from '@/components/Badge/Badge'
import { AssessmentCounters } from './components/AssessmentCounters/AssessmentCounters'
import { AssessmentCheckpointList } from '@/components/Assesment/CheckpointList'
import { parseSurahNameAndAyahFromRangeSegment } from '@minhajulhaq/mushaf'
import { AddAssessmentCheckpoint } from './components/AssessmentControls/AddAssessmentCheckpoint'
import { FinalizeAssessment } from './components/AssessmentControls/FinalizeAssessment'
import { Checkpoints as StatusCheckpoints } from '@/utils/supabase/models/checkpoints'
import { CancelAssessment } from './components/AssessmentControls/CancelAssessment'

interface AsesmenPageProps {
  params: Promise<{ assessment_slug: number; slug: number }>
}

export default async function AsesemenPage({
  params: paramsPromise
}: Readonly<AsesmenPageProps>) {
  const { assessment_slug: slug, slug: studentId } = await paramsPromise

  const assessmentsInstance = new Assessments()
  const statusChecpointsInstance = new StatusCheckpoints()

  const [assessments, statusCheckpoints] = await Promise.all([
    assessmentsInstance.list({
      parent_assessment_id: slug
    }),
    statusChecpointsInstance.list({ student_id: studentId })
  ])
  const statusCheckpoint = statusCheckpoints.data?.[0]

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
  // We always create 2 assessments when initially starting an assessment, so this will never be out of bounds.
  const lastAssessment = childAssessments[checkpointNumber - 1]
  const isAssessmentFinished = !!rootAssessment.final_mark

  return (
    <Layout>
      <Navbar text={`Ikhtibar ${rootAssessment.session_name!}`} />

      <div className='p-6'>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-sm border border-khutwah-snow-lighter rounded-md sticky top-0 z-10'>
          <CardHeader className='rounded-t-xl p-5 pb-3'>
            <CardTitle className='flex justify-between'>
              <div className='flex-col'>
                <div className='text-khutwah-m-regular text-khutwah-grey-lightest'>
                  Ikhtibar {assessmentTypeFormatted}
                </div>
                <div className='text-khutwah-l-semibold'>
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
          <CardContent className='p-5 pt-0'>
            {isAssessmentFinished ? (
              <div className='space-y-3 inline-block'>
                <Badge color='tamarind' text='Selesai' />

                <p className='text-khutwah-m-regular text-khutwah-grey-light italic'>
                  {rootAssessment.final_mark}
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-y-3 items-center'>
                <Badge
                  color='tamarind'
                  text={`Checkpoint ${checkpointNumber}`}
                  dashed
                />

                <AssessmentCounters assessment={lastAssessment} />
              </div>
            )}
          </CardContent>
        </Card>

        <AssessmentCheckpointList
          isFinished={isAssessmentFinished}
          checkpoints={assessments.data.map((assessment) => {
            const [startString, endString] = assessment.surah_range as [
              [string],
              [string] | undefined
            ]
            const start = parseSurahNameAndAyahFromRangeSegment(startString)
            const end = parseSurahNameAndAyahFromRangeSegment(endString)

            return {
              id: Number(assessment.id),
              mistakes: {
                low: assessment.low_mistake_count ?? 0,
                medium: assessment.medium_mistake_count ?? 0,
                high: assessment.high_mistake_count ?? 0
              },
              startSurah: start?.name ?? '',
              startVerse: start?.verse ?? 0,
              endSurah: end?.name,
              endVerse: end?.verse,
              timestamp: assessment.start_date
            }
          })}
        />

        {!rootAssessment.final_mark && (
          <div className='flex flex-col gap-y-6'>
            <div className='flex gap-x-2 mt-6'>
              <AddAssessmentCheckpoint
                lastCheckpoint={lastAssessment}
                surahRange={rootAssessment.surah_range}
              />

              <FinalizeAssessment
                statusCheckpoint={statusCheckpoint}
                lastCheckpoint={lastAssessment}
                surahRange={rootAssessment.surah_range}
              />
            </div>

            <hr />
            <div>
              <CancelAssessment
                statusCheckpoint={statusCheckpoint}
                lastCheckpoint={lastAssessment}
                surahRange={rootAssessment.surah_range}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
