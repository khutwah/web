import { copycat } from '@snaplet/copycat'
import { SeedClient } from '@snaplet/seed'

function mapValue(input: number) {
  return Math.ceil(input / 2)
}

export async function registerStudents(seed: SeedClient) {
  await seed.students(
    (x) =>
      x(6, (ctx) => {
        const user = seed.$store.public_users
          .toReversed()
          .filter((i) => i.role === 1)[ctx.index]

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
