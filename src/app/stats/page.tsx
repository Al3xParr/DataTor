
'use client'
import { useState } from "react"
import { Log, Logbook } from "../../../resources/types"


import { useCSVReader } from "react-papaparse"
import SummaryStats from "@/components/summaryStats"
import StyleSummary from "@/components/styleSummary"
import { GradeConverter } from "../../../resources/utils"




export default function Stats() {

    const [logbook, setLogbook] = useState<Logbook>({ boulder: [], sport: [], trad: [], winter: [] })
    const { CSVReader } = useCSVReader()

    const gradeConverter = new GradeConverter()


    function getStyle(style: string){
        switch(style) {
            case "Sent x": return "Sent"
            case "Sent β": return "Flash"
            case "Sent O/S": return "Onsight"
            case "Sent rpt": return "Repeat"
            case "Sent dnf": return "DNF"
            case "Lead RP": return "Redpoint"
            case "Lead β": return "Flash"
            case "Lead G/U": return "GroundUp"
            case "Lead O/S": return "Onsight"
            case "Lead rpt": return "Repeat"
            case "Lead dnf": return "DNF"
            case "Lead dog": return "Dogged"
        }
    }

    function normaliseGrade(grade: string){
        return gradeConverter.getBoulderGrade(grade)
    }

    return (
        <>
            <CSVReader
                onUploadAccepted={(results: any) => {

                    const boulders = [] as Log[]
                    const sports = [] as Log[]
                    const trads = [] as Log[]
                    const winters = [] as Log[]

                    results.data.forEach((climb: any, index: number) => {
                        
                        if (climb[0] == "") { return ; }
                        if (index > 200) { return ; }
                        if (index == 0) { return ; }
                        console.log(climb)
                        const newLog = {
                            id: index,
                            name: climb[0],
                            grade:  normaliseGrade(climb[1]),
                            style: getStyle(climb[2]),
                            partner: climb[3],
                            notes: climb[4],
                            date: climb[5],
                            crag: climb[6],
                            county: climb[7],
                            region: climb[8],
                            country: climb[9],
                            pitches: climb[10],
                            type: climb[11]
                        } as Log
                        if (newLog.type == "Bouldering") boulders.push(newLog)
                        else if (newLog.type == "Sport") sports.push(newLog)
                        else if (newLog.type == "Trad") trads.push(newLog)
                        else if (newLog.type == "Winter") winters.push(newLog)
                    })
                    
                    setLogbook({boulder: boulders, sport: sports, trad: trads, winter: winters})

                }}

            >
                {({
                    getRootProps,
                    acceptedFile,
                    getRemoveFileProps,
                }: any) => (
                    <>
                        <div>
                            <button type='button' {...getRootProps()}>
                                Browse file
                            </button>
                            <div >
                                {acceptedFile && acceptedFile.name}
                            </div>
                            <button {...getRemoveFileProps()}>
                                Remove
                            </button>
                        </div>
                    </>
                )}
            </CSVReader >

            <SummaryStats logbook={logbook} />

            <StyleSummary title={"Bouldering"} logs={logbook.boulder}/>
            <StyleSummary title={"Sport"} logs={logbook.sport}/>

            <ul>
                {logbook.boulder?.map((log) => {
                    return (
                        <div key={log.id}>{log.name} - {log.date} - {log.grade} - {log.style} - {log.country}</div>
                    )
                })}
                {logbook.sport?.map((log) => {
                    return (
                        <div key={log.id}>{log.name} - {log.date} - {log.grade} - {log.style} - {log.country}</div>
                    )
                })}
            </ul>

        </>
    );

}