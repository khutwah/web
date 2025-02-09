import { SeedPg } from '@snaplet/seed/adapter-pg'
import { defineConfig } from '@snaplet/seed/config'
import { Client } from 'pg'

export default defineConfig({
  adapter: async () => {
    const client = new Client({
      connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
    })
    await client.connect()
    return new SeedPg(client)
  },
  select: ['!*', 'auth.users', 'public.*']
})
