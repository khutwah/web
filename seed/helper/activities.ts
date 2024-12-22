import dayjs from '@/utils/dayjs'
import { SeedClient } from '@snaplet/seed'
import { getShift, getStudent } from './halaqah'
import { ActivityStatus } from '@/models/activities'
import { getEndSurahAndAyah, getNextPage } from '@/utils/mushaf'
import { copycat } from '@snaplet/copycat'

const TZ = 'Asia/Jakarta'

interface Checkpoint {
  surah: number
  verse: number
}

interface GenerateActivitiesOptions {
  studentEmail: string
  activityType: number
  numberOfDays: number
  startPoint: Checkpoint
  targetPageCount?: number
}

/**
 * Generate activities for a student.
 * @param seed - The seed client.
 * @param param1 - The options for generating activities.
 */
export async function generateActivities(
  seed: SeedClient,
  {
    studentEmail,
    activityType,
    numberOfDays,
    targetPageCount = 2,
    startPoint
  }: GenerateActivitiesOptions
) {
  const student = getStudent(seed, studentEmail)
  const shift = getShift(seed, studentEmail)

  let start = startPoint
  // TODO(dio): Check if between Today and Today-numberOfDays there is weekend or not.
  let startDate = dayjs().tz(TZ).subtract(numberOfDays, 'day').toISOString()

  for (const _ of [...Array(numberOfDays).keys()]) {
    const pageCount = copycat.int(new Date().valueOf(), {
      min: 1,
      max: 2
    })
    const end = getEndSurahAndAyah(start.surah, start.verse, pageCount)
    if (!end) {
      throw new Error('End surah and ayah not found')
    }

    await seed.activities((x) =>
      x(1, () => {
        return {
          student_id: student?.id,
          shift_id: shift?.id,
          type: activityType,
          status: ActivityStatus.completed,
          student_attendance: 'present',
          achieve_target: pageCount >= targetPageCount,

          start_surah: start?.surah,
          start_verse: start?.verse,
          end_surah: end.surah,
          end_verse: end.ayah,
          page_count: pageCount,
          target_page_count: targetPageCount,

          tags: ['Terbata-bata', 'Cukup Baik'],

          // Creation info.
          created_by: shift?.ustadz_id,
          created_at: startDate
        }
      })
    )

    const nextPage = getNextPage(end.pageNumber)
    if (!nextPage) {
      throw new Error('Next page not found')
    }

    start = {
      surah: nextPage.boundaries[0].surah,
      verse: nextPage.boundaries[0].ayah
    }
    // FIXME(dio): Skip if startDate is weekend.
    startDate = dayjs(startDate).tz(TZ).add(1, 'day').toISOString()
  }
}
