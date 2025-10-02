import { useCallback, useEffect, useMemo, useState } from "react";
import { DataRetrievalFunc, Log } from "./types";


export default function useDataRetrieval<T>(climbs: Log[], retrievalFunc: DataRetrievalFunc, args: any[] = []) : [boolean, T]{

    const [processing, setProcessing] = useState(true)
    const [data, setData] = useState<T>({} as T)
    

    useEffect(() => {
        if (climbs.length == 0) return
        
        retrievalFunc(climbs, args).then((rtnData: T) => {
            setData(rtnData)
            setProcessing(false)
        })
    }, [climbs])

    return [processing, data]
}