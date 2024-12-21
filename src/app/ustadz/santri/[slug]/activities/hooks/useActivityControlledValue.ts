import { ActivityFormValues, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import { useSecondEffect } from '@/hooks/useSecondEffect'
import { getPage } from '@/utils/mushaf'

interface UseActivityControlledValueArgs {
  control: Control<ActivityFormValues>
  setValue: UseFormSetValue<ActivityFormValues>
  autofillSurah?: boolean
}

export function useActivityControlledValue({
  control,
  setValue,
  autofillSurah = true
}: UseActivityControlledValueArgs) {
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
    if (autofillSurah && startSurah) {
      setValue('end_surah', startSurah)
    }
  }, [autofillSurah, startSurah])

  useSecondEffect(() => {
    if (autofillSurah && startVerse) {
      setValue('end_verse', startVerse)
    }
  }, [autofillSurah, startVerse])

  useSecondEffect(() => {
    if (startSurah && startVerse && endSurah && endVerse) {
      ;(function () {
        const start = getPage(startSurah, startVerse)
        const end = getPage(startSurah, startVerse)
        if (start && end) {
          const pageCount = end.page - start.page + 1

          if (pageCount >= GLOBAL_TARGET_PAGE) {
            setValue('achieve_target', true)
          } else {
            setValue('achieve_target', false)
          }

          setValue('page_count', pageCount, { shouldValidate: true })
        } else {
          // TODO(dio): Handle failure when start or end page is not found.
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
    tags: tags ?? [],
    achieveTarget
  }
}
