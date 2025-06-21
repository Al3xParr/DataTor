import { Badge } from "./ui/badge"
import React from "react";

interface TopClimbProps {
    style: string,
    name: string,
    grade: string,
    colour: string
}

export function TopClimb({ style, name, grade, colour }: TopClimbProps) {
    return (
        <div className="flex flex-col basis-1 flex-1 overflow-clip  text-secondary items-start px-6 py-2 ">

            <div className="flex space-x-2 mb-1">
                <p className="text-secondary-light">{style}</p>
                {colour != "disabled" ? <Badge text={grade} colour={colour}></Badge> : <></>}
            </div>
            <p className='font-bold text-lg '>{name}</p>

        </div>
    )
}
