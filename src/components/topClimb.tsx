import { Badge } from "./badge"
import React from "react";

interface TopClimbProps {
    style: string,
    name: string,
    grade: string,
    colour: string
}

export function TopClimb({ style, name, grade, colour }: TopClimbProps) {
    return (
        <div className="font-normal flex text-center items-center ">
            {style}
            <p className='font-bold text-xl mx-2 text-ellipsis'>{name}</p>
            <Badge text={grade} colour={colour}></Badge>
        </div>
    )
}
