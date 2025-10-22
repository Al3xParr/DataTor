'use client'
import React, { useEffect, useState } from 'react'
import { Log } from '../../resources/types'
import { useCSVReader } from 'react-papaparse'
import {
    GradeConverter,
    cleanGrade,
    cleanName,
    createDate,
    getStyle,
} from '../../resources/utils'
import { Download, Navigation, Upload } from 'lucide-react'
import LandingPageGraphs from '../../resources/svg'
import Step from '@/components/ui/step'
import Papa from 'papaparse'
import Summary from '@/components/summary'

export default function Stats() {
    const { CSVReader } = useCSVReader()
    const [logbook, setLogbook] = useState<Log[]>([])
    const [owner, setOwner] = useState('')
    // const [firstYear, setFirstYear] = useState<number>(2025);

    const gradeConverter = new GradeConverter()

    const [width, setWidth] = useState(0)

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener('resize', () => setWidth(window.innerWidth))
        return () =>
            window.removeEventListener('resize', () =>
                setWidth(window.innerWidth)
            )
    }, [])

    function handleCSVData(data: any[]): Log[] {
        const climbs = [] as Log[]

        data.forEach((climb: any, index: number) => {
            if (climb[0] == '') {
                return
            }
            if (index == 0) {
                return
            }

            const newLog = {
                id: index,
                name: climb[0],
                grade: cleanGrade(climb[1], climb[11]),
                style: getStyle(climb[2]),
                partner: climb[3],
                notes: '',
                date: createDate(climb[5]),
                crag: climb[6],
                county: climb[7],
                region: climb[8],
                country: climb[9],
                pitches: climb[10],
                type: climb[11],
                yds: (climb[1] as string).startsWith('5.'),
            } as Log

            // if (newLog.date.getFullYear() < firstYear) setFirstYear(newLog.date.getFullYear())
            if (
                newLog.style != 'DNF' &&
                newLog.style != 'Dogged' &&
                newLog.type != 'Alpine' &&
                newLog.type != 'Via Ferrata'
            )
                climbs.push(newLog)
        })
        return climbs.sort((a, b) => gradeConverter.compareLog(a, b))
    }

    function loadExample() {
        fetch('./Logbook_DLOG.csv')
            .then((response) => response.text())
            .then((responseText) => {
                setLogbook(handleCSVData(Papa.parse(responseText).data))
                setOwner('ExampleLogbook')
            })
    }

    if (logbook.length > 0) {
        return (
            <div className="flex h-full w-full flex-col pt-5 md:p-5 lg:p-10 lg:pt-5">
                <Summary logs={logbook ?? []} owner={owner} />
            </div>
        )
    }

    return (
        <CSVReader
            onUploadAccepted={(results: { data: [] }, acceptedFile: File) => {
                setLogbook(handleCSVData(results.data))
                setOwner(cleanName(acceptedFile.name))
            }}
        >
            {({ getRootProps, acceptedFile }: any) => (
                <div className="flex h-full w-full flex-col items-center">
                    {!acceptedFile && (
                        <div className="flex h-full w-full justify-center bg-[url(../../resources/bgSVG.svg)]">
                            <div className="grid grid-cols-1 items-center justify-items-center gap-y-30 overflow-visible pt-30 pb-10 lg:grid-cols-2 lg:gap-y-50 lg:py-20">
                                <div className="w-[450px] max-w-full place-self-center px-5 text-wrap">
                                    <h2 className="text-txt-header pb-3 text-3xl font-bold whitespace-pre">
                                        {`Get instant insight into\nyour UKC logbook`}
                                    </h2>
                                    <h3 className="text-txt-header-muted top-60 left-25 pb-3 text-lg">
                                        Upload your logbook to see your climbing
                                        stats, trends and milestones -
                                        visualised to track your progress
                                    </h3>
                                    <div className="flex gap-3">
                                        <button
                                            className="bg-tertiary text-bg flex w-max cursor-pointer items-center rounded-xl p-2 px-4 text-base font-bold shadow-md inset-shadow-sm/50 inset-shadow-[#7cc1cf] transition select-none hover:shadow-lg/20 hover:inset-shadow-[#bde9f2]"
                                            {...getRootProps()}
                                        >
                                            Upload Logbook
                                        </button>
                                        <button
                                            className="text-txt-header-muted w-max cursor-pointer rounded-xl p-2 px-4 font-bold transition select-none hover:underline"
                                            onClick={loadExample}
                                        >
                                            Explore Example
                                        </button>
                                    </div>
                                </div>

                                {width > 768 && <LandingPageGraphs />}

                                <div className="flex w-full flex-col items-center justify-around gap-10 py-5 text-xl lg:col-span-2 lg:flex-row">
                                    <Step number={1}>
                                        <Navigation size={30} className="" />
                                        <div>
                                            Navigate to{' '}
                                            <a href="https://www.ukclimbing.com/logbook">
                                                www.ukclimbing.com/logbook
                                            </a>
                                        </div>
                                    </Step>

                                    <Step number={2}>
                                        <Download size={30} className="" />
                                        Download logbook in DLOG format
                                    </Step>

                                    <Step number={3}>
                                        <button
                                            className="bg-bg-dark flex w-full cursor-pointer flex-col items-center gap-5 rounded-xl p-4 px-8 inset-shadow-[0_-2px_4px_rgb(255,255,255,0.5)]/10 transition duration-300 ease-in-out not-dark:inset-shadow-sm/10 hover:inset-shadow-[0_-2px_4px_rgb(255,255,255,0.5)]/30 not-dark:hover:bg-[#d4d7de] not-dark:hover:inset-shadow-sm/50 dark:hover:bg-black/70"
                                            {...getRootProps()}
                                        >
                                            <Upload size={30} className="" />
                                            Upload Here
                                        </button>
                                    </Step>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </CSVReader>
    )
}
