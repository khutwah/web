require('dotenv').config()

import { createSeedClient } from '@snaplet/seed'

export default (async function () {
  const seed = await createSeedClient()
  await seed.$resetDatabase()
  console.log('Setup completed')
  process.exit(0)
})()
