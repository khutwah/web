import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/Card/Card'
import SantriImage from '@/assets/sample-santri-photo.png'
import { Layout } from '@/components/Layout/Santri'
import { Navbar } from '@/components/Navbar/Navbar'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { Suspense } from 'react'
import { Skeleton } from '@/components/Skeleton/Skeleton'
import { StateMessage } from '@/components/StateMessage/StateMessage'
import Image from 'next/image'
import { parseSurahNameAndAyahFromRangeSegment } from '@minhajulhaq/mushaf'
import { AssessmentCheckpointList } from '@/components/Assesment/CheckpointList'
import { Badge } from '@/components/Badge/Badge'
import { displayMarkValue } from '@/utils/assessments'
import { ASSESSMENT_TYPES, AssessmentType } from '@/models/assessments'
import { Assessments } from '@/utils/supabase/models/assessments'
import { AssessmentCounters } from './components/AssessmentCounters'

interface AsesmenPageProps {
  params: Promise<{ id: number }>
}

export default async function AssementPage({ params }: AsesmenPageProps) {
  return (
    <Layout>
      <ErrorBoundary fallback={<ErrorMessage />}>
        <Suspense fallback={<Fallback />}>
          <Wrapper params={params} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

async function Wrapper({ params: paramsPromise }: Readonly<AsesmenPageProps>) {
  const { id } = await paramsPromise

  const assessmentsInstance = new Assessments()
  const assessments = await assessmentsInstance.list({
    parent_assessment_id: id
  })

  if (assessments.error) {
    return (
      <StateMessage
        type='error'
        title='Maaf, Ada Kesalahan di sistem'
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
  const isCancelled = rootAssessment.final_mark?.startsWith('CANCELLED')

  return (
    <>
      <Navbar text={`Ikhtibar ${rootAssessment.session_name!}`} />

      <div className='p-6'>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-sm border border-khutwah-snow-lighter rounded-md sticky top-0 z-10'>
          <CardHeader className='rounded-t-xl p-5 pb-2'>
            <CardTitle className='flex justify-between'>
              <div className='flex-col'>
                <div className='text-khutwah-m-regular text-khutwah-grey-lightest'>
                  Ikhtibar {assessmentTypeFormatted}{' '}
                  {rootAssessment.assignee
                    ? `disimak oleh ${rootAssessment.assignee}`
                    : ''}
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
                <div className='flex justify-between'>
                  <Badge
                    color={isCancelled ? 'actually-red' : 'tamarind'}
                    text={isCancelled ? 'Ditunda' : 'Selesai'}
                  />
                </div>

                <p className='text-khutwah-m-regular text-khutwah-grey-light italic underline'>
                  {displayMarkValue(rootAssessment.final_mark || '')}
                </p>

                {rootAssessment.final_mark && rootAssessment.notes && (
                  <>
                    <div className='mt-2 flex gap-2 text-khutwah-neutral-white'>
                      <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
                        {rootAssessment?.low_mistake_count || 0}
                      </div>
                      <div className='h-6 w-6 rounded-full flex items-center justify-center text-khutwah-sm-regular text-khutwah-warning-70 border border-khutwah-warning-70'>
                        {rootAssessment?.high_mistake_count || 0}
                      </div>
                    </div>

                    <p className='text-khutwah-m-regular text-khutwah-grey-light italic'>
                      <span>Catatan:</span> &ldquo;{rootAssessment.notes}&rdquo;
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className='flex flex-col gap-y-3 items-center'>
                <Badge
                  color='tamarind'
                  text={`Checkpoint ${checkpointNumber}`}
                  dashed
                />
                <AssessmentCounters
                  mistakes={{
                    low: lastAssessment.low_mistake_count,
                    high: lastAssessment.high_mistake_count
                  }}
                />
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
              timestamp: assessment.start_date,
              notes: assessment.notes
            }
          })}
        />
      </div>
    </>
  )
}

function Fallback() {
  return (
    <>
      <Navbar text='Ikhtibar...' />
      <div className='p-6'>
        <Card className='bg-khutwah-neutral-white text-khutwah-grey-base shadow-sm border border-khutwah-snow-lighter rounded-md sticky top-0 z-10'>
          <CardHeader className='rounded-t-xl p-5 pb-2'>
            <CardTitle className='flex justify-between'>
              <div className='flex-col'>
                <div className='text-khutwah-m-regular text-khutwah-grey-lightest pb-2'>
                  Ikhtibar...
                </div>
                <Skeleton className='w-full h-4' />
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
          <CardContent className='p-5 pt-0'></CardContent>
        </Card>
      </div>
    </>
  )
}

function ErrorMessage() {
  return (
    <StateMessage
      className='py-8 px-4'
      description='Tidak dapat menampilkan data ikhtibar'
      title='Terjadi Kesalahan'
      type='error'
    />
  )
}
