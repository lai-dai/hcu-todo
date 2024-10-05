import React, { forwardRef, HTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

export const Center = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean
  }
>(function Center({ asChild, className, ...props }, ref) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      className={cn('grid place-content-center', className)}
      {...props}
    />
  )
})
