import dayjs from '@/utils/dayjs'
import { SeedClient } from '@snaplet/seed'
import { getShift, getStudent } from './circles'
import { ActivityStatus, GLOBAL_TARGET_PAGE_COUNT } from '@/models/activities'
import { getEndSurahAndAyah, getNextPage } from '@/utils/mushaf'
import { copycat } from '@snaplet/copycat'
import { Database } from '@/models/database.types'

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
  maxPageCount?: number
  includeToday?: boolean
  includeWeekend?: boolean
}

type Activity = Database['public']['Tables']['activities']['Insert']

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
    startPoint,
    maxPageCount = 5,
    targetPageCount = GLOBAL_TARGET_PAGE_COUNT,
    includeToday = false,
    includeWeekend = false
  }: GenerateActivitiesOptions
) {
  const student = getStudent(seed, studentEmail)
  const shift = getShift(seed, studentEmail)

  let activities: Activity[] = []

  let start = startPoint
  let endDate = dayjs().tz(TZ)

  if (!includeToday) {
    endDate = endDate.subtract(1, 'day')
    if (isWeekend(endDate, TZ) && !includeWeekend) {
      endDate = endDate.subtract(endDate.tz(TZ).day() === 0 ? 2 : 1, 'day')
    }
  }

  for (const day of getDays(endDate, numberOfDays, TZ, includeWeekend)) {
    const pageCount = copycat.int(
      copycat.scramble(studentEmail + day.day() + activityType),
      {
        min: 1,
        max: maxPageCount
      }
    )
    const end = getEndSurahAndAyah(start.surah, start.verse, pageCount)
    if (!end) {
      throw new Error('End surah and ayah not found')
    }

    activities.unshift({
      student_id: student?.id,
      shift_id: shift?.id,
      type: activityType,
      status: ActivityStatus.completed,
      student_attendance: 'present',
      is_target_achieved: pageCount >= targetPageCount,

      start_surah: start.surah,
      start_verse: start.verse,
      end_surah: end.surah,
      end_verse: end.ayah,
      page_count: pageCount,
      target_page_count: targetPageCount,

      tags: ['Terbata-bata', 'Cukup Baik'],

      // Creation info.
      created_by: shift?.ustadz_id,
      created_at: day.toISOString()
    })

    const nextPage = getNextPage(end.pageNumber)
    if (!nextPage) {
      throw new Error('Next page not found')
    }

    start = {
      surah: nextPage.boundaries[0].surah,
      verse: nextPage.boundaries[0].ayah
    }
  }

  await seed.activities((x) =>
    x(activities.length, (ctx) => {
      return {
        ...(activities[ctx.index] as any)
      }
    })
  )
}

function getDays(
  startDate: dayjs.Dayjs,
  numberOfDays: number,
  tz: string,
  includeWeekend: boolean
): dayjs.Dayjs[] {
  const days: dayjs.Dayjs[] = []
  let date = startDate
  while (days.length < numberOfDays) {
    if (isWeekend(date, tz) && !includeWeekend) {
      date = date.subtract(date.tz(tz).day() === 0 ? 2 : 1, 'day')
    }
    days.push(date)
    date = date.subtract(1, 'day')
  }
  return days
}

// Helper function to check if a date is weekend.
function isWeekend(date: dayjs.Dayjs, tz: string): boolean {
  return date.tz(tz).day() === 0 || date.tz(tz).day() === 6
}
