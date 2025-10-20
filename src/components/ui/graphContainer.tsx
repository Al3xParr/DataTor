import { PropsWithChildren, Children } from 'react'
import { Card } from './card'
import { Audio } from 'react-loading-icons'
import React from 'react'

interface GraphContainerProps {
    processing: boolean
    title: string
    padded?: boolean
    className?: string
}

export default function GraphContainer({
    processing,
    title,
    className,
    padded = true,
    children,
}: PropsWithChildren<GraphContainerProps>) {
    return (
        <Card
            className={`fill-tertiary order-none row-span-2 flex h-full w-full flex-col items-center justify-center ${!padded ? 'p-0' : ''} ${className}`}
        >
            {processing ? (
                <>
                    <Audio fill="190 100 28" />
                    <p className="text-tertiary">Processing...</p>
                </>
            ) : (
                <div className={`h-full w-full content-center text-center`}>
                    <div className="relative flex h-full w-full flex-col items-start select-none">
                        <h4
                            className={`shrink font-bold ${!padded ? 'p-4' : ''}`}
                        >
                            {title}
                        </h4>
                        {children}
                    </div>
                </div>
            )}
        </Card>
    )
}
