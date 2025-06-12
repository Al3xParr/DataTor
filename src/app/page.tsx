
'use client'
import React, { useState } from "react"
import { Log } from "../../resources/types"
import { useCSVReader } from "react-papaparse"
import StyleSummary from "@/components/styleSummary"
import { GradeConverter, cleanGrade, createDate, getStyle } from "../../resources/utils"
import { Mountain, Upload } from "lucide-react"



export default function Stats() {

    const { CSVReader } = useCSVReader()
    const [logbook, setLogbook] = useState<Log[]>()
    const [firstYear, setFirstYear] = useState<number>(2025);

    const gradeConverter = new GradeConverter()

    return (
        <>
            <CSVReader
                onUploadAccepted={(results: { data: [] }) => {
                    const climbs = [] as Log[]

                    results.data.forEach((climb: any, index: number) => {

                        if (climb[0] == "") { return; }
                        if (index == 0) { return; }

                        const newLog = {
                            id: index,
                            name: climb[0],
                            grade: cleanGrade(climb[1], climb[11]),
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
                    setLogbook(climbs.sort((a, b) => gradeConverter.compareLog(a, b)))
                }}

            >
                {({
                    getRootProps,
                    acceptedFile
                }: any) => (
                    <div className="flex flex-col w-screen h-screen m-5 max-w-[1500px]  items-center">
                        

                        {acceptedFile ?

                            <div className="w-full h-full flex flex-col space-y-5 ">
                                <StyleSummary title={"Bouldering"} logs={logbook?.filter((log) => log.type == "Bouldering") ?? []} firstYear={firstYear} />
                                <StyleSummary title={"Sport"} logs={logbook?.filter((log) => log.type == "Sport") ?? []} firstYear={firstYear} />
                                <StyleSummary title={"Trad"} logs={logbook?.filter((log) => log.type == "Trad") ?? []} firstYear={firstYear} />
                            </div>
                            :
                            <>
                                <div className="text-center text-2xl m-20">
                                    Navigate to <a href="https://www.ukclimbing.com/logbook">https://www.ukclimbing.com/logbook</a> and download your logbook
                                    </div>
                                <div
                                //onMouseEnter={() => } 
                                
                                className="text-2xl cursor-pointer w-2/3 h-2/3 border-3 space-y-10 border-dark shadow-lg border-dashed rounded-3xl bg-white font-general flex flex-col justify-center items-center transition duration-300 ease-in-out hover:shadow-2xl hover:scale-101"
                                    {...getRootProps()}>
                                    <Upload size={80} color="#2a1f2d " />
                                    <div className="text-textsecondary">Drag & drop to upload climbing DLOG (.csv format)</div>
                                    <div className="text-textsecondary">OR</div>
                                    <div className="p-3 border bg-dark text-white rounded-lg ">Browse Files</div>
                                </div>
                            </>
                        }
                    </div>
                )}
            </CSVReader >
        </>
    );
}