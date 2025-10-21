'use client'
import { useEffect, useState } from 'react'
import { DataRetrievalFunc, Log } from '../resources/types'

export default function useDataRetrieval<T>(
    climbs: Log[],
    retrievalFunc: DataRetrievalFunc,
    args: any[] = []
): [T, boolean] {
    const [processing, setProcessing] = useState(true)
    const [data, setData] = useState<T>({} as T)

    useEffect(() => {
        if (climbs.length == 0) {
            setData(Object as T)
            return
        }
        setProcessing(true)

        retrievalFunc(climbs, args).then((rtnData: T) => {
            setData(rtnData)
            setProcessing(false)
        })
    }, [climbs])

    return [data, processing]
}
