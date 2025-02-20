import { copycat } from '@snaplet/copycat'
import { SeedClient } from '@snaplet/seed'
import { JSONSerializable } from 'fictional'

export async function registerTags(seed: SeedClient) {
  const tagStore = new Set()
  const fn = (seed: JSONSerializable): string =>
    // TODO(dio-khutwah): Move this to fixtures.
    copycat.oneOf(seed, [
      'Baik Sekali',
      'Cukup Baik',
      'Terbata-bata',
      'Kurang Baik'
    ])
  await seed.tags((x) => x(4), {
    models: {
      tags: {
        data: {
          name: (ctx) => copycat.unique(ctx.seed, fn, tagStore) as string,
          category: (ctx) =>
            copycat.oneOf(ctx.seed, ['Kefasihan', 'Kemampuan menghafal'])
        }
      }
    }
  })
}
