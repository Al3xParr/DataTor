import { PropsWithChildren } from 'react';
import { Card } from './card';
import { Audio } from 'react-loading-icons';
import React from "react"

interface GraphContainerProps {
    processing: boolean,
    title: string,
    dependantNum: number,
    padded?: boolean,
    className?: string
}


export default function GraphContainer({ processing, title, dependantNum, className, padded = true, children }: PropsWithChildren<GraphContainerProps>) {


    return (
        <Card className={`w-full h-[500px] fill-tertiary flex flex-col justify-center items-center col-span-2 md:col-span-1 ${!padded ? "p-0" : ""} ${className}`}>
            {
                processing ?
                    <>
                        <Audio fill="190 100 28" />
                        <p className='text-tertiary'>Processing...</p>
                    </>
                    :
                    <div className={`w-full h-full content-center text-center`}>
                        {dependantNum > 0 ?

                            <div className="flex flex-col items-start h-full w-full relative select-none">
                                <h4 className={`font-bold shrink ${!padded ? "p-4" : ""}`}>{title}</h4>
                                {children}
                            </div>
                            :
                            <div>No Data</div>
                        }
                    </div>
            }
        </Card>

    )
}