import React, { ReactElement } from "react"
import { Card } from "./ui/card"

interface TopClimbProps {
    type: string,
    name: string,
    grade: string,
    icon: ReactElement
}

export default function TopClimb({ type, name, grade, icon }: TopClimbProps) {
    return (
        <Card className="w-52 h-52 rounded-4xl text-primary grid grid-cols-1 grid-rows-2 items-center text-center justify-items-center bg-bg border border-bg-light">
            <div className="flex items-center justify-around w-full">

                <div>
                    {icon}
                    <div className='font-bold text-txt-muted text-sm '>{type}</div>
                </div>
                <div className="font-bold text-txt-muted text-xl">{grade}</div>

            </div>

            <div className=' px-4 text-left justify-self-start font-bold text-2xl text-ellipsis max-w-full w-max h-max max-h-full text-txt'>{name}</div>

        </Card>
    )
}