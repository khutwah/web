import { test } from 'node:test'
import assert from 'node:assert'
import per5JuzLajnah from './per-5-juz-lajnah.json'
import surahs from '../mushaf/surahs.json'

test('per-5-juz-lajnah consistency test', () => {
  ;[
    { id: 5, expect: 'An-Naba: 1 -> Qaf: 45' },
    { id: 10, expect: 'Asy-Syura: 1 -> As-Sajdah: 30' },
    { id: 15, expect: 'An-Naml: 1 -> Thaha: 135' },
    { id: 20, expect: 'Al-Baqarah: 1 -> An-Nisa: 176' },
    { id: 25, expect: 'Al-Maidah: 1 -> At-Taubah: 129' },
    { id: 30, expect: 'Yunus: 1 -> Al-Isra: 111' }
  ].forEach((entry) => {
    const lajnah = per5JuzLajnah.find((lajnah) => lajnah.id === entry.id)
    assert.ok(lajnah)

    const start = surahs.find(
      (surah) => lajnah.checkpoints.start.surah === surah.id
    )
    assert.ok(start)

    const end = surahs.find(
      (surah) => lajnah.checkpoints.end.surah === surah.id
    )
    assert.ok(end)

    assert.equal(
      `${start.name_simple}: ${lajnah.checkpoints.start.verse} -> ${end.name_simple}: ${lajnah.checkpoints.end.verse}`,
      entry.expect
    )
  })
})
