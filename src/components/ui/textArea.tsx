import React from 'react'

const TextArea = ({ ...props }) => {
    return (
        <>
            <div
                className={
                    'bg-bg-light outline-tertiary flex rounded-lg p-3 shadow has-[textarea:focus]:outline'
                }
            >
                {props.icon && (
                    <div className="text-txt-muted pr-3">{props.icon}</div>
                )}
                <textarea
                    className="max-h-92 w-full border-0 outline-0"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    name={props.name}
                />
            </div>
        </>
    )
}

export { TextArea }
