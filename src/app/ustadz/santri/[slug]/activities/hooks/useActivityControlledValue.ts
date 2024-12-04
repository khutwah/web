import { ActivityFormValues, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import { getVersesByKey } from '../utils/getVersesByKey'
import { useSecondEffect } from '@/hooks/useSecondEffect'

export function useActivityControlledValue({
  control,
  setValue
}: {
  control: Control<ActivityFormValues>
  setValue: UseFormSetValue<ActivityFormValues>
}) {
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

  useSecondEffect(() => {
    if (startSurah) {
      setValue('end_surah', startSurah)
    }
  }, [startSurah])

  useSecondEffect(() => {
    if (startVerse) {
      setValue('end_verse', startVerse)
    }
  }, [startVerse])

  useSecondEffect(() => {
    if (startSurah && startVerse && endSurah && endVerse) {
      ;(async function () {
        const [start, end] = await Promise.all([
          getVersesByKey(`${startSurah}:${startVerse}`),
          getVersesByKey(`${endSurah}:${endVerse}`)
        ])

        if (start && end) {
          const startPage = start.verse.page_number
          const endPage = end.verse.page_number
          const pageCount = endPage - startPage + 1

          if (pageCount >= GLOBAL_TARGET_PAGE) {
            setValue('achieve_target', true)
          } else {
            setValue('achieve_target', false)
          }

          setValue('page_count', pageCount, { shouldValidate: true })
        } else {
          // TODO: Do something when important calculation cannot
          // be done due to technical issue
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
