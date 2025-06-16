
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
import { Card } from './ui/card';


interface StyleSummaryProps {
    logs: Log[],
    firstYear: number,
    owner: string
}

export default function StyleSummary({ logs, firstYear, owner }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedType, setselectedType] = useState<string>("Bouldering");

    const filteredClimbs = logs.filter((l) => (selectedYear == 0 || l.date.getFullYear() == selectedYear) && l.type == selectedType)
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

        getTopClimbsPerYear(logs.filter((l) => l.type == selectedType), yearList).then((data) => {
            setTopClimbsPerYear(data.topClimbsPerYear)
            setGradesInTopClimbs(data.gradesInTopClimbs)
            setTopClimbNames(data.topClimbNames)
        })


    }, [logs, selectedYear, selectedType])


    if (logs.length == 0) return (<></>)

    return (
        <div className="w-full h-max grid grid-cols-2 gap-4 flex-col pb-10">
            <Card className='p-6 col-span-2 w-full flex justify-between'>
                <div className='flex flex-col'>
                    <h3 className='font-extrabold text-2xl'>Welcome{owner != "" ? ", " + owner : ""}!</h3>
                    <p className='pl-1 pt-1'>Explore insights into your logbook and see your progress over time</p>
                </div>

                <Theme
                    style={{ height: "min-content", minHeight: "min-content", fontFamily: "Nunito" }}
                    className='flex gap-4'

                >
                    <Select.Root defaultValue='Bouldering' onValueChange={(value) => setselectedType(value)} >
                        <Select.Trigger className='SelectTrigger min-h-min' >
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Disciplines</Select.Label>
                                <Select.Item key={"Bouldering"} value={"Bouldering"}>Bouldering</Select.Item>
                                <Select.Item key={"Sport"} value={"Sport"}>Sport</Select.Item>
                                <Select.Item key={"Trad"} value={"Trad"}>Trad</Select.Item>

                            </Select.Group>
                        </Select.Content>
                    </Select.Root>

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

            </Card>

            <div className='col-span-2 flex flex-col md:flex-row gap-5 items-center p-4 justify-around'>
                <div>
                    <div className='font-bold text-lg pl-6 pb-1'>Total Climbs</div>
                    <Card className='flex divide-x px-0 divide-secondary  w-max'>
                        <TotalClimb type='Sent' total={filteredClimbs.length} />
                        <TotalClimb type='Flash' total={flash?.length} />
                        <TotalClimb type='Onsight' total={onsight?.length} />
                    </Card>
                </div>

                <div>
                    <div className='font-bold text-lg pl-6 pb-1'>Top Climbs</div>
                    <Card className='flex gap-3 divide-secondary divide-x px-0'>
                        <TopClimb style="Worked" name={filteredClimbs[0]?.name ?? "N/A"} grade={filteredClimbs[0]?.grade ?? "N/A"} colour={filteredClimbs[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "tertiary" : "disabled"} />
                    </Card>
                </div>


            </div>

            {
                gradeDataSet.length == 0 ?
                    <Card className='w-full h-full flex flex-col justify-center  col-span-2 items-center md:col-span-1'>
                        <Audio fill="#0a595c" />
                        <p className='text-tertiary'>Processing...</p>
                    </Card>
                    :
                    <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                        <GradeGraph data={gradeDataSet} />
                    </div>

            }

            {
                topClimbsPerYear.length == 0 ?
                    <Card className='w-full h-full flex flex-col col-span-2   justify-center  items-center md:col-span-1'>
                        <Audio fill="#0a595c" />
                        <p className='text-tertiary'>Processing...</p>
                    </Card>
                    :
                    <div className='w-full h-[400px] col-span-2 md:col-span-1'>
                        <TopClimbsGraph data={topClimbsPerYear} presentGrades={gradesInTopClimbs} climbNames={topClimbNames} />
                    </div>
            }

            {
                timelineData.length == 0 ?
                    <Card className='w-full h-full flex flex-col  justify-center items-center col-span-2'>
                        <Audio fill="#0a595c" />
                        <p className='text-tertiary'>Processing...</p>
                    </Card>
                    :
                    <div className='w-full h-[500px] max-h-[500px] col-span-2'>
                        <TimelineGraph data={timelineData} presentGrades={presentGrades} />
                    </div>
            }

        </div>

    )
}