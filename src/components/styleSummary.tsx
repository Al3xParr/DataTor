
import { Select, Theme } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { GradeGraphData, Log, TimelineGraphData, TopClimbsGraphData } from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { TopClimb } from './topClimb';
import { getGradeData, getTimelineData, getTopClimbsPerYear } from '../../resources/serverUtils';
import { Audio } from 'react-loading-icons';
import TotalClimb from './totalClimb';


interface StyleSummaryProps {
    title: string,
    logs: Log[],
    firstYear: number
}

export default function StyleSummary({ title, logs, firstYear }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);

    const filteredClimbs = logs.filter((l) => selectedYear == 0 || l.date.getFullYear() == selectedYear)
    const flash = filteredClimbs.filter((l) => l.style == "Flash")
    const onsight = filteredClimbs.filter((l) => l.style == "Onsight")

    const yearList = Array.from({ length: new Date().getFullYear() - firstYear + 1 }, (_, index) => firstYear + index)

    const [gradeDataSet, setGradeDataSet] = useState<GradeGraphData[]>([]);
    const [presentGrades, setPresentGrades] = useState<string[]>([]);


    const [timelineData, setTimelineData] = useState<TimelineGraphData[]>([])

    const [topClimbsPerYear, setTopClimbsPerYear] = useState<TopClimbsGraphData[]>([])
    const [gradesInTopClimbs, setGradesInTopClimbs] = useState<string[]>([])
    const [topClimbNames, setTopClimbNames] = useState<Record<string, string[]>>({})



    useEffect(() => {

        getGradeData(filteredClimbs).then((data) => {
            setGradeDataSet(data.gradeDataSet)
            setPresentGrades(data.presentGrades)
            getTimelineData(filteredClimbs, data.presentGrades).then((d) => setTimelineData(d))
        })

        getTopClimbsPerYear(logs, yearList).then((data) => {
            setTopClimbsPerYear(data.topClimbsPerYear)
            setGradesInTopClimbs(data.gradesInTopClimbs)
            setTopClimbNames(data.topClimbNames)
        })


    }, [logs, selectedYear])


    if (logs.length == 0) return (<></>)

    return (
        <div className="w-full h-max flex flex-col p-6 sm:rounded-xl shadow-md  bg-new-white">
            <div className=" w-full mb-6 flex justify-between">
                <h3 className='font-extrabold text-3xl'>{title}</h3>

                <Theme style={{ height: "min-content", minHeight: "min-content", fontFamily: "Nunito" }}>
                    <Select.Root defaultValue='0' onValueChange={(value) => setSelectedYear(parseInt(value))} >
                        <Select.Trigger className='SelectTrigger min-h-min' >
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Years</Select.Label>
                                <Select.Item value={"0"}>All Time</Select.Item>
                                {yearList.map((y) => {
                                    return (<Select.Item key={y} value={y.toString()}>{y.toString()}</Select.Item>)
                                })}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Theme>

            </div>


            <div className='text-base flex flex-col md:flex-row gap-5 items-center m-4 justify-around mb-10'>

                <div>
                    <div className='font-bold text-lg pl-6 pb-1'>Total Climbs</div>
                    <div className='flex divide-x py-4 divide-secondary bg-primary rounded-xl shadow-md w-max'>
                        <TotalClimb type='Sent' total={filteredClimbs.length} />
                        <TotalClimb type='Flash' total={flash?.length} />
                        <TotalClimb type='Onsight' total={onsight?.length} />
                    </div>
                </div>

                <div>
                    <div className='font-bold text-lg pl-6 pb-1'>Top Climbs</div>
                    <div className='flex gap-3 divide-secondary divide-x bg-primary rounded-xl py-4 shadow-md'>
                        <TopClimb style="Worked" name={filteredClimbs[0]?.name ?? "N/A"} grade={filteredClimbs[0]?.grade ?? "N/A"} colour={filteredClimbs[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "tertiary" : "disabled"} />
                    </div>
                </div>

            </div>

            <div className='w-full grid grid-cols-2 h-max md:p-4'>

                {
                    gradeDataSet.length == 0 ?
                        <div className='w-full h-full flex flex-col col-span-2 items-center md:col-span-1'>
                            <Audio fill="#0a595c" />
                            <p className='text-tertiary'>Processing...</p>
                        </div>
                        :
                        <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                            <GradeGraph data={gradeDataSet} />
                        </div>

                }

                {
                    topClimbsPerYear.length == 0 ?
                        <div className='w-full h-full flex flex-col col-span-2  items-center md:col-span-1'>
                            <Audio fill="#0a595c" />
                            <p className='text-tertiary'>Processing...</p>
                        </div>
                        :
                        <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                            <TopClimbsGraph data={topClimbsPerYear} presentGrades={gradesInTopClimbs} climbNames={topClimbNames} />
                        </div>
                }

                {
                    timelineData.length == 0 ?
                        <div className='w-full h-full flex flex-col items-center col-span-2'>
                            <Audio fill="#0a595c" />
                            <p className='text-tertiary'>Processing...</p>
                        </div>
                        :
                        <div className='w-full h-[500px] max-h-[500px] col-span-2'>
                            <TimelineGraph data={timelineData} presentGrades={presentGrades} />
                        </div>
                }

            </div>
        </div>
    )
}