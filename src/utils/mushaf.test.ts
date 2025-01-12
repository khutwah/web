import { test } from 'node:test'
import assert from 'node:assert'
import surahs from '@/data/mushaf/surahs.json'
import {
  getPage,
  getPageCount,
  getEndSurahAndAyah,
  getAyahLocationSummary
} from './mushaf'

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
      result: { surah: 1, ayah: 7, pageNumber: 1 }
    },
    {
      startSurah: 78,
      startAyah: 1,
      pageCount: 3,
      result: { surah: 79, ayah: 46, pageNumber: 584 }
    }
  ].forEach(({ startSurah, startAyah, pageCount, result }) => {
    assert.deepStrictEqual(
      getEndSurahAndAyah(startSurah, startAyah, pageCount),
      result
    )
  })
})

test('getAyahLocationSummary', () => {
  ;[
    {
      surah: 17,
      ayah: 111,
      result: {
        current: {
          juz: 15,
          page: 293
        }
      }
    },
    {
      surah: 50,
      ayah: 45,
      result: {
        current: {
          juz: 26,
          page: 520
        }
      }
    },
    {
      surah: 4,
      ayah: 176,
      result: {
        current: {
          juz: 6,
          page: 106
        }
      }
    }
  ].forEach(({ surah, ayah, result }) => {
    const summary = getAyahLocationSummary(surah, ayah)
    assert.deepStrictEqual(summary?.current, result.current)
  })
})
