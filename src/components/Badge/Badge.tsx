import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color:
    | 'green'
    | 'blue'
    | 'tamarind'
    | 'green-dashed'
    | 'blue-dashed'
    | 'tamarind-dashed'
    | 'mute'
    | 'outline'
  dashed?: boolean
  icon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-dark',
  tamarind: 'bg-mtmh-warning-70', // FIXME: We should have a color-naming pattern for this.

  'blue-dashed':
    'bg-mtmh-neutral-white text-mtmh-blue-base border border-dashed border-mtmh-blue-base',
  'green-dashed':
    'bg-mtmh-neutral-white text-mtmh-green-base border border-dashed border-mtmh-green-base',
  'tamarind-dashed':
    'bg-mtmh-neutral-white text-mtmh-warning-70 border border-dashed border-mtmh-warning-70', // FIXME: We should have a color-naming pattern for this.

  mute: 'bg-mtmh-snow-base',
  outline: 'none'
}

export function Badge({ color, text, icon, dashed }: BadgeProps) {
  const colorKey = dashed ? `${color}-dashed` : color
  return (
    <div
      className={cn(
        'text-xs text-mtmh-neutral-white py-0.5 px-2 rounded-md flex justify-center items-center gap-1',
        COLOR_TO_CLASSNAME_RECORD[colorKey as BadgeProps['color']],
        {
          border: color === 'outline',
          'bg-mtmh-snow-base': color !== 'outline'
        }
      )}
    >
      {icon}

      {/* This makes sure we have left-aligned text when the text is a number. */}
      <span className={cn(!isNaN(Number(text)) && 'ml-auto')}>{text}</span>
    </div>
  )
}
