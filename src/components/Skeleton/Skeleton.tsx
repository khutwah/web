import { cn } from '@/utils/classnames'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-mtmh-grey-lightest',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
