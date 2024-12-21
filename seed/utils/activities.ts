import { ActivityStatus } from '@/models/activities'
import { SeedClient } from '@snaplet/seed'
import dayjs from 'dayjs'

function getDatesExcludingSunday() {
  const dates = []
  let currentDate = dayjs() // Start from today

  while (dates.length < 7) {
    // Collect 7 valid days
    if (currentDate.day() !== 0) {
      // Exclude Sunday
      dates.push(currentDate) // Add the date to the list
    }
    currentDate = currentDate.subtract(1, 'day') // Move one day back
  }

  return dates.reverse()
}

/**
 *
 * This will seed activities data
 * for each student for 1 week backward excluding sunday including today
 * for today activity will be in `draft` status, the rest will be `completed`
 */
export async function registerActivities(seed: SeedClient) {
  const students = seed.$store.students
  const shifts = seed.$store.shifts

  const days = getDatesExcludingSunday()

  const promiseSabaqActivities = students.map((student) => {
    return seed.activities(
      (x) =>
        x(7, (ctx) => {
          const date = days[ctx.index]

          const shift = shifts.find(
            (shift) => shift.halaqah_id === student.halaqah_id
          )

          return {
            student_id: student.id,
            type: 1,
            created_at: date.toISOString(),
            status:
              ctx.index === 6 ? ActivityStatus.draft : ActivityStatus.completed,
            page_count: 4,
            target_page_count: 4,
            student_attendance: 'present',
            achieve_target: true,
            start_surah: 1,
            end_surah: 1,
            start_verse: 1,
            end_verse: 7,
            shift_id: shift?.id ?? 1,
            created_by: shift?.ustadz_id,
            tags: ['Terbata-bata', 'Cukup Baik']
          }
        }),
      { connect: true }
    )
  })

  await Promise.all(promiseSabaqActivities)
}
