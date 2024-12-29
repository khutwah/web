import { ActivityFormValues, GLOBAL_TARGET_PAGE } from '@/models/activities'
import { Control, UseFormSetValue, useWatch } from 'react-hook-form'
import { useSecondEffect } from '@/hooks/useSecondEffect'
import { getPageCount } from '@/utils/mushaf'

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
  const [startSurah, endSurah, startVerse, endVerse, tags, isTargetAchieved] =
    useWatch({
      control,
      name: [
        'start_surah',
        'end_surah',
        'start_verse',
        'end_verse',
        'tags',
        'is_target_achieved'
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
        const pageCount = getPageCount(
          startSurah,
          startVerse,
          endSurah,
          endVerse
        )
        if (pageCount >= GLOBAL_TARGET_PAGE) {
          setValue('is_target_achieved', true)
        } else {
          setValue('is_target_achieved', false)
        }

        setValue('page_count', pageCount, { shouldValidate: true })
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
    isTargetAchieved
  }
}
