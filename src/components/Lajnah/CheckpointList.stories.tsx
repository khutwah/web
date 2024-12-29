import { CheckpointList } from '@/components/Lajnah/CheckpointList'
import type { CheckpointType } from '@/models/assessments'
import dayjs from 'dayjs'

export function CheckpointListStory() {
  const checkpoints: CheckpointType[] = [
    {
      id: 1,
      timestamp: getDateISOString(22, 18, 15),
      startSurah: "An-Naba'",
      endSurah: 'An-Naziat',
      startVerse: 1,
      endVerse: 20,
      mistakes: { small: 1, medium: 0, large: 1 }
    },
    {
      id: 2,
      timestamp: getDateISOString(23, 10, 30),
      startSurah: 'Abasa',
      endSurah: 'At-Takwir',
      startVerse: 1,
      endVerse: 29,
      mistakes: { small: 2, medium: 1, large: 0 }
    },
    {
      id: 3,
      timestamp: getDateISOString(24, 14, 45),
      startSurah: 'Al-Infitar',
      endSurah: 'Al-Mutaffifin',
      startVerse: 1,
      endVerse: 19,
      mistakes: { small: 0, medium: 2, large: 1 }
    },
    {
      id: 4,
      timestamp: getDateISOString(25, 9, 0),
      startSurah: 'Al-Inshiqaq',
      endSurah: 'Al-Buruj',
      startVerse: 1,
      endVerse: 22,
      mistakes: { small: 3, medium: 1, large: 0 }
    }
  ]

  return (
    <>
      <h2>Just started...</h2>
      <div className='mx-auto max-w-md p-4'>
        <CheckpointList checkpoints={[checkpoints[0]]} />
      </div>
      <h2>Submitted...</h2>
      <div className='mx-auto max-w-md p-4'>
        <CheckpointList checkpoints={checkpoints} />
      </div>
      <h2>Finished!</h2>
      <div className='mx-auto max-w-md p-4'>
        <CheckpointList isFinished checkpoints={checkpoints} />
      </div>
    </>
  )
}

function getDateISOString(date: number, hour: number, minute: number) {
  return dayjs().date(date).hour(hour).minute(minute).toISOString()
}
