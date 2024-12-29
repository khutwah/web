import dayjs from 'dayjs'
import { Card, CardContent } from '../Card/Card'
import { MistakeCounter } from './MistakeCounter'
import { AssessmentCheckpointList } from '@/components/Assesment/CheckpointList'
import type { AssessmentCheckpointType } from '@/models/assessments'
import { useState } from 'react'

export function Checkpoints() {
  const checkpoints: AssessmentCheckpointType[] = [
    {
      id: 1,
      timestamp: getDateISOString(22, 18, 15),
      startSurah: "An-Naba'",
      endSurah: 'An-Naziat',
      startVerse: 1,
      endVerse: 20,
      mistakes: { low: 1, medium: 0, high: 1 }
    },
    {
      id: 2,
      timestamp: getDateISOString(23, 10, 30),
      startSurah: 'Abasa',
      endSurah: 'At-Takwir',
      startVerse: 1,
      endVerse: 29,
      mistakes: { low: 2, medium: 1, high: 0 }
    },
    {
      id: 3,
      timestamp: getDateISOString(24, 14, 45),
      startSurah: 'Al-Infitar',
      endSurah: 'Al-Mutaffifin',
      startVerse: 1,
      endVerse: 19,
      mistakes: { low: 0, medium: 2, high: 1 }
    },
    {
      id: 4,
      timestamp: getDateISOString(25, 9, 0),
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
        <AssessmentCheckpointList
          checkpoints={removeEndVerseFromLastArrayElement([checkpoints[0]])}
        />
      </div>
      <h2>Submitted...</h2>
      <div className='mx-auto max-w-md p-4'>
        <AssessmentCheckpointList
          checkpoints={removeEndVerseFromLastArrayElement(checkpoints)}
        />
      </div>
      <h2>Finished!</h2>
      <div className='mx-auto max-w-md p-4'>
        <AssessmentCheckpointList isFinished checkpoints={checkpoints} />
      </div>
    </>
  )
}

export function Counter() {
  const [mistakes, setMistakes] = useState({ low: 0, medium: 0, high: 0 })

  function onChange(type: keyof typeof mistakes, value: number) {
    setMistakes((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <div className='mx-auto max-w-md p-4'>
      <Card className='mb-8 p-6 shadow-md'>
        <CardContent>
          <div className='flex justify-between'>
            <MistakeCounter
              label='Kecil'
              type='low'
              count={mistakes.low}
              onChange={onChange}
            />
            <MistakeCounter
              label='Sedang'
              type='medium'
              count={mistakes.medium}
              onChange={onChange}
            />
            <MistakeCounter
              label='Besar'
              type='high'
              count={mistakes.high}
              onChange={onChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getDateISOString(date: number, hour: number, minute: number) {
  return dayjs().date(date).hour(hour).minute(minute).toISOString()
}

function removeEndVerseFromLastArrayElement(array: AssessmentCheckpointType[]) {
  const newArray = [...array]
  newArray[newArray.length - 1] = {
    ...newArray[newArray.length - 1],
    endSurah: undefined,
    endVerse: undefined
  }

  return newArray
}
