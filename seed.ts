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
import { ActivityStatus } from '@/models/activities'

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

  const USTADZ_TO_REGISTER = [
    'iram@ustadz.mtmh.com',
    'latief@ustadz.mtmh.com',
    'ardi@ustadz.mtmh.com',
    'alfaz@ustadz.mtmh.com',
    'ahmad@ustadz.mtmh.com',
    'adi@ustadz.mtmh.com'
  ]
  try {
    const _ustadz = await Promise.all(
      USTADZ_TO_REGISTER.map((email) =>
        supabase.auth.signUp({
          email: email,
          password: 'testakun123'
        })
      )
    )
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
      x(4, (ctx) => {
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
    x(5, (ctx) => {
      return {
        name: `Halaqah ${ctx.index + 1}`,
        academic_year: 2024,
        class: String(ctx.index + 7)
      }
    })
  )

  await seed.shifts(
    (x) =>
      x(5, (ctx) => {
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
          ustadz_id: 4,
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

  // Add 1 entry for each activity, for a month.
  const numberOfActivities = 31 * 3

  await seed.activities(
    (x) =>
      x(numberOfActivities, (ctx) => {
        const type = Math.floor(ctx.index / 31) + 1

        const numberOfDaysAdded = ctx.index % 31
        // The idea is so that on Saturday, there are 0 page_count.
        const indexWithMaxNumber6 = ctx.index % 7
        const pageCount = 7 - indexWithMaxNumber6 - 1

        return {
          student_id: 1,
          type,
          created_at: dayjs()
            .startOf('month')
            .add(numberOfDaysAdded, 'days')
            .add(7, 'hour')
            .toISOString(),
          // On day 26th, the status is always draft.
          status:
            ctx.index === numberOfActivities - 5
              ? ActivityStatus.draft
              : ActivityStatus.completed,
          page_count: pageCount,
          target_page_count: 4,
          student_attendance: pageCount === 0 ? 'absent' : 'present',
          achieve_target: pageCount >= 4,
          start_surah: 1,
          end_surah: 1,
          start_verse: 1,
          end_verse: 7,
          shift_id: 1,
          created_by: 1,
          tags: ['Terbata-bata', 'Cukup Baik']
        }
      }),
    { connect: true }
  )

  // sabaq only for testing chart usecase
  await seed.activities((x) =>
    x(7, (ctx) => {
      const indexWithMaxNumber6 = ctx.index % 7

      const pageCount = 7 - indexWithMaxNumber6 - 1

      return {
        student_id: 2,
        type: 1,
        created_at: dayjs()
          .startOf('week')
          .add(indexWithMaxNumber6, 'days')
          .add(7, 'hour')
          .toISOString(),
        page_count: pageCount,
        target_page_count: 4,
        student_attendance: pageCount === 0 ? 'absent' : 'present',
        achieve_target: pageCount >= 4,
        start_surah: 1,
        end_surah: 1,
        start_verse: 1,
        end_verse: 7,
        tags: ['Terbata-bata', 'Cukup Baik'],
        shift_id: 5,
        created_by: 5,
        status: 'completed'
      }
    })
  )

  // completed checkpoint
  await seed.checkpoint((x) =>
    x(1, () => {
      const lastActivity =
        seed.$store.activities[seed.$store.activities.length - 6]
      return {
        student_id: 2,
        start_date: lastActivity.created_at!,
        end_date: dayjs(lastActivity.created_at).add(14, 'hour').toISOString(),
        page_count_accumulation: 20,
        last_activity_id: lastActivity.id!,
        status: 'lajnah-completed',
        part_count: 1
      }
    })
  )

  // inprogress checkpoint
  await seed.checkpoint((x) =>
    x(1, () => {
      const lastActivity = seed.$store.activities
        .filter((item) => item.student_id === 1)
        .reverse()[0]
      return {
        student_id: 1,
        start_date: new Date().toISOString(),
        end_date: null,
        page_count_accumulation: 0,
        last_activity_id: lastActivity.id!,
        status: 'inactive',
        notes: 'sedang sakit'
      }
    })
  )

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!')

  process.exit()
}

main()
