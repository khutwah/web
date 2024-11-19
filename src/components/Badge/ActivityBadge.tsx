import { ComponentProps } from 'react'
import { Badge } from './Badge'
import { ActivityType } from '@/models/activities'

interface ActivityBadgeProps {
  type: ActivityType
  isStudentPresent: boolean
}

type BadgeProps = ComponentProps<typeof Badge>

const ACTIVITY_TYPE_TO_BADGE_PROPS: Record<ActivityType, BadgeProps> = {
  [ActivityType.Sabaq]: { text: 'Sabaq', color: 'blue' },
  [ActivityType.Sabqi]: { text: 'Sabqi', color: 'green' },
  [ActivityType.Manzil]: { text: 'Manzil', color: 'tamarind' }
}

export function ActivityBadge({ type, isStudentPresent }: ActivityBadgeProps) {
  const badgeProps = ACTIVITY_TYPE_TO_BADGE_PROPS[type]

  return (
    <Badge
      {...badgeProps}
      color={isStudentPresent ? badgeProps.color : 'mute'}
    />
  )
}
