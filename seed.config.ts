import { SeedPg } from '@snaplet/seed/adapter-pg'
import { defineConfig } from '@snaplet/seed/config'
import { Client } from 'pg'

export default defineConfig({
  adapter: async () => {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    })
    await client.connect()
    return new SeedPg(client)
  },

  // Please make sure to update the following list of tables when adding or removing tables.
  select: ['!*', 'public.*']
})
