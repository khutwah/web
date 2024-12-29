import { AssessmentRange } from '@/models/assessments'

export function parseCheckpointLabel(
  checkpoints: AssessmentRange | AssessmentRange[]
) {
  if (Array.isArray(checkpoints)) {
    return checkpoints
      .map((item) => `Juz ${item.start.juz} - Juz ${item.end.juz}`)
      .join(' dan ')
  }
  return `Juz ${checkpoints.start.juz} - Juz ${checkpoints.end.juz}`
}

export function parseCheckpointValue(
  checkpoints: AssessmentRange | AssessmentRange[]
) {
  if (Array.isArray(checkpoints)) {
    return JSON.stringify(
      checkpoints.map((item) => [
        `${item.start.surah}:${item.start.verse}`,
        `${item.end.surah}:${item.end.verse}`
      ])
    )
  }
  return JSON.stringify([
    [
      `${checkpoints.start.surah}:${checkpoints.start.verse}`,
      `${checkpoints.end.surah}:${checkpoints.end.verse}`
    ]
  ])
}
