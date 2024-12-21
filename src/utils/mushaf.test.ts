import { test } from 'node:test'
import assert from 'node:assert'
import surahs from '@/data/mushaf/surahs.json'
import { getPage } from './mushaf'

test('getPage', () => {
  surahs.forEach((surah) => {
    ;[...Array(surah.verses_count).keys()].forEach((i) => {
      const surahAyah = `${surah.id}:${i + 1}`
      const page = getPage(surahAyah)
      assert.ok(page, `Page not found for ${surahAyah}`)
    })
  })
})
