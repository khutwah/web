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
import { CheckpointList } from '@/components/Lajnah/CheckpointList'
import { SURAH_ITEMS } from '@/models/activity-form'
import { Button } from '@/components/Button/Button'
import { Plus } from 'lucide-react'

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

        <CheckpointList
          checkpoints={childAssessments.map((assessment) => {
            const [startString, endString] = assessment.surah_range as [
              [string],
              [string] | undefined
            ]
            const start = parseSurahNameAndAyahFromRangeSegment(startString)
            const end = parseSurahNameAndAyahFromRangeSegment(endString)

            return {
              id: Number(assessment.id),
              mistakes: {
                small: assessment.low_mistake_count ?? 0,
                medium: assessment.medium_mistake_count ?? 0,
                large: assessment.high_mistake_count ?? 0
              },
              startSurah: start?.name!,
              startVerse: start?.verse!,
              endSurah: end?.name,
              endVerse: end?.verse,
              timestamp: assessment.start_date
            }
          })}
        />

        <Button className='w-full'>
          <Plus aria-label='Tambah' />
          Checkpoint
        </Button>
      </div>
    </Layout>
  )
}

function parseSurahNameAndAyahFromRangeSegment(value: [string] | undefined) {
  if (!value) return undefined

  const [surahNumber, verseNumber] = value[0].split(':')
  return {
    name: SURAH_ITEMS[Number(surahNumber) - 1].label,
    verse: Number(verseNumber)
  }
}
