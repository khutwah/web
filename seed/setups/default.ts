require('dotenv').config()

import { createSeedClient } from '@snaplet/seed'
import Supabase from '../helper/supabase'
import { halaqahList } from '../fixtures/halaqah'
import { registerTags } from '../helper/tags'
import { registerHalaqah } from '../helper/halaqah'
import { generateActivities } from '../helper/activities'

export default (async function () {
  const supabase = new Supabase()
  const seed = await createSeedClient()
  await seed.$resetDatabase()
  await Promise.all([
    registerTags(seed),
    registerHalaqah(supabase, seed, halaqahList, new Date().getFullYear())
  ])

  // Generate activities for each student in each halaqah.
  const members = halaqahList.flatMap((halaqah) => halaqah.members)
  for (const { email } of members) {
    await Promise.all(
      Array.from({ length: 3 }, (_, i) => i + 1).map(async (activityType) =>
        generateActivities(seed, {
          studentEmail: email,
          activityType,
          numberOfDays: 2 * 7,
          startPoint: {
            surah: 10,
            verse: 1
          }
        })
      )
    )
  }

  console.log('Setup completed')
  process.exit(0)
})()
