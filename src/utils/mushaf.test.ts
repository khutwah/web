import { test } from 'node:test'
import assert from 'node:assert'
import surahs from '@/data/mushaf/surahs.json'
import { getPage } from './mushaf'

test('getPage', () => {
  surahs.forEach((surah) => {
    ;[...Array(surah.verses_count).keys()].forEach((i) => {
      const page = getPage(surah.id, i + 1)
      assert.ok(page, `Page not found for ${surah.name}:${i + 1}`)
    })
  })
})
