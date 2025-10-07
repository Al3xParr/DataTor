import React from "react"


const Input = ({ ...props }) => {
    return(
        <>
            <div className={"bg-bg-light rounded-lg flex p-3 shadow has-[input:focus]:outline outline-tertiary has-[input:e"}>
                {props.icon &&
                    <div className="text-txt-muted pr-3">{props.icon}</div>
                }
                <input
                className="border-0 outline-0 w-full"
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


export {Input}