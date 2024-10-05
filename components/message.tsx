import React, { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Message(props: { children?: ReactNode; className?: string }) {
  return <div className={cn(props.className)}>{props.children}</div>
}

Message.Error = function ErrorMessages(props: {
  children?: ReactNode
  className?: string
}) {
  return <div className={cn(props.className)}>{props.children}</div>
}
