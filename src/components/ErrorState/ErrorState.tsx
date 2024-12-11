import { cn } from '@/utils/classnames'
import { CircleAlert } from 'lucide-react'

type ErrorStateProps = {
  title: string
  description?: string
  actionButton?: React.ReactNode
  className?: string
}

export function ErrorState({
  title,
  description,
  actionButton,
  className
}: ErrorStateProps) {
  return (
    <div className={cn('space-y-3 text-center', className)} role='alert'>
      <CircleAlert className='mx-auto' />
      <div className='space-y-1'>
        <h2 className='text-mtmh-title-medium !text-center'>{title}</h2>
        <p className='text-mtmh-body-small !text-center'>{description}</p>
      </div>
      {actionButton}
    </div>
  )
}
