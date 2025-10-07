import React from "react"


const TextArea = ({ ...props }) => {
    return(
        <>
            <div className={"bg-bg-light rounded-lg flex p-3 shadow has-[textarea:focus]:outline outline-tertiary"}>
                {props.icon &&
                    <div className="text-txt-muted pr-3">{props.icon}</div>
                }
                <textarea
                className="border-0 outline-0 w-full"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                name={props.name}
                />
   
            </div>
        </>
    )
}


export {TextArea}