import { copycat } from '@snaplet/copycat'
import { SeedClient } from '@snaplet/seed'
import { SANTRI_TO_REGISTER } from './users'

/**
 *
 * This to make this logic, student id, ..n = halaqahId
 * 1, 2 = 1 (halaqah 7.1)
 * 3, 4 = 2 (halaqah 8.1)
 * 5, 6 = 3 (halaqah 9.1)
 */
function mapValue(input: number) {
  return Math.ceil(input / 2)
}

export async function registerStudents(seed: SeedClient) {
  const students = seed.$store.public_users
    .filter((i) => i.role === 1)
    .toReversed()

  await seed.students(
    (x) =>
      x(SANTRI_TO_REGISTER.length, (ctx) => {
        const user = students[ctx.index]

        return {
          parent_id: user.id,
          name: user.name,
          halaqah_id: mapValue(ctx.index + 1)
        }
      }),
    {
      models: {
        students: {
          data: {
            nisn: (ctx) => copycat.scramble(ctx.seed),
            nis: (ctx) => copycat.scramble(ctx.seed),
            pin: (ctx) =>
              String(copycat.int(ctx.seed, { min: 100000, max: 999999 })),
            virtual_account: (ctx) =>
              String(
                copycat.int(ctx.seed, { min: 1000000000, max: 9999999999 })
              )
          }
        }
      },
      connect: true
    }
  )
}
