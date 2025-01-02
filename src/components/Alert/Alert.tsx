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
          'bg-khutwah-lightgreen-lightest text-khutwah-green-darkest [&>svg]:text-khutwah-green-darkest',
        warning:
          'bg-khutwah-tamarind-lighter text-khutwah-tamarind-darkest [&>svg]:text-khutwah-tamarind-darkest',
        info: 'bg-khutwah-blue-lightest text-khutwah-blue-darkest [&>svg]:text-khutwah-blue-darkest'
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
    className={cn('mb-1 text-khutwah-sm-semibold', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-khutwah-sm-regular', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
