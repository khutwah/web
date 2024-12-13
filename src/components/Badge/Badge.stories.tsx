import { Clock } from 'lucide-react'
import { Badge } from './Badge'
import { ActivityBadge } from './ActivityBadge'

export function BadgeStory() {
  return (
    <>
      <div className='flex gap-4 bg-mtmh-red-base p-4'>
        <Badge color='blue' text='Sabaq' />
        <Badge color='green' text='Sabqi' />
        <Badge color='tamarind' text='Manzil' />
        <Badge color='outline' text='Parenting' />
        <Badge color='mute' text='Mute' />
        <Badge color='blue' text='Icon' icon={<Clock size={12} />} dashed />

        <ActivityBadge type='Sabaq' isStudentPresent />
        <ActivityBadge type='Sabqi' isStudentPresent />
        <ActivityBadge type='Manzil' isStudentPresent />

        <ActivityBadge type='Sabaq' isStudentPresent isDraft />
        <ActivityBadge type='Sabqi' isStudentPresent isDraft />
        <ActivityBadge type='Manzil' isStudentPresent isDraft />
        <ActivityBadge type='Manzil' isStudentPresent isDraft hideIcon />
      </div>
    </>
  )
}
