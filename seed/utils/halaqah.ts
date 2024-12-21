import { SeedClient } from '@snaplet/seed'

export async function registerHalaqah(seed: SeedClient) {
  await seed.halaqah((x) =>
    x(3, (ctx) => {
      return {
        name: `Halaqah ${ctx.index + 7}.1`,
        academic_year: new Date().getFullYear(),
        class: String(ctx.index + 7)
      }
    })
  )
}
