import React from 'react'

const Input = ({ ...props }) => {
    return (
        <>
            <div
                className={
                    'bg-bg-light outline-tertiary has-[input:e flex rounded-lg p-3 shadow has-[input:focus]:outline'
                }
            >
                {props.icon && (
                    <div className="text-txt-muted pr-3">{props.icon}</div>
                )}
                <input
                    className="w-full border-0 outline-0"
                    type={props.type}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={props.onChange}
                    name={props.name}
                />
            </div>
        </>
    )
}

export { Input }
