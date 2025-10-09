
import { Select, Theme } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';
import { GradeGraphData, Log } from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { AvgMaxData, getAvgMaxData, getGradeData, getMapData, getCountryData, getTimelineData, CountryData, AreaData, TopClimbsDataRtn, getTopClimbsData, TimelineDataRtn, getTotalsData, TotalsData } from '../../resources/serverUtils';
import { Card } from './ui/card';
import GraphContainer from './ui/graphContainer';
import AvgMaxGraph from './graphs/avgMaxGraph';
import CountryGraph from './graphs/countryGraph';
import AreaMap from './graphs/areaMap';
import useDataRetrieval from '../../resources/useDataRetrieval';
import TotalsGraph from './graphs/totalsGraph';
import { Star, View, Zap } from 'lucide-react';
import TopClimb from './topClimb';


interface StyleSummaryProps {
    logs: Log[],
    owner: string,
    msg?: string
}

export default function Summary({ logs, owner, msg }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>("Bouldering");

    const [yearAndTypeClimbs, setYearAndTypeClimbs] = useState([] as Log[]) // log list selected type and year
    const [yearAndTypeClimbsYds, setYearAndTypeClimbsYds] = useState([] as Log[]) // log list selected type and year
    const [typeClimbs, setTypeClimbs] = useState([] as Log[]) // log list of selected type
    const [typeClimbsYds, setTypeClimbsYds] = useState([] as Log[]) // log list of selected type
    const flash = yearAndTypeClimbs.filter((l) => l.style == "Flash")
    const onsight = yearAndTypeClimbs.filter((l) => l.style == "Onsight")

    const [yearList, setYearList] = useState([] as number[])

const [totalsData, totalsProcessing] = useDataRetrieval<TotalsData>(yearAndTypeClimbs, getTotalsData)

    const [gradesData, gradesProcessing] = useDataRetrieval<GradeGraphData[]>(yearAndTypeClimbs, getGradeData)
    const [gradesYdsData, gradesYdsProcessing] = useDataRetrieval<GradeGraphData[]>(yearAndTypeClimbsYds, getGradeData)

    const [topClimbsData, topClimbsProcessing] = useDataRetrieval<TopClimbsDataRtn>(typeClimbs, getTopClimbsData)
    const [topClimbsYdsData, topClimbsYdsProcessing] = useDataRetrieval<TopClimbsDataRtn>(typeClimbsYds, getTopClimbsData)

    const [timelineData, timelineProcessing] = useDataRetrieval<TimelineDataRtn>(useMemo(() => yearAndTypeClimbs.concat(yearAndTypeClimbsYds), [yearAndTypeClimbs]), getTimelineData)
    const [mapData, mapProcessing] = useDataRetrieval<Record<string, AreaData>>(useMemo(() => yearAndTypeClimbs.concat(yearAndTypeClimbsYds), [yearAndTypeClimbs]), getMapData)

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
        <>

            <Card className='p-6 w-full flex flex-col gap-3 md:flex-row justify-between mb-5'>

                <div className='flex flex-col'>
                    {!msg ?
                        <>
                            <h3 className='font-extrabold text-2xl'>Welcome{owner != "" ? ", " + owner : ""}!</h3>
                            <p className='pl-1 pt-1 text-txt-muted'>Explore insights into your logbook and see your progress over time</p>
                        </>
                        :
                        <>
                            <h3 className='font-extrabold text-2xl'>This is an Example Logbook!</h3>
                            <p className='pl-1 pt-1 text-txt-muted'>Explore insights into your logbook and see your progress over time</p>
                        </>
                    }
                </div>

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

            <div className="w-full h-max grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 auto-rows-[250px] gap-5 flex-col">

                {
                    yearAndTypeClimbs.length != 0 ?
                        <>
                            <div className='md:max-3xl:flex md:max-3xl:col-span-2 flex-col md:max-3xl:flex-row row-span-2 md:max-3xl:row-span-1 grid grid-cols-2 place-items-center w-full h-full justify-evenly items-center '>
                                <div className='w-min h-full flex items-center'>{!totalsProcessing && <TotalsGraph data={totalsData} />}</div>
                                    <TopClimb
                                        type="Worked"
                                        name={yearAndTypeClimbs[0]?.name ?? "N/A"}
                                        grade={yearAndTypeClimbs[0]?.grade ?? "N/A"}
                                        icon={<Star size={60} />}
                                    />
                                    <TopClimb
                                        type="Flash"
                                        name={flash[0]?.name ?? "N/A"}
                                        grade={flash[0]?.grade ?? "N/A"}
                                        icon={<Zap size={60}   />}
                                    />
                                    <TopClimb
                                        type="Onsight"
                                        name={onsight[0]?.name ?? "N/A"}
                                        grade={onsight[0]?.grade ?? "N/A"}
                                        icon={<View size={60} />}
                                    />
                            </div>


                            <GraphContainer processing={gradesProcessing && gradesYdsProcessing} title='Climb count by grade' className={`${gradesYdsData.length > 0 ? "row-span-3" : ""} `}>
                                <GradeGraph data={gradesData} />
                                {gradesYdsData.length > 0
                                    ?
                                    <GradeGraph data={gradesYdsData} />
                                    :
                                    <></>
                                }

                            </GraphContainer>

                            <GraphContainer processing={topClimbsProcessing} title='Top 10 hardest climbs per year' className={`${topClimbsYdsData?.topClimbsPerYear?.length > 0 ? "row-span-3" : ""} `}>
                                <TopClimbsGraph data={topClimbsData.topClimbsPerYear} presentGrades={topClimbsData.gradeList} climbNames={topClimbsData.names} />
                                {topClimbsYdsData?.topClimbsPerYear?.length > 0
                                    ?
                                    <TopClimbsGraph data={topClimbsYdsData.topClimbsPerYear} presentGrades={topClimbsYdsData.gradeList} climbNames={topClimbsYdsData.names} />
                                    :
                                    <></>
                                }
                            </GraphContainer>

                            <GraphContainer processing={avgMaxProcessing} title='Max and average grade per year' className='' >
                                <AvgMaxGraph data={avgMaxData} type={selectedType} />
                            </GraphContainer>

                            <GraphContainer processing={timelineProcessing} title='Accumulation of climbs by grade' className='3xl:col-span-2 row-span-3'>
                                <TimelineGraph data={timelineData.data} presentGrades={timelineData.presentGrades} />
                            </GraphContainer>

                            <GraphContainer processing={mapProcessing} title='World heatmap' className={`row-span-3 lg:row-span-4 3xl:col-span-2 `} padded={false}>
                                <AreaMap data={mapData} />
                            </GraphContainer>



                            <GraphContainer processing={countryProcessing} title='Climbs per country' className=''>
                                <CountryGraph data={countryData} />
                            </GraphContainer>

                        </>
                        :

                        <Card className='text-txt col-span-2 text-center py-10'>No Data</Card>

                }


            </div>
        </>

    )
}