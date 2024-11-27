import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color: 'white' | 'green' | 'blue' | 'tamarind' | 'mute'
  className?: string
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  white: 'bg-mtmh-neutral-white text-mtmh-grey-base',
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-base',
  tamarind: 'bg-mtmh-tamarind-base',
  mute: 'bg-mtmh-snow-base'
}

export function Badge({ color, text, className }: BadgeProps) {
  return (
    <div
      className={cn(
        'text-xs text-mtmh-neutral-white py-0.5 px-2 rounded-md',
        COLOR_TO_CLASSNAME_RECORD[color],
        className
      )}
    >
      {text}
    </div>
  )
}
