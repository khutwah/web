import fs from 'node:fs'
import path from 'node:path'

const availableSetups: string[] = fs
  .readdirSync(path.join(__dirname, 'setups'))
  .map((file) => path.parse(file).name)

;(async () => {
  const desiredSetup = availableSetups.includes(
    process.argv[process.argv.length - 1]
  )
    ? process.argv[process.argv.length - 1]
    : 'default'
  const setup = await import(`./setups/${desiredSetup}`)
  console.log(
    `Running "${desiredSetup}" setup on ${process.env.NEXT_PUBLIC_SUPABASE_URL}...`
  )
  await setup.default
})()
