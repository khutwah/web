import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color: 'green' | 'blue' | 'tamarind' | 'mute'
  icon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-base',
  tamarind: 'bg-mtmh-tamarind-base',
  mute: 'bg-mtmh-snow-base'
}

export function Badge({ color, text, icon }: BadgeProps) {
  return (
    <div
      className={cn(
        'text-xs text-mtmh-neutral-white py-0.5 px-2 rounded-md flex items-center gap-1',
        COLOR_TO_CLASSNAME_RECORD[color]
      )}
    >
      {icon}
      {text}
    </div>
  )
}
