
'use client'
import { useState } from "react"
import { Log } from "../../../resources/types"
import { useCSVReader, lightenDarkenColor, formatFileSize } from "react-papaparse"
import StyleSummary from "@/components/styleSummary"
import { GradeConverter } from "../../../resources/utils"


export default function Stats() {

    const GREY = '#CCC';
    const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
    const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
    const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
        DEFAULT_REMOVE_HOVER_COLOR,
        40
    );
    const GREY_DIM = '#686868';

    const [zoneHover, setZoneHover] = useState(false);
    const [removeHoverColor, setRemoveHoverColor] = useState(
        DEFAULT_REMOVE_HOVER_COLOR
    );

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

                    const climbs = [] as Log[]

                    results.data.forEach((climb: any, index: number) => {

                        if (climb[0] == "") { return; }
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

                        if (newLog.date.getFullYear() < firstYear) setFirstYear(newLog.date.getFullYear())
                        climbs.push(newLog)
                    })

                    setLogbook(climbs.sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade)))

                }}

                onDragOver={(event: DragEvent) => {
                    event.preventDefault()
                    setZoneHover(true)
                }}
                onDragLeave={(event: DragEvent) => {
                    event.preventDefault()
                    setZoneHover(false)
                }}

            >
                {({
                    getRootProps,
                    acceptedFile,
                    ProgressBar,
                    getRemoveFileProps,
                    Remove
                }: any) => (
                    <div className="flex w-full h-full p-5">

                        {acceptedFile ?
                            <div className="w-full h-full flex flex-col gap-5 ">

                                <StyleSummary title={"Bouldering"} logs={logbook?.filter((log) => log.type == "Bouldering") ?? []} firstYear={firstYear} />
                                <StyleSummary title={"Sport"} logs={logbook?.filter((log) => log.type == "Sport") ?? []} firstYear={firstYear} />
                                <StyleSummary title={"Trad"} logs={logbook?.filter((log) => log.type == "Trad") ?? []} firstYear={firstYear} />

                            </div>

                            :
                            <div className="w-full h-full border border-dashed rounded"
                                {...getRootProps()}>
                                This is where you upload our file

                            </div>
                        }


                    </div>
                )}
            </CSVReader >








        </>
    );

}