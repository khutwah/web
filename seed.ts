/**
 * ! Executing this script will delete all data in your database and seed it with 10 public_users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed'
import { copycat } from '@snaplet/copycat'
import { createServerClient } from '@supabase/ssr'
import { DEFAULT_EMAIL_DOMAIN } from '@/models/auth'

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
        email: `ustadz_1@ustadz.${DEFAULT_EMAIL_DOMAIN!}`,
        password: 'orq[s$^zgx6L'
      }),
      supabase.auth.signUp({
        email: `ustadz_2@ustadz.${DEFAULT_EMAIL_DOMAIN!}`,
        password: 'orq[s$^zgx6L'
      })
    ])
    const _students = await Promise.all([
      supabase.auth.signUp({
        email: `student_1@${DEFAULT_EMAIL_DOMAIN!}`,
        password: 'orq[s$^zgx6L'
      }),
      supabase.auth.signUp({
        email: `student_2@${DEFAULT_EMAIL_DOMAIN!}`,
        password: 'orq[s$^zgx6L'
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
          email: ustadz[ctx.index].email
        }
      }),
    {
      models: {
        public_users: {
          data: {
            name: (ctx) => copycat.fullName(ctx.seed),
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
          email: students[ctx.index].email
        }
      }),
    {
      models: {
        public_users: {
          data: {
            name: (ctx) => copycat.fullName(ctx.seed),
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
        academic_year: 2024
      }
    })
  )

  await seed.shifts(
    (x) =>
      x(2, (ctx) => {
        return {
          halaqah_id: ctx.index + 1,
          ustadz_id: ctx.index + 1,
          start_date: new Date().toISOString(),
          end_date: null
        }
      }),
    { connect: true }
  )
  await seed.students(
    (x) =>
      x(2, (ctx) => {
        return {
          parent_id: seed.$store.public_users.filter((i) => i.role === 1)[
            ctx.index
          ].id
        }
      }),
    {
      models: {
        students: {
          data: {
            name: (ctx) => copycat.fullName(ctx.seed),
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
  await seed.tags((x) => x(4))

  await seed.activities(
    (x) =>
      x(2, () => ({
        type: 1,
        page_amount: 2,
        start_surah: '1',
        end_surah: '1',
        start_verse: '1',
        end_verse: '7',
        tags: '["Terbata-bata", "Cukup Baik"]'
      })),
    { connect: true }
  )

  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log('Database seeded successfully!')

  process.exit()
}

main()
