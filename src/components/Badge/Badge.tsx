import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color: 'green' | 'blue' | 'tamarind' | 'mute' | 'outline'
  dashed?: boolean
  icon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-mtmh-blue-base',
  green: 'bg-mtmh-green-base',
  tamarind: 'bg-mtmh-warning-70', // FIXME: We should have a color-naming pattern for this.
  mute: 'bg-mtmh-snow-base',
  outline: 'none'
}

export function Badge({ color, text, icon, dashed }: BadgeProps) {
  return (
    <div
      className={cn(
        'text-xs text-mtmh-neutral-white py-0.5 px-2 rounded-md flex items-center gap-1',
        'bg-mtmh-snow-base',
        COLOR_TO_CLASSNAME_RECORD[dashed ? 'mute' : color],
        {
          border: color === 'outline'
        },
        dashed &&
          `bg-mtmh-neutral-white border border-dashed ${COLOR_TO_CLASSNAME_RECORD[color].replace('bg-', 'border-')}`
      )}
    >
      {icon}

      {/* This makes sure we have left-aligned text when the text is a number. */}
      <span
        className={cn(
          !isNaN(Number(text)) && 'ml-auto',
          dashed &&
            `${COLOR_TO_CLASSNAME_RECORD[color].replace('bg-', 'text-')}`
        )}
      >
        {text}
      </span>
    </div>
  )
}
