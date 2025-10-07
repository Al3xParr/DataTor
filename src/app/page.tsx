'use client'
import React, { useState } from "react"
import { Log } from "../../resources/types"
import { useCSVReader } from "react-papaparse"
import Summary from "@/components/summary"
import { GradeConverter, cleanGrade, cleanName, createDate, getStyle } from "../../resources/utils"
import { Download, Navigation, Upload } from "lucide-react"
import LandingPageGraphs from "../../resources/svg"
import Step from "@/components/ui/step"



export default function Stats() {

    const { CSVReader } = useCSVReader()
    const [logbook, setLogbook] = useState<Log[]>()
    // const [firstYear, setFirstYear] = useState<number>(2025);

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
                        type: climb[11],
                        yds: (climb[1] as string).startsWith("5.")
                    } as Log

                    // if (newLog.date.getFullYear() < firstYear) setFirstYear(newLog.date.getFullYear())
                    if (newLog.style != "DNF" && newLog.style != "Dogged" && newLog.type != "Alpine" && newLog.type != "Via Ferrata") climbs.push(newLog)
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

                            <Summary logs={logbook ?? []} owner={cleanName(acceptedFile.name)} />

                        </div>
                        :

                        <div className="w-full h-full flex flex-col items-center  bg-[url(../../resources/bgSVG.svg)] bg-top-left bg-no-repeat bg-contain ">


                            <div className="grid items-center justify-items-center grid-cols-2 gap-y-50 overflow-clip pt-20 ">

                                <div className="w-[450px] text-wrap ">
                                    <h2 className="text-txt-header text-3xl font-bold whitespace-pre pb-3">
                                        {`Get instant insight into\nyour climbing logbook`}
                                    </h2>
                                    <h3 className="text-txt-header-muted left-25 top-60 text-xl pb-3">
                                        Upload your logbook to see your climbing stats, trends and milestones - visualised to track your progress
                                    </h3>
                                    <div className="flex gap-3">
                                        <div className="flex items-center cursor-pointer w-max px-4 p-2 bg-bg font-bold shadow-md rounded-xl text-txt text-base transition hover:scale-103 "
                                            {...getRootProps()}
                                        >
                                            Upload Logbook
                                        </div>
                                        <div className=" cursor-pointer w-max px-4 p-2 font-bold text-txt rounded-xl transition hover:underline" onClick={() => { }}>
                                            Explore Example
                                        </div>

                                    </div>
                                </div>

                                <LandingPageGraphs />

                                <div className="w-full text-xl flex py-5 col-span-2 justify-around">


                                    <Step number={1} >
                                        <Navigation size={30} className="" />
                                        <div>Navigate to <a href="https://www.ukclimbing.com/logbook">www.ukclimbing.com/logbook</a></div>
                                    </Step>
                                    <Step number={2}>
                                        <Download size={30} className="" />
                                        Download logbook in DLOG format
                                    </Step>
                                    <Step number={3}>
                                        <div className="transition ease-in-out duration-300 hover:scale-103 flex gap-5 w-full flex-col items-center border border-dashed rounded-xl px-8 p-4 cursor-pointer"
                                        {...getRootProps()}>
                                            <Upload size={30} className="" />
                                            Upload Here
                                        </div>

                                    </Step>


                                </div>

                            </div>

                        </div>

                    }
                </div>
            )}
        </CSVReader >

    );
}