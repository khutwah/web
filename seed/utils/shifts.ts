import { SeedClient } from '@snaplet/seed'
import dayjs from 'dayjs'

export async function registerShifts(seed: SeedClient) {
  /**
   * this seed will populate
   * shifts table for permanent assignee for each halaqah (7.1, 8.1, 9.1) in order
   */
  await seed.shifts(
    (x) =>
      x(3, (ctx) => {
        return {
          halaqah_id: ctx.index + 1,
          ustadz_id: ctx.index + 1,
          location: 'Saung Umar bin Khattab',
          start_date: dayjs().startOf('day').toISOString(),
          end_date: null
        }
      }),
    { connect: true }
  )
}
