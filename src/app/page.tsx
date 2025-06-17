
'use client'
import React, { useState } from "react"
import { Log } from "../../resources/types"
import { useCSVReader } from "react-papaparse"
import Summary from "@/components/summary"
import { GradeConverter, cleanGrade, createDate, getStyle } from "../../resources/utils"
import { Upload } from "lucide-react"



export default function Stats() {

    const { CSVReader } = useCSVReader()
    const [logbook, setLogbook] = useState<Log[]>()
    const [firstYear, setFirstYear] = useState<number>(2025);

    const gradeConverter = new GradeConverter()

    return (
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
                    if (newLog.style != "DNF" && newLog.style != "Dogged") climbs.push(newLog)
                })
                setLogbook(climbs.sort((a, b) => gradeConverter.compareLog(a, b)))
            }}

        >
            {({
                getRootProps,
                acceptedFile
            }: any) => (
                <div className="flex flex-col h-full w-full items-center">

                    {acceptedFile ?

                        <div className="w-full h-full flex flex-col sm:p-10 sm:pt-5 pt-5">

                            <Summary logs={logbook ?? []} firstYear={firstYear} owner={acceptedFile.name.split("_")[0] ?? ""} />

                        </div>
                        :
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="text-center text-2xl m-20 ">
                                Navigate to <a href="https://www.ukclimbing.com/logbook">https://www.ukclimbing.com/logbook</a> and download your logbook
                            </div>

                            <div
                                className="text-2xl cursor-pointer w-2/3 h-2/3 border-3 space-y-10 p-10 border-dark shadow-lg border-dashed rounded-3xl bg-new-white font-general flex flex-col justify-center items-center transition duration-300 ease-in-out hover:shadow-2xl hover:scale-101"
                                {...getRootProps()}>
                                <Upload size={80} color="#0d260e" />
                                <div className="">Drag & drop to upload climbing DLOG (.csv format)</div>
                                <div className="">OR</div>
                                <div className="p-4 bg-secondary text-new-white rounded-lg ">Browse Files</div>
                            </div>
                        </div>
                    }
                </div>
            )}
        </CSVReader >

    );
}