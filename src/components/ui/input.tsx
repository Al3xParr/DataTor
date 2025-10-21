import React from 'react'
import { cn } from '../../../resources/utils'

const Input = ({ className, error, icon, ...props }: any) => {
    return (
        <div
            className={cn(
                `bg-bg-light outline-tertiary flex rounded-lg p-3 shadow has-[input:focus]:outline ${error && 'outline-red-400'}`,
                className
            )}
        >
            {icon && <div className="text-txt-muted pr-3">{icon}</div>}
            <input className="w-full border-0 outline-0" {...props} />
        </div>
    )
}

export { Input }
