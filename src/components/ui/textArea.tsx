import React from 'react'
import { cn } from '../../../resources/utils'

const TextArea = ({ className, error, ...props }: any) => {
    return (
        <>
            <div
                className={cn(
                    `bg-bg-light outline-tertiary flex rounded-lg p-3 shadow has-[textarea:focus]:outline ${error && ''}`,
                    className
                )}
            >
                {props.icon && (
                    <div className="text-txt-muted pr-3">{props.icon}</div>
                )}
                <textarea
                    className="max-h-92 w-full border-0 outline-0"
                    {...props}
                />
            </div>
        </>
    )
}

export { TextArea }
