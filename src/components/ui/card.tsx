import React from 'react'
import { cn } from '../../../resources/utils'

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'bg-bg border-bg-light overflow-clip rounded-xl border p-4 shadow-md/20',
            className
        )}
        {...props}
    />
))

Card.displayName = 'Card'

export { Card }
