import { PropsWithChildren } from 'react'
import { Card } from './card'

interface stepProps {
    number: number
}

export default function Step({
    number,
    children,
}: PropsWithChildren<stepProps>) {
    return (
        <Card className="bg-bg flex w-80 flex-col items-center gap-5 rounded-4xl p-8 text-center">
            <div className="bg-tertiary text-bg flex h-16 w-16 items-center justify-center justify-self-start rounded-full">
                {number}
            </div>
            {children}
        </Card>
    )
}
