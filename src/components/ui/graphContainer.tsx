import { PropsWithChildren } from 'react';
import { Card } from './card';
import { Audio } from 'react-loading-icons';


interface GraphContainerProps {
    processing: boolean,
    dependantNum: number,
    className?: string
}


export default function GraphContainer({ processing, dependantNum, className, children }: PropsWithChildren<GraphContainerProps>) {


    return (
        <Card className={`w-full h-full flex flex-col  justify-center items-center col-span-2 md:col-span-1 ${className}`}>
            {
                processing ?
                    <>
                        <Audio fill="#0a595c" />
                        <p className='text-tertiary'>Processing...</p>
                    </>
                    :
                    <div className={`w-full h-[500px] max-h-[500px] content-center text-center col-span-2 md:col-span-1 ${className}`}>
                        {dependantNum > 0 ?
                            <>
                                {children}
                            </>
                            :
                            <div>No Data</div>
                        }
                    </div>
            }
        </Card>

    )
}