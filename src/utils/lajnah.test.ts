import { test } from 'node:test'
import assert from 'node:assert'
import { getPer5JuzLajnah } from './lajnah'

test('getPer5JuzLajnah', () => {
  ;[
    {
      surah: 78,
      ayah: 5,
      expect: {
        id: 5,
        pageDistance: 63
      }
    },
    {
      surah: 42,
      ayah: 1,
      expect: {
        id: 10,
        pageDistance: 67
      }
    },
    {
      surah: 27,
      ayah: 1,
      expect: {
        id: 15,
        pageDistance: 57
      }
    },
    {
      surah: 2,
      ayah: 1,
      expect: {
        id: 20,
        pageDistance: 105
      }
    },
    {
      surah: 5,
      ayah: 1,
      expect: {
        id: 25,
        pageDistance: 102
      }
    },
    {
      surah: 10,
      ayah: 1,
      expect: {
        id: 30,
        pageDistance: 86
      }
    }
  ].forEach(({ surah, ayah, expect }) => {
    const result = getPer5JuzLajnah(surah, ayah)
    assert.strictEqual(
      result?.id,
      expect.id,
      `Expected ${expect.id} but got ${result?.id}`
    )
    assert.strictEqual(
      result?.pageDistance,
      expect.pageDistance,
      `Expected ${expect.pageDistance} but got ${result?.pageDistance}`
    )
  })
})
