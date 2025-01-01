require('dotenv').config()

import { createSeedClient } from '@snaplet/seed'
import Supabase from '../helper/supabase'
import { circles, lajnah } from '../fixtures/circles'
import { registerTags } from '../helper/tags'
import { registerCircles } from '../helper/circles'
import { registerLajnahMembers } from '../helper/lajnah'
import { generateActivities } from '../helper/activities'

export default (async function () {
  const supabase = new Supabase()
  const seed = await createSeedClient()
  await seed.$resetDatabase()

  await Promise.all([
    registerTags(seed),
    registerLajnahMembers(supabase, seed, lajnah.members),
    registerCircles(supabase, seed, circles, new Date().getFullYear())
  ])

  // Generate activities for each student in each halaqah.
  const members = circles.flatMap(({ members }) => members)
  for (const { email } of members) {
    await Promise.all(
      Array.from({ length: 3 }, (_, i) => i + 1).map(async (activityType) =>
        generateActivities(seed, {
          studentEmail: email,
          activityType,
          numberOfDays: Number(process.env.NUMBER_OF_DAYS) || 4 * 7,
          startPoint: {
            surah: Number(process.env.START_SURAH) || 2,
            verse: Number(process.env.START_VERSE) || 1
          }
        })
      )
    )
  }

  console.log('Setup completed')
  process.exit(0)
})()
