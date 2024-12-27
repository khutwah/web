import { cn } from '@/utils/classnames'
import { CircleAlert, SearchX } from 'lucide-react'

type ErrorStateProps = {
  title: string
  description?: string
  actionButton?: React.ReactNode
  className?: string
  type: 'error' | 'empty'
}

const TYPE_TO_ICON_MAP: Record<ErrorStateProps['type'], React.ReactNode> = {
  error: <CircleAlert className='mx-auto text-mtmh-red-base' />,
  empty: <SearchX className='mx-auto text-mtmh-red-base' />
}

export function StateMessage({
  title,
  description,
  actionButton,
  className,
  type
}: ErrorStateProps) {
  return (
    <div className={cn('space-y-3 text-center', className)} role='alert'>
      {TYPE_TO_ICON_MAP[type]}

      <div className='space-y-1'>
        <h2 className='text-mtmh-title-medium !text-center'>{title}</h2>
        <p className='text-mtmh-body-small !text-center'>{description}</p>
      </div>

      <div className='pt-3'>{actionButton}</div>
    </div>
  )
}
