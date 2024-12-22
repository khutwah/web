import dayjs from '@/utils/dayjs'
import { copycat } from '@snaplet/copycat'
import { SeedClient } from '@snaplet/seed'
import Supabase from './supabase'
import { Halaqah as HalaqahType } from './types'

export async function registerHalaqah(
  supabase: Supabase,
  seed: SeedClient,
  halaqahList: HalaqahType[],
  year: number
) {
  await seed.halaqah((x) =>
    x(halaqahList.length, (ctx) => {
      const halaqah = halaqahList[ctx.index]
      return {
        name: halaqah.name,
        academic_year: year,
        class: halaqah.grade,
        label: halaqah.label,
        location: halaqah.location
      }
    })
  )

  const password = process.env.DEFAULT_STUDENT_PASSWORD || 'testakun123'
  for (const { name: halaqahName, owner, members } of halaqahList) {
    const registeredOwner = await supabase.registerUser(
      owner.name,
      owner.email,
      password
    )
    await seed.public_users(
      (x) =>
        x(1, () => ({
          sb_user_id: registeredOwner.user?.id,
          name: registeredOwner?.user?.user_metadata?.displayName ?? '',
          email: registeredOwner.user?.email
        })),
      {
        models: {
          public_users: {
            data: {
              role: () => 2 // ustadz.
            }
          }
        }
      }
    )

    await seed.shifts(
      (x) =>
        x(1, () => {
          const halaqah = seed.$store.halaqah.find(
            (i) => i.name === halaqahName
          )
          const user = seed.$store.public_users.find(
            (i) => i.email === owner.email
          )
          return {
            halaqah_id: halaqah?.id,
            ustadz_id: user?.id,
            location: 'Saung Umar bin Khattab',
            start_date: dayjs().startOf('month').toISOString(),
            end_date: null
          }
        }),
      { connect: true }
    )

    const registeredMembers = await Promise.all(
      members.map((member) => {
        return supabase.registerUser(member.name, member.email, password)
      })
    )

    await seed.public_users(
      (x) =>
        x(members.length, (ctx) => ({
          sb_user_id: registeredMembers[ctx.index].user?.id,
          name:
            registeredMembers[ctx.index].user?.user_metadata?.displayName ?? '',
          email: registeredMembers[ctx.index].user?.email
        })),
      {
        models: {
          public_users: {
            data: {
              role: () => 1 // santri.
            }
          }
        }
      }
    )

    await seed.students(
      (x) =>
        x(members.length, (ctx) => {
          const user = seed.$store.public_users.find(
            (i) => i.role === 1 && i.email === members[ctx.index].email
          )
          const halaqah = seed.$store.halaqah.find(
            (i) => i.name === halaqahName
          )
          return {
            parent_id: user?.id,
            name: user?.name,
            halaqah_id: halaqah?.id
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
}

export function getStudent(seed: SeedClient, email: string) {
  const user = seed.$store.public_users.find((i) => i.email === email)
  const student = seed.$store.students.find((i) => i.parent_id === user?.id)
  return student
}

export function getShift(seed: SeedClient, email: string) {
  const user = seed.$store.public_users.find((i) => i.email === email)
  const student = seed.$store.students.find((i) => i.parent_id === user?.id)
  const shift = seed.$store.shifts.find(
    (i) => i.halaqah_id === student?.halaqah_id
  )
  return shift
}
