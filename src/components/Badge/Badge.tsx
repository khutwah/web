import { cn } from '@/utils/classnames'

interface BadgeProps {
  text: string
  color:
    | 'green'
    | 'blue'
    | 'tamarind'
    | 'red'
    | 'green-dashed'
    | 'blue-dashed'
    | 'tamarind-dashed'
    | 'red-dashed'
    | 'blue-outline'
    | 'green-outline'
    | 'red-outline'
    | 'actually-red'
    | 'actually-red-dashed'
    | 'mute'
    | 'outline'
  dashed?: boolean
  rightIcon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
  icon?: React.ReactNode // Currently, we don't limit the icon to be passed here.
}

const COLOR_TO_CLASSNAME_RECORD: Record<BadgeProps['color'], string> = {
  blue: 'bg-khutwah-blue-base',
  green: 'bg-khutwah-green-dark',
  tamarind: 'bg-khutwah-warning-70', // FIXME: We should have a color-naming pattern for this.
  red: 'bg-khutwah-red-base',
  'actually-red': 'bg-khutwah-actuallyred-base',

  'blue-dashed':
    'bg-khutwah-neutral-white text-khutwah-blue-base border border-dashed border-khutwah-blue-base',
  'green-dashed':
    'bg-khutwah-neutral-white text-khutwah-green-base border border-dashed border-khutwah-green-base',
  'tamarind-dashed':
    'bg-khutwah-neutral-white text-khutwah-warning-70 border border-dashed border-khutwah-warning-70', // FIXME: We should have a color-naming pattern for this.
  'red-dashed':
    'bg-khutwah-neutral-white text-khutwah-red-base border border-dashed border-khutwah-red-base',
  'blue-outline':
    'bg-khutwah-neutral-white text-khutwah-blue-base border border border-khutwah-blue-base',
  'green-outline':
    'bg-khutwah-neutral-white text-khutwah-green-base border border border-khutwah-green-base',
  'actually-red-dashed':
    'bg-khutwah-neutral-white text-khutwah-actuallyred-base border border-dashed border-khutwah-actuallyred-base',
  'red-outline':
    'bg-khutwah-neutral-white text-khutwah-red-base border border border-khutwah-red-base',
  mute: 'bg-khutwah-snow-base',
  outline: 'bg-none'
}

export function Badge({ color, text, icon, rightIcon, dashed }: BadgeProps) {
  const colorKey = dashed ? `${color}-dashed` : color
  return (
    <div
      className={cn(
        'text-xs text-khutwah-neutral-white py-0.5 px-2 rounded-md flex justify-center items-center gap-1',
        {
          border: color === 'outline',
          'bg-khutwah-snow-base': color !== 'outline',
          // When there is a border, we "subtract" the padding by the border size to ensure that all badges have the same size.
          'py-[1px]': dashed
        },
        COLOR_TO_CLASSNAME_RECORD[colorKey as BadgeProps['color']]
      )}
    >
      {icon}

      {/* This makes sure we have left-aligned text when the text is a number. */}
      <span className={cn(!isNaN(Number(text)) && 'ml-auto')}>{text}</span>

      {rightIcon}
    </div>
  )
}
