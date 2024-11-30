import { ActivityFormValues, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { useEffect } from 'react'
import { Control, useController, useWatch } from 'react-hook-form'
import { getVersesByKey } from '../utils/getVersesByKey'

export function useActivityControlledValue(
  control: Control<ActivityFormValues>
) {
  const [startSurah, endSurah, startVerse, endVerse, tags, achieveTarget] =
    useWatch({
      control,
      name: [
        'start_surah',
        'end_surah',
        'start_verse',
        'end_verse',
        'tags',
        'achieve_target'
      ]
    })

  const endSurahController = useController({
    name: 'end_surah',
    control
  })

  const endVerseController = useController({
    name: 'end_verse',
    control
  })

  const pageCountController = useController({
    name: 'page_amount',
    control
  })

  const achieveTargetController = useController({
    name: 'achieve_target',
    control
  })

  useEffect(() => {
    if (startSurah) {
      endSurahController.field.onChange(startSurah)
    }
  }, [startSurah])

  useEffect(() => {
    if (startVerse) {
      endVerseController.field.onChange(startVerse)
    }
  }, [startVerse])

  useEffect(() => {
    if (startSurah && startVerse && endSurah && endVerse) {
      ;(async function () {
        const [start, end] = await Promise.all([
          getVersesByKey(`${startSurah}:${startVerse}`),
          getVersesByKey(`${endSurah}:${endVerse}`)
        ])

        if (start && end) {
          const startPage = start.verse.page_number
          const endPage = end.verse.page_number
          const pageCount = endPage - startPage

          if (endPage - startPage >= GLOBAL_TARGET_PAGE) {
            achieveTargetController.field.onChange(true)
          } else {
            achieveTargetController.field.onChange(false)
          }

          pageCountController.field.onChange(pageCount)
        } else {
          // TODO: Do something when important calculation cannot
          // be done due to technical issue
        }
      })()
    }
  }, [startSurah, startVerse, endSurah, endVerse])

  return {
    startSurah: startSurah,
    endSurah: endSurah,
    startVerse: startVerse,
    endVerse: endVerse,
    tags: tags,
    achieveTarget
  }
}
