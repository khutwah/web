import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color: 'green' | 'blue' | 'tamarind' | 'mute'
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-base',
  tamarind: 'bg-mtmh-tamarind-base',
  mute: 'bg-mtmh-snow-base'
}

export function Badge({ color, text }: BadgeProps) {
  return (
    <div
      className={cn(
        'text-xs text-mtmh-neutral-white py-0.5 px-2 rounded-md',
        COLOR_TO_CLASSNAME_RECORD[color]
      )}
    >
      {text}
    </div>
  )
}
