import { SeedClient } from '@snaplet/seed'
import { supabase } from './supabase'

interface User {
  email: string
  name: string
  id: string
}

export const USTADZ_TO_REGISTER = [
  {
    email: 'iram@ustadz.mtmh.com',
    name: 'Muhammad Iram'
  },
  {
    email: 'ardi@ustadz.mtmh.com',
    name: 'Muhammad Ardi Nurfattah'
  },
  {
    email: 'alfaz@ustadz.mtmh.com',
    name: 'Najjalloh Alfaz'
  }
]

export const SANTRI_TO_REGISTER = [
  // Halaqah 9.1 (grade: 9)
  {
    email: 'abdul@santri.mtmh.com',
    name: 'Abdul Aziz'
  },
  {
    email: 'usman@santri.mtmh.com',
    name: 'Usman Alhabsyi'
  },
  // Halaqah 8.1 (grade: 8)
  {
    email: 'azka@santri.mtmh.com',
    name: 'Azka Fatah'
  },
  {
    email: 'hamid@santri.mtmh.com',
    name: 'Hamid Abdullah'
  },
  // Halaqah 7.1 (grade: 7)
  {
    email: 'iskandar@santri.mtmh.com',
    name: 'Iskandar Hakim'
  },
  {
    email: 'budi@santri.mtmh.com',
    name: 'Budi Abdullah'
  }
]

// Helper function to sign up a user.
async function userSignup({
  email,
  password,
  displayName
}: {
  email: string
  password: string
  displayName: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName
      }
    }
  })
  if (error) {
    throw error
  }
  return data
}

export async function registerUser(seed: SeedClient) {
  let ustadz: User[] = []
  let students: User[] = []

  // Register all ustadz.
  const _ustadz = await Promise.all(
    USTADZ_TO_REGISTER.map((entry) =>
      userSignup({
        email: entry.email,
        password: process.env.DEFAULT_PASSWORD || 'testakun123',
        displayName: entry.name
      })
    )
  )

  // Register all santri
  const _students = await Promise.all(
    SANTRI_TO_REGISTER.map((entry) =>
      userSignup({
        email: entry.email,
        password: process.env.DEFAULT_PASSWORD || 'testakun123',
        displayName: entry.name
      })
    )
  )

  ustadz = _ustadz.map((data) => ({
    email: data.user?.email ?? '',
    id: data.user?.id ?? '',
    name: data.user?.user_metadata?.displayName ?? ''
  }))

  students = _students.map((data) => ({
    email: data.user?.email ?? '',
    id: data.user?.id ?? '',
    name: data.user?.user_metadata?.displayName ?? ''
  }))

  // seed ustadz data.
  await seed.public_users(
    (x) =>
      x(USTADZ_TO_REGISTER.length, (ctx) => {
        return {
          sb_user_id: ustadz[ctx.index].id,
          email: ustadz[ctx.index].email,
          name: ustadz[ctx.index].name
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

  // seed students data.
  await seed.public_users(
    (x) =>
      x(SANTRI_TO_REGISTER.length, (ctx) => {
        return {
          sb_user_id: students[ctx.index].id,
          email: students[ctx.index].email,
          name: students[ctx.index].name
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
}
