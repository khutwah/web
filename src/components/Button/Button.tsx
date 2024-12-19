import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils/classnames'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-mtmh-primary-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-mtmh-red-base text-white hover:bg-mtmh-red-dark active:bg-mtmh-red-darker disabled:bg-mtmh-snow-base disabled:text-mtmh-grey-lightest',
        outline:
          'bg-white text-mtmh-grey-base border border-mtmh-snow-lighter hover:bg-mtmh-snow-lighter active:bg-mtmh-snow-base disabled:text-mtmh-grey-lightest',
        text: 'text-mtmh-sm-semibold text-mtmh-red-light hover:bg-mtmh-snow-lighter active:bg-mtmh-snow-base disabled:text-mtmh-grey-lightest'
      },
      size: {
        xs: 'h-8 rounded-md px-1',
        md: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
