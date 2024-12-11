import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color: 'green' | 'blue' | 'tamarind' | 'mute' | 'outline'
  icon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-dark',
  tamarind: 'bg-mtmh-warning-70', // FIXME: We should have a color-naming pattern for this.
  mute: 'bg-mtmh-snow-base',
  outline: 'none'
}

export function Badge({ color, text, icon }: BadgeProps) {
  return (
    <div
      className={cn(
        'text-xs justify-center text-mtmh-neutral-white py-0.5 px-2 rounded-md flex items-center gap-1',
        COLOR_TO_CLASSNAME_RECORD[color],
        {
          border: color === 'outline'
        }
      )}
    >
      {icon}
      {text}
    </div>
  )
}
