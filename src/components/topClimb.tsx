import React, { ReactElement } from 'react'
import { Card } from './ui/card'

interface TopClimbProps {
    type: string
    name: string
    grade: string
    icon: ReactElement
}

export default function TopClimb({ type, name, grade, icon }: TopClimbProps) {
    return (
        <Card className="text-primary bg-bg border-bg-light grid h-52 w-52 grid-cols-1 grid-rows-2 items-center justify-items-center rounded-4xl border text-center">
            <div className="flex w-full items-center justify-around">
                <div>
                    {icon}
                    <div className="text-txt-muted text-sm font-bold">
                        {type}
                    </div>
                </div>
                <div className="text-txt-muted text-xl font-bold">{grade}</div>
            </div>

            <div className="text-txt h-max max-h-full w-max max-w-full justify-self-start px-4 text-left text-2xl font-bold text-ellipsis">
                {name}
            </div>
        </Card>
    )
}
