
import { Select, Theme } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { GradeGraphData, Log } from "../../resources/types";
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
    owner: string
}

export default function Summary({ logs, owner }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>("Bouldering");

    const [yearAndTypeClimbs, setYearAndTypeClimbs] = useState([] as Log[]) // log list selected type and year
    const [yearAndTypeClimbsYds, setYearAndTypeClimbsYds] = useState([] as Log[]) // log list selected type and year
    const [typeClimbs, setTypeClimbs] = useState([] as Log[]) // log list of selected type
    const [typeClimbsYds, setTypeClimbsYds] = useState([] as Log[]) // log list of selected type
    const flash = yearAndTypeClimbs.filter((l) => l.style == "Flash")
    const onsight = yearAndTypeClimbs.filter((l) => l.style == "Onsight")

    const [yearList, setYearList] = useState([] as number[])


    const [gradesData, gradesProcessing] = useDataRetrieval<GradeGraphData[]>(yearAndTypeClimbs, getGradeData)
    const [gradesYdsData, gradesYdsProcessing] = useDataRetrieval<GradeGraphData[]>(yearAndTypeClimbsYds, getGradeData)

    const [topClimbsData, topClimbsProcessing] = useDataRetrieval<TopClimbsDataRtn>(typeClimbs, getTopClimbsData)
    const [topClimbsYdsData, topClimbsYdsProcessing] = useDataRetrieval<TopClimbsDataRtn>(typeClimbsYds, getTopClimbsData)

    const [timelineData, timelineProcessing] = useDataRetrieval<TimelineDataRtn>(useMemo(() => yearAndTypeClimbs.concat(yearAndTypeClimbsYds), [yearAndTypeClimbsYds]), getTimelineData)
    const [mapData, mapProcessing] = useDataRetrieval<Record<string, AreaData>>(useMemo(() => yearAndTypeClimbs.concat(yearAndTypeClimbsYds), [yearAndTypeClimbsYds]), getMapData)
    
    const [avgMaxData, avgMaxProcessing] = useDataRetrieval<AvgMaxData[]>(typeClimbs, getAvgMaxData)
    const [countryData, countryProcessing] = useDataRetrieval<CountryData>(yearAndTypeClimbs, getCountryData)



    useEffect(() => {

        setYearAndTypeClimbs(logs.filter((l) => (selectedYear == 0 || l.date.getFullYear() == selectedYear) && l.type == selectedType && !l.yds))
        setYearAndTypeClimbsYds(logs.filter((l) => (selectedYear == 0 || l.date.getFullYear() == selectedYear) && l.type == selectedType && l.yds))
        setTypeClimbs(logs.filter((l) => (l.type == selectedType && !l.yds)))
        setTypeClimbsYds(logs.filter((l) => (l.type == selectedType && l.yds)))
        setYearList([...new Set(logs.map((climb) => climb.date.getFullYear()))].sort((a, b) => b - a))
        

        
    }, [logs, selectedYear, selectedType])

    if (logs.length == 0) return (<></>)

    return (
        <div className="w-full h-max grid grid-cols-2 gap-4 flex-col">

            <Card className='p-6 col-span-2 w-full flex flex-col gap-3 md:flex-row justify-between'>

                <div className='flex flex-col'>
                    {/* <h3 className='font-extrabold text-2xl'>Welcome{owner != "" ? ", " + owner : ""}! {gradesYdsData.length == 0 ? "Empty" : "full"}</h3> */}
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


                        <GraphContainer processing={gradesProcessing && gradesYdsProcessing} title='Climb count by grade' className={`${gradesYdsData.length > 0 ? "h-[800px]" : ""}`}>
                            <GradeGraph data={gradesData} />
                            {gradesYdsData.length > 0
                                ?
                                <GradeGraph data={gradesYdsData} />
                                :
                                <></>
                            }

                        </GraphContainer>

                        <GraphContainer processing={topClimbsProcessing} title='Top 10 hardest climbs per year' className={`${topClimbsYdsData?.topClimbsPerYear?.length > 0 ? "h-[800px]" : ""}`}>
                            <TopClimbsGraph data={topClimbsData.topClimbsPerYear} presentGrades={topClimbsData.gradeList} climbNames={topClimbsData.names} />
                            {topClimbsYdsData?.topClimbsPerYear?.length > 0
                                ?
                                <TopClimbsGraph data={topClimbsYdsData.topClimbsPerYear} presentGrades={topClimbsYdsData.gradeList} climbNames={topClimbsYdsData.names} />
                                :
                                <></>
                            }
                        </GraphContainer>

                        <GraphContainer processing={timelineProcessing} title='Accumulation of climbs by grade' className='md:col-span-2 md:h-[600px]'>
                            <TimelineGraph data={timelineData.data} presentGrades={timelineData.presentGrades} />
                        </GraphContainer>

                        <GraphContainer processing={mapProcessing} title='World heatmap' className='md:row-span-2  md:h-full not-md:h-[45rem]' padded={false}>
                            <AreaMap data={mapData} />
                        </GraphContainer>

                        <GraphContainer processing={avgMaxProcessing} title='Max and average grade per year' >
                            <AvgMaxGraph data={avgMaxData} type={selectedType} />
                        </GraphContainer>

                        <GraphContainer processing={countryProcessing} title='Climbs per country'>
                            <CountryGraph data={countryData} />
                        </GraphContainer>
                    </>
                    :

                    <Card className='text-txt col-span-2 text-center py-10'>No Data</Card>

            }


        </div>

    )
}