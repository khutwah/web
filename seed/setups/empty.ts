require('dotenv').config()

import { createSeedClient } from '@snaplet/seed'
import Supabase from '../helper/supabase'
import { halaqahList } from '../fixtures/halaqah'
import { registerTags } from '../helper/tags'
import { registerHalaqah } from '../helper/halaqah'

export default (async function () {
  const supabase = new Supabase()
  const seed = await createSeedClient()
  await seed.$resetDatabase()
  await Promise.all([
    registerTags(seed),
    registerHalaqah(supabase, seed, halaqahList, new Date().getFullYear())
  ])

  console.log('Setup completed')
  process.exit(0)
})()
