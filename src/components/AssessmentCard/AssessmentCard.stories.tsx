import { AssessmentCard } from './AssessmentCard'

export function AssessmentCardStory() {
  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-2'>
        <AssessmentCard
          id='1'
          studentId='1'
          timestamp={new Date().toISOString()}
          tz='Asia/Jakarta'
          finalMark='Jayyid Jiddan'
          name='Juz 25'
        />
      </div>
    </>
  )
}
