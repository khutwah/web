import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/classnames'

const alertVariants = cva(
  // FIXME(dio-khutwah): Do we need to add "relative" here?
  'w-full rounded-lg px-4 py-3 text-sm flex flex-row items-center gap-2',
  {
    variants: {
      variant: {
        success:
          'bg-mtmh-lightgreen-lightest text-mtmh-green-darkest [&>svg]:text-mtmh-green-darkest',
        warning:
          'bg-mtmh-tamarind-lighter text-mtmh-tamarind-darkest [&>svg]:text-mtmh-tamarind-darkest',
        info: 'bg-mtmh-blue-lightest text-mtmh-blue-darkest [&>svg]:text-mtmh-blue-darkest'
      }
    },
    defaultVariants: {
      variant: 'success'
    }
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role='alert'
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 text-mtmh-sm-semibold', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-mtmh-sm-regular', className)} {...props} />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
