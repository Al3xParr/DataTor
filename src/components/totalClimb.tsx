import React from "react"

interface TotalClimbProps {
    type: string,
    total: number
}

export default function TotalClimb({ type, total }: TotalClimbProps) {
    return (
        <div className="flex flex-col items-start px-6">
            <div className='text-txt-muted-light'>{type}</div>
            <div className='font-bold text-2xl pl-2'>{total}</div>
        </div>
    )
}