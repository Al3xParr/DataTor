import React from "react"
import { cn } from "../../../resources/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>>
    (({ className, ...props }, ref) => (
        <div ref={ref} className={cn("rounded-xl bg-bg shadow-md/20 p-4", className)}
            {...props}
        />

    ))

Card.displayName = "Card"


export {Card}