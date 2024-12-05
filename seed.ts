/**
 * ! Executing this script will delete all data in your database and seed it with 10 public_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed'
import { copycat } from '@snaplet/copycat'
import { createServerClient } from '@supabase/ssr'
import dayjs from 'dayjs'
import { JSONSerializable } from 'fictional'

const main = async () => {
  const seed = await createSeedClient()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return null
        },
        setAll() {}
      }
    }
  )

  // Truncate all tables in the database
  await seed.$resetDatabase()

  interface User {
    email: string
    id: string
  }

  let ustadz: User[] = []
  let students: User[] = []
  try {
    const _ustadz = await Promise.all([
      supabase.auth.signUp({
        email: 'iram@ustadz.mtmh.com',
        password: 'testakun123'
      }),
      supabase.auth.signUp({
        email: 'latief@ustadz.mtmh.com',
        password: 'testakun123'
      })
    ])
    const _students = await Promise.all([
      supabase.auth.signUp({
        email: `usman@santri.mtmh.com`,
        password: 'testakun123'
      }),
      supabase.auth.signUp({
        email: `abdul@santri.mtmh.com`,
        password: 'testakun123'
      })
    ])

    ustadz = _ustadz.map((data) => ({
      email: data.data.user?.email ?? '',
      id: data.data.user?.id ?? ''
    }))
    students = _students.map((data) => ({
      email: data.data.user?.email ?? '',
      id: data.data.user?.id ?? ''
    }))
  } catch (e) {
    console.error(e)
  }

  // seed ustad
  await seed.public_users(
    (x) =>
      x(2, (ctx) => {
        return {
          sb_user_id: ustadz[ctx.index].id,
          email: ustadz[ctx.index].email,
          name: ustadz[ctx.index].email.split('@')[0]
        }
      }),
    {
      models: {
        public_users: {
          data: {
            role: () => 2
          }
        }
      }
    }
  )

  // seed student
  await seed.public_users(
    (x) =>
      x(2, (ctx) => {
        return {
          sb_user_id: students[ctx.index].id,
          email: students[ctx.index].email,
          name: students[ctx.index].email.split('@')[0]
        }
      }),
    {
      models: {
        public_users: {
          data: {
            role: () => 1
          }
        }
      }
    }
  )

  await seed.halaqah((x) =>
    x(3, (ctx) => {
      return {
        name: `Halaqah ${ctx.index + 1}`,
        academic_year: 2024,
        class: String(ctx.index + 7)
      }
    })
  )

  await seed.shifts(
    (x) =>
      x(2, (ctx) => {
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
  // Seed for the "replacement" case.
  await seed.shifts(
    (x) =>
      x(1, () => {
        return {
          halaqah_id: 2,
          ustadz_id: 1,
          location: 'Saung Umar bin Khattab',
          start_date: dayjs().startOf('day').toISOString(),
          end_date: dayjs().endOf('day').toISOString()
        }
      }),
    { connect: true }
  )
  await seed.students(
    (x) =>
      x(2, (ctx) => {
        const user = seed.$store.public_users.filter((i) => i.role === 1)[
          ctx.index
        ]
        return {
          parent_id: user.id,
          name: user.name
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

  const tagStore = new Set()
  const fn = (seed: JSONSerializable): string =>
    copycat.oneOf(seed, [
      'Baik Sekali',
      'Cukup Baik',
      'Terbata-bata',
      'Kurang Baik'
    ])
  await seed.tags((x) => x(4), {
    models: {
      tags: {
        data: {
          name: (ctx) => copycat.unique(ctx.seed, fn, tagStore) as string,
          type: (ctx) =>
            copycat.oneOf(ctx.seed, ['Kefasihan', 'Kemampuan menghafal'])
        }
      }
    }
  })

  await seed.activities(
    (x) =>
      // 3 for each activities.
      x(7 * 3, (ctx) => {
        const indexWithMaxNumber6 = ctx.index % 7
        const pageAmount = 7 - indexWithMaxNumber6 - 1

        return {
          student_id: 1,
          type: (ctx.index % 3) + 1,
          created_at: dayjs()
            .startOf('week')
            .add(indexWithMaxNumber6, 'days')
            .add(7, 'hour')
            .toISOString(),
          page_count: pageAmount,
          target_page_count: 4,
          student_attendance: pageAmount === 0 ? 'absent' : 'present',
          achieve_target: pageAmount >= 4,
          end_surah: 1,
          start_verse: 1,
          end_verse: 7,
          tags: '["Terbata-bata", "Cukup Baik"]'
        }
      }),
    { connect: true }
  )

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!')

  process.exit()
}

main()
