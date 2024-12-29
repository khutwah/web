import { AssessmentCheckpointList } from '@/components/Assesment/CheckpointList'
import type { AssessmentCheckpointType } from '@/models/assessments'

export function CheckpointListStory() {
  const checkpoints: AssessmentCheckpointType[] = [
    {
      id: '1',
      timestamp: '22 Des 18:15',
      startSurah: "An-Naba'",
      endSurah: 'An-Naziat',
      startVerse: 1,
      endVerse: 20,
      mistakes: { low: 1, medium: 0, high: 1 }
    },
    {
      id: '2',
      timestamp: '23 Des 10:30',
      startSurah: 'Abasa',
      endSurah: 'At-Takwir',
      startVerse: 1,
      endVerse: 29,
      mistakes: { low: 2, medium: 1, high: 0 }
    },
    {
      id: '3',
      timestamp: '24 Des 14:45',
      startSurah: 'Al-Infitar',
      endSurah: 'Al-Mutaffifin',
      startVerse: 1,
      endVerse: 19,
      mistakes: { low: 0, medium: 2, high: 1 }
    },
    {
      id: '4',
      timestamp: '25 Des 09:00',
      startSurah: 'Al-Inshiqaq',
      endSurah: 'Al-Buruj',
      startVerse: 1,
      endVerse: 22,
      mistakes: { low: 3, medium: 1, high: 0 }
    }
  ]

  return (
    <>
      <h2>Just started...</h2>
      <div className='mx-auto max-w-md p-4'>
        <AssessmentCheckpointList checkpoints={[checkpoints[0]]} />
      </div>
      <h2>Submitted...</h2>
      <div className='mx-auto max-w-md p-4'>
        <AssessmentCheckpointList checkpoints={checkpoints} />
      </div>
      <h2>Finished!</h2>
      <div className='mx-auto max-w-md p-4'>
        <AssessmentCheckpointList isFinished checkpoints={checkpoints} />
      </div>
    </>
  )
}
