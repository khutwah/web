import { ComponentProps } from 'react'
import { Badge } from './Badge'
import { ActivityTypeKey } from '@/models/activities'

interface ActivityBadgeProps {
  type: ActivityTypeKey
  isStudentPresent: boolean
  isDraft?: boolean
  /** When `type` is provided, text will always be "Sabaq", "Sabqi", and "Manzil". Use this to override the text. */
  text?: string
  icon?: React.ReactNode
}

type BadgeProps = ComponentProps<typeof Badge>

const ACTIVITY_TYPE_TO_BADGE_PROPS: Record<ActivityTypeKey, BadgeProps> = {
  Sabaq: { text: 'Sabaq', color: 'blue' },
  Sabqi: { text: 'Sabqi', color: 'green' },
  Manzil: { text: 'Manzil', color: 'tamarind' }
}

export function ActivityBadge({
  type,
  isStudentPresent,
  isDraft,
  text: textOverride,
  icon
}: ActivityBadgeProps) {
  const { color, text } = ACTIVITY_TYPE_TO_BADGE_PROPS[type]

  return (
    <Badge
      color={isStudentPresent ? color : 'mute'}
      dashed={isDraft}
      text={textOverride ?? text}
      icon={icon}
    />
  )
}
