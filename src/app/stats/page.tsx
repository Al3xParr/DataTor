
'use client'
import { useState } from "react"
import { Log, LogBook, Logbook } from "../../../resources/types"


import { useCSVReader } from "react-papaparse"
import SummaryStats from "@/components/summaryStats"
import StyleSummary from "@/components/styleSummary"
import { GradeConverter } from "../../../resources/utils"




export default function Stats() {

    const [logbook, setLogbook] = useState<Log[]>()

    const { CSVReader } = useCSVReader()
    const [firstYear, setFirstYear] = useState<number>(2025);


    const gradeConverter = new GradeConverter()


    function getStyle(style: string) {
        switch (style) {
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

    function normaliseGrade(grade: string) {
        return gradeConverter.getBoulderGrade(grade)
    }

    function createDate(date: string) {
        return new Date(date.replace("???", "01/Jan").replace("??", "01"))
    }

    return (
        <>
            <CSVReader
                onUploadAccepted={(results: any) => {

                    const boulders = [] as Log[]
                    const sports = [] as Log[]
                    const trads = [] as Log[]
                    const winters = [] as Log[]

                    const climbs = [] as Log[]

                    results.data.forEach((climb: any, index: number) => {

                        if (climb[0] == "") { return; }
                        //if (index > 200) { return ; }
                        if (index == 0) { return; }
                        const newLog = {
                            id: index,
                            name: climb[0],
                            grade: climb[11] == "Bouldering" ? normaliseGrade(climb[1]) : climb[1],
                            style: getStyle(climb[2]),
                            partner: climb[3],
                            notes: climb[4],
                            date: createDate(climb[5]),
                            crag: climb[6],
                            county: climb[7],
                            region: climb[8],
                            country: climb[9],
                            pitches: climb[10],
                            type: climb[11]
                        } as Log
                        // if (newLog.type == "Bouldering") boulders.push(newLog)
                        // else if (newLog.type == "Sport") sports.push(newLog)
                        // else if (newLog.type == "Trad") trads.push(newLog)
                        // else if (newLog.type == "Winter") winters.push(newLog)
                        if (newLog.date.getFullYear() < firstYear) setFirstYear(newLog.date.getFullYear())
                        climbs.push(newLog)
                    })

                    setLogbook(climbs.sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade)))
                    //({ boulder: boulders.sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade)), sport: sports.sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade)), trad: trads, winter: winters })

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

            {/* <SummaryStats logbook={logbook.getClimbs()} /> */}
            {/* {logbook?.getClimbs().length > 0
                ?
                <>
                    <StyleSummary title={"Bouldering"} logs={logbook?.getClimbs("grade", "all", "boulder") ?? []} />
                    <StyleSummary title={"Sport"} logs={logbook?.getClimbs("grade", "all", "sport") ?? []} />
                    <StyleSummary title={"Trad"} logs={logbook?.getClimbs("grade", "all", "trad") ?? []} />
                </>
                :
                <></>} */}


            <StyleSummary title={"Bouldering"} logs={logbook?.filter((log) => log.type == "Bouldering") ?? []} firstYear={firstYear} />
            <StyleSummary title={"Sport"} logs={logbook?.filter((log) => log.type == "Sport") ?? []} firstYear={firstYear}  />
            <StyleSummary title={"Trad"} logs={logbook?.filter((log) => log.type == "Trad") ?? []} firstYear={firstYear}  />

            {/* <ul>
                {logbook.getClimbs().map((log) => {
                    return (
                        <div key={log.id}>{log.name} - {log.date.toDateString()} - {log.grade} - {log.style} - {log.country}</div>
                    )
                })}
            </ul> */}

        </>
    );

}