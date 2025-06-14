
import { Select, Theme } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { GradeGraphData, Log, TimelineGraphData, TopClimbsGraphData } from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { TopClimb } from './topClimb';
import { getGradeData, getTimelineData, getTopClimbsPerYear } from '../../resources/serverUtils';
import { Audio } from 'react-loading-icons';


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
        <div className="w-full h-max flex flex-col p-6 sm:rounded-xl shadow-md  bg-white">
            <div className="font-extrabold text-3xl w-full  flex justify-between">
                <h3>{title}</h3>

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


            <div className='flex flex-col md:flex-row md:space-x-10 space-y-10 items-center m-4 justify-around mb-10'>
                
                <div className='flex divide-x divide-dark p-2 bg-gray-200 rounded-xl shadow-md w-max'>
                    <div className="flex flex-col items-center px-5">
                        <div className='text-textsecondary'>Total Sent</div>
                        <div className='font-extrabold text-3xl'>{filteredClimbs.length}</div>
                    </div>

                    <div className="flex flex-col items-center px-5">
                        <div className='text-textsecondary'>Flash</div>
                        <div className='font-extrabold text-3xl'>{flash?.length}</div>
                    </div>

                    <div className="flex flex-col items-center px-5">
                        <div className='text-textsecondary'>Onsight</div>
                        <div className='font-extrabold text-3xl'>{onsight?.length}</div>
                    </div>

                </div>

                <div className='flex flex-col space-y-3 items-center font-bold justify-items-center bg-gray-200 rounded-xl  shadow-md p-4 w-max max-w-fit'>
                    <div className='font-extrabold text-3xl'>Top Climbs</div>

                    <TopClimb style="Worked" name={filteredClimbs[0]?.name ?? "N/A"} grade={filteredClimbs[0]?.grade ?? "N/A"} colour={filteredClimbs[0]?.grade != null ? "primary" : "disabled"} />
                    <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "primary" : "disabled"} />
                    <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "primary" : "disabled"} />
                </div>
            </div>

            <div className='w-full grid grid-cols-2 h-max md:p-4'>

                {
                    gradeDataSet.length == 0 ?
                        <div className='w-full h-full flex flex-col  col-span-2 items-center md:col-span-1'>
                            <Audio fill="#40ae79" />
                            <p>Processing...</p>
                        </div>
                        :
                        <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                            <GradeGraph data={gradeDataSet} />
                        </div>

                }

                {
                    topClimbsPerYear.length == 0 ?
                        <div className='w-full h-full flex flex-col col-span-2  items-center md:col-span-1'>
                            <Audio fill="#40ae79" />
                            <p>Processing...</p>
                        </div>
                        :
                        <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                            <TopClimbsGraph data={topClimbsPerYear} presentGrades={gradesInTopClimbs} climbNames={topClimbNames} />
                        </div>
                }

                {
                    timelineData.length == 0 ?
                        <div className='w-full h-full flex flex-col items-center col-span-2'>
                            <Audio fill="#40ae79" />
                            <p>Processing...</p>
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