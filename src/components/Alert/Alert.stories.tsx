import { Alert, AlertDescription } from './Alert'
import { Trophy, CircleAlert } from 'lucide-react'

export function AlertStory() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
      <Alert>
        <Trophy size={16} />
        <AlertDescription>
          Alhamdulillah, target hari ini tercapai
        </AlertDescription>
      </Alert>

      <Alert variant='warning'>
        <CircleAlert aria-hidden size={16} />
        <AlertDescription>Mohon data dilengkapi.</AlertDescription>
      </Alert>

      <Alert>
        <AlertDescription>lorem ipsum dolor sit amet</AlertDescription>
      </Alert>
    </div>
  )
}
