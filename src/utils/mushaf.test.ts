import { test } from 'node:test'
import assert from 'node:assert'
import surahs from '@/data/mushaf/surahs.json'
import { getPage, getPageCount, getEndSurahAndAyah } from './mushaf'

test('getPage', () => {
  surahs.forEach((surah) => {
    ;[...Array(surah.verses_count).keys()].forEach((i) => {
      const page = getPage(surah.id, i + 1)
      assert.ok(page, `Page not found for ${surah.name}:${i + 1}`)
    })
  })
})

test('getPageCount', () => {
  ;[
    { startSurah: 1, startAyah: 1, endSurah: 1, endAyah: 7, result: 1 },
    { startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 5, result: 2 },
    { startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 16, result: 3 },
    { startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 24, result: 4 }
  ].forEach(({ startSurah, startAyah, endSurah, endAyah, result }) => {
    assert.strictEqual(
      getPageCount(startSurah, startAyah, endSurah, endAyah),
      result
    )
  })
})

test('getEndSurahAndAyah', () => {
  ;[
    {
      startSurah: 1,
      startAyah: 1,
      pageCount: 1,
      result: { endSurah: 1, endAyah: 7 }
    },
    {
      startSurah: 1,
      startAyah: 1,
      pageCount: 2,
      result: { endSurah: 2, endAyah: 5 }
    },
    {
      startSurah: 1,
      startAyah: 1,
      pageCount: 3,
      result: { endSurah: 2, endAyah: 16 }
    },
    {
      startSurah: 1,
      startAyah: 1,
      pageCount: 4,
      result: { endSurah: 2, endAyah: 24 }
    }
  ].forEach(({ startSurah, startAyah, pageCount, result }) => {
    assert.deepStrictEqual(
      getEndSurahAndAyah(startSurah, startAyah, pageCount),
      result
    )
  })
})
