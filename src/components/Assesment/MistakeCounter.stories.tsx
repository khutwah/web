import { Card, CardContent } from '../Card/Card'
import { MistakeCounter } from './MistakeCounter'

export function MistakeCounterStory() {
  return (
    <div className='mx-auto max-w-md p-4'>
      <Card className='mb-8 p-6 shadow-md'>
        <CardContent>
          <div className='flex justify-between'>
            <MistakeCounter label='Kecil' type='low' count={3} />
            <MistakeCounter label='Sedang' type='medium' count={5} />
            <MistakeCounter label='Besar' type='high' count={9} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
