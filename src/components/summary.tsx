
import { Select, Theme } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { GradeGraphData, Log} from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { TopClimb } from './topClimb';
import { AvgMaxData, getAvgMaxData, getGradeData, getMapData, getCountryData, getTimelineData, CountryData, AreaData, TopClimbsDataRtn, getTopClimbsData, TimelineDataRtn } from '../../resources/serverUtils';
import TotalClimb from './totalClimb';
import { Card } from './ui/card';
import GraphContainer from './ui/graphContainer';
import AvgMaxGraph from './graphs/avgMaxGraph';
import CountryGraph from './graphs/countryGraph';
import AreaMap from './graphs/areaMap';
import useDataRetrieval from '../../resources/useDataRetrieval';


interface StyleSummaryProps {
    logs: Log[],
    firstYear: number,
    owner: string
}

export default function Summary({ logs, firstYear, owner }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>("Bouldering");

    const [yearAndTypeClimbs, setYearAndTypeClimbs] = useState([] as Log[]) // log list selected type and year
    const [typeClimbs, setTypeClimbs] = useState([] as Log[]) // log list of selected type
    const flash = yearAndTypeClimbs.filter((l) => l.style == "Flash")
    const onsight = yearAndTypeClimbs.filter((l) => l.style == "Onsight")

    const [yearList, setYearList] = useState([] as number[])


    const [mapProcessing, mapData] = useDataRetrieval<Record<string, AreaData>>(yearAndTypeClimbs, getMapData)
    const [countryProcessing, countryData] = useDataRetrieval<CountryData>(yearAndTypeClimbs, getCountryData)
    const [avgMaxProcessing, avgMaxData] = useDataRetrieval<AvgMaxData[]>(typeClimbs, getAvgMaxData)
    const [topClimbsProcessing, topClimbsData] = useDataRetrieval<TopClimbsDataRtn>(typeClimbs, getTopClimbsData)
    const [gradesProcessing, gradesData] = useDataRetrieval<GradeGraphData[]>(yearAndTypeClimbs, getGradeData)
    const [timelineProcessing, timelineData] = useDataRetrieval<TimelineDataRtn>(yearAndTypeClimbs, getTimelineData)


    useEffect(() => {

        setYearAndTypeClimbs(logs.filter((l) => (selectedYear == 0 || l.date.getFullYear() == selectedYear) && l.type == selectedType))
        setTypeClimbs(logs.filter((l) => (l.type == selectedType)))
        setYearList([...new Set(logs.map((climb) => climb.date.getFullYear()))].sort((a, b) => b - a))

    }, [logs, selectedYear, selectedType])

    if (logs.length == 0) return (<></>)

    return (
        <div className="w-full h-max grid grid-cols-2 gap-4 flex-col">

            <Card className='p-6 col-span-2 w-full flex flex-col gap-3 md:flex-row justify-between'>

                <div className='flex flex-col'>
                    <h3 className='font-extrabold text-2xl'>Welcome{owner != "" ? ", " + owner : ""}!</h3>
                    <p className='pl-1 pt-1 text-txt-muted'>Explore insights into your logbook and see your progress over time</p>                </div>

                <Theme
                    style={{ background: "var(--color-bg)", height: "min-content", minHeight: "min-content", fontFamily: "Nunito serif" }}
                    className='flex gap-4 self-end items-center'
                >
                    <Select.Root defaultValue='Bouldering' onValueChange={(value) => setSelectedType(value)}>
                        <Select.Trigger className='SelectTrigger' style={{ background: "var(--color-bg-light)", color: "var(--color-txt)" }}>
                        </Select.Trigger>
                        <Select.Content style={{ background: "var(--color-bg-light)", color: "var(--color-txt)" }}>
                            <Select.Group>
                                <Select.Label style={{ color: "var(--color-txt-muted)" }}>Disciplines</Select.Label>
                                <Select.Item key={"Bouldering"} value={"Bouldering"}>Bouldering</Select.Item>
                                <Select.Item key={"Sport"} value={"Sport"}>Sport</Select.Item>
                                <Select.Item key={"Trad"} value={"Trad"}>Trad</Select.Item>

                            </Select.Group>
                        </Select.Content>
                    </Select.Root>

                    <Select.Root defaultValue='0' onValueChange={(value) => setSelectedYear(parseInt(value))} >
                        <Select.Trigger className='SelectTrigger' style={{ background: "var(--color-bg-light)", color: "var(--color-txt)" }} >
                        </Select.Trigger>
                        <Select.Content style={{ background: "var(--color-bg-light)", color: "var(--color-txt)" }}>
                            <Select.Group>
                                <Select.Label style={{ color: "var(--color-txt-muted)" }}>Years</Select.Label>
                                <Select.Item value={"0"}>All Time</Select.Item>
                                {yearList.map((y) => {
                                    return (<Select.Item key={y} value={y.toString()}>{y.toString()}</Select.Item>)
                                })}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>

                </Theme>

            </Card>

            {
                yearAndTypeClimbs.length != 0 ?
                    <>
                        <div className='col-span-2 flex flex-col md:flex-row gap-5 items-center p-4 justify-evenly'>
                            <div>
                                <div className='font-bold text-lg pl-6 pb-1'>Total Climbs</div>
                                <Card className='flex divide-x px-0 divide-txt w-max'>
                                    <TotalClimb type='Sent' total={yearAndTypeClimbs.length} />
                                    <TotalClimb type='Flash' total={flash?.length} />
                                    <TotalClimb type='Onsight' total={onsight?.length} />
                                </Card>
                            </div>

                            <div >
                                <div className='font-bold text-lg pl-6 pb-1'>Top Climbs</div>
                                <Card className='flex flex-col md:flex-row gap-3 divide-txt not-md:divide-y md:divide-x px-0'>
                                    <TopClimb style="Worked" name={yearAndTypeClimbs[0]?.name ?? "N/A"} grade={yearAndTypeClimbs[0]?.grade ?? "N/A"} colour={yearAndTypeClimbs[0]?.grade != null ? "tertiary" : "disabled"} />
                                    <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "tertiary" : "disabled"} />
                                    <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "tertiary" : "disabled"} />
                                </Card>
                            </div>
                        </div>


                        <GraphContainer processing={gradesProcessing} title='Climb count by grade' dependantNum={gradesData.length}>
                            <GradeGraph data={gradesData} />
                        </GraphContainer>

                        <GraphContainer processing={topClimbsProcessing} title='Top 10 hardest climbs per year' dependantNum={topClimbsData?.topClimbsPerYear?.length}>
                            <TopClimbsGraph data={topClimbsData.topClimbsPerYear} presentGrades={topClimbsData.gradeList} climbNames={topClimbsData.names} />
                        </GraphContainer>

                        <GraphContainer processing={timelineProcessing} title='Accumulation of climbs by grade' dependantNum={timelineData?.data?.length} className='md:col-span-2 md:h-[600px]'>
                            <TimelineGraph data={timelineData.data} presentGrades={timelineData.presentGrades} />
                        </GraphContainer>

                        <GraphContainer processing={mapProcessing} title='World heatmap' dependantNum={Object.keys(mapData).length} className='md:row-span-2  md:h-full not-md:h-[45rem]' padded={false}>
                            <AreaMap data={mapData} />
                        </GraphContainer>

                        <GraphContainer processing={avgMaxProcessing} title='Max and average grade per year' dependantNum={avgMaxData.length}>
                            <AvgMaxGraph data={avgMaxData} type={selectedType} />
                        </GraphContainer>

                        <GraphContainer processing={countryProcessing} title='Climbs per country' dependantNum={countryData?.countries?.length}>
                            <CountryGraph data={countryData} />
                        </GraphContainer>
                    </>
                    :

                    <Card className='text-txt col-span-2 text-center py-10'>No Data</Card>

            }


        </div>

    )
}