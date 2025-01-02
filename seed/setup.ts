import fs from 'node:fs'
import path from 'node:path'

const availableSetups: string[] = fs
  .readdirSync(path.join(__dirname, 'setups'))
  .map((file) => path.parse(file).name)

;(async () => {
  const arg = process.argv.at(-1)
  const desiredSetup = availableSetups.includes(arg!) ? arg : 'default'
  const setup = await import(`./setups/${desiredSetup}`)
  console.log(
    `Running "${desiredSetup}" setup on ${process.env.SUPABASE_API_URL}...`
  )
  await setup.default
})()
