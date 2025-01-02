import { SeedClient } from '@snaplet/seed'
import Supabase from './supabase'

export async function registerLajnahMembers(
  supabase: Supabase,
  seed: SeedClient,
  members: { name: string; email: string }[]
) {
  const password = process.env.STUDENTS_DEFAULT_PASSWORD || 'test123'
  for (const { name, email } of members) {
    const registeredMember = await supabase.registerUser(name, email, password)
    await seed.public_users(
      (x) =>
        x(1, () => ({
          sb_user_id: registeredMember.user?.id,
          name: registeredMember?.user?.user_metadata?.displayName ?? '',
          email: registeredMember.user?.email
        })),
      {
        models: {
          public_users: {
            data: {
              role: () => 3 // lajnah.
            }
          }
        }
      }
    )
  }
}
