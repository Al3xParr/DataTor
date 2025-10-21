import React from 'react'
import { cn } from '../../../resources/utils'

const TextArea = ({ className, error, icon, ...props }: any) => {
    return (
        <>
            <div
                className={cn(
                    `bg-bg-light outline-tertiary flex rounded-lg p-3 shadow has-[textarea:focus]:outline ${error && ''}`,
                    className
                )}
            >
                {icon && <div className="text-txt-muted pr-3">{icon}</div>}
                <textarea
                    className="max-h-48 min-h-48 w-full overflow-auto border-0 outline-0"
                    maxLength={3000}
                    {...props}
                />
            </div>
        </>
    )
}

export { TextArea }
