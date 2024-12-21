import { createSeedClient } from '@snaplet/seed'
import { registerUser } from './utils/users'
import { registerHalaqah } from './utils/halaqah'
import { registerStudents } from './utils/students'
import { registerShifts } from './utils/shifts'
import { registerTags } from './utils/tags'
import { registerActivities } from './utils/activities'

async function runSeeder() {
  const seed = await createSeedClient()

  // Truncate all tables in the database
  await seed.$resetDatabase()

  await Promise.all([
    registerUser(seed),
    registerHalaqah(seed),
    registerTags(seed)
  ])

  await Promise.all([registerShifts(seed), registerStudents(seed)])

  await registerActivities(seed)

  console.log('Database seeded!')
}

// Run the seeder.
;(async () => {
  await runSeeder()
  process.exit()
})()
