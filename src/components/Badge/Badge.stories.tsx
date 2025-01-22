import { Clock } from 'lucide-react'
import { Badge } from './Badge'
import { ActivityBadge } from './ActivityBadge'

export function BadgeStory() {
  return (
    <>
      <div className='flex gap-4 bg-khutwah-red-base p-4'>
        <Badge color='blue' text='Sabaq' />
        <Badge color='green' text='Sabqi' />
        <Badge color='tamarind' text='Manzil' />
        <Badge color='outline' text='Parenting' />
        <Badge color='mute' text='Mute' />
        <Badge color='blue' text='Icon' icon={<Clock size={12} />} dashed />

        <ActivityBadge type='Sabaq' attendance='present' />
        <ActivityBadge type='Sabqi' attendance='present' />
        <ActivityBadge type='Manzil' attendance='present' />

        <ActivityBadge type='Sabaq' attendance='present' isDraft />
        <ActivityBadge type='Sabqi' attendance='present' isDraft />
        <ActivityBadge type='Manzil' attendance='present' isDraft />
        <ActivityBadge type='Manzil' attendance='present' isDraft hideIcon />
      </div>
    </>
  )
}
