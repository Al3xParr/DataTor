
import { Select, Switch, Theme } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { GradeGraphData, Log, TimelineGraphData, TopClimbsGraphData } from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { TopClimb } from './topClimb';
import { AvgMaxData, getAvgMaxData, getGradeData, getMapData, getCountryData, getTimelineData, getTopClimbsPerYear, CountryData, AreaData } from '../../resources/serverUtils';
import TotalClimb from './totalClimb';
import { Card } from './ui/card';
import GraphContainer from './ui/graphContainer';
import AvgMaxGraph from './graphs/avgMaxGraph';
import CountryGraph from './graphs/countryGraph';
import AreaMap from './graphs/areaMap';


interface StyleSummaryProps {
    logs: Log[],
    firstYear: number,
    owner: string
}

export default function Summary({ logs, firstYear, owner }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedType, setSelectedType] = useState<string>("Bouldering");
    
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

    const [avgMaxData, setAvgMaxData] = useState<AvgMaxData[]>([])
    const [minGrade, setMinGrade] = useState<number>(0)

    const [countryData, setCountryData] = useState<CountryData>({} as CountryData)
    const [mapData, setMapData] = useState<Record<string, AreaData>>({})


    const [timelineProcessing, setTimelineProcessing] = useState(true)
    const [gradesProcessing, setGradesProcessing] = useState(true)
    const [topClimbsProcessing, setTopClimbsProcessing] = useState(true)
    const [avgMaxProcessing, setAvgMaxProcessing] = useState(true)
    const [regionProcessing, setRegionProcessing] = useState(true)
    const [mapProcessing, setMapProcessing] = useState(true)


    useEffect(() => {
        if (logs.length == 0) return
        
        const climbsInStyle = logs.filter((l) => l.type == selectedType)
        
        getGradeData(filteredClimbs).then((data) => {
            setGradeDataSet(data.gradeDataSet)
            setPresentGrades(data.presentGrades)
            setGradesProcessing(false)
            getTimelineData(filteredClimbs, data.presentGrades, selectedYear == 0).then((d) => {
                setTimelineData(d)
                setTimelineProcessing(false)
            })
        })

        getTopClimbsPerYear(climbsInStyle, yearList).then((data) => {
            setTopClimbsPerYear(data.topClimbsPerYear)
            setGradesInTopClimbs(data.gradesInTopClimbs)
            setTopClimbNames(data.topClimbNames)
            setTopClimbsProcessing(false)
        })

        getAvgMaxData(climbsInStyle, yearList).then((data) => {
            setAvgMaxData(data.data)
            setMinGrade(data.min)
            setAvgMaxProcessing(false)
        })

        getCountryData(filteredClimbs).then((data) => {
            setCountryData(data)
            setRegionProcessing(false)
        })

        getMapData(filteredClimbs).then((data) => {
            setMapData(data)
            setMapProcessing(false)
        })

    }, [logs, selectedYear, selectedType])

    if (logs.length == 0) return (<></>)

    return (
        <div className="w-full h-max grid grid-cols-2 gap-4 flex-col">

            <Card className='p-6 col-span-2 w-full flex flex-col gap-3 md:flex-row justify-between'>

                <div className='flex flex-col'>
                    <h3 className='font-extrabold text-2xl'>Welcome{owner != "" ? ", " + owner : ""}!</h3>
                    <p className='pl-1 pt-1'>Explore insights into your logbook and see your progress over time</p>                </div>

                <Theme
                    style={{ height: "min-content", minHeight: "min-content", fontFamily: "Nunito serif" }}
                    className='flex gap-4 self-end items-center'
                >
                    <Select.Root defaultValue='Bouldering' onValueChange={(value) => setSelectedType(value)} >
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

            <div className='col-span-2 flex flex-col md:flex-row gap-5 items-center p-4 justify-evenly'>
                <div>
                    <div className='font-bold text-lg pl-6 pb-1'>Total Climbs</div>
                    <Card className='flex divide-x px-0 divide-secondary  w-max'>
                        <TotalClimb type='Sent' total={filteredClimbs.length} />
                        <TotalClimb type='Flash' total={flash?.length} />
                        <TotalClimb type='Onsight' total={onsight?.length} />
                    </Card>
                </div>

                <div >
                    <div className='font-bold text-lg pl-6 pb-1'>Top Climbs</div>
                    <Card className='flex gap-3 divide-secondary divide-x px-0'>
                        <TopClimb style="Worked" name={filteredClimbs[0]?.name ?? "N/A"} grade={filteredClimbs[0]?.grade ?? "N/A"} colour={filteredClimbs[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "tertiary" : "disabled"} />
                        <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "tertiary" : "disabled"} />
                    </Card>
                </div>
            </div>


            <GraphContainer processing={gradesProcessing} title='Climb count by grade' dependantNum={gradeDataSet.length}>
                <GradeGraph data={gradeDataSet} />
            </GraphContainer>

            <GraphContainer processing={topClimbsProcessing} title='Top 10 hardest climbs per year' dependantNum={topClimbsPerYear.length}>
                <TopClimbsGraph data={topClimbsPerYear} presentGrades={gradesInTopClimbs} climbNames={topClimbNames} />
            </GraphContainer>

            <GraphContainer processing={timelineProcessing} title='Accumulation of climbs by grade' dependantNum={timelineData.length} className='md:col-span-2 md:h-[600px]'>
                <TimelineGraph data={timelineData} presentGrades={presentGrades} />
            </GraphContainer>

            <GraphContainer processing={mapProcessing} title='World heatmap' dependantNum={Object.keys(mapData).length} className='md:row-span-2 md:h-full' padded={false}>
                <AreaMap data={mapData} />
            </GraphContainer>

            <GraphContainer processing={avgMaxProcessing} title='Max and average grade per year' dependantNum={avgMaxData.length}>
                <AvgMaxGraph data={avgMaxData} min={minGrade} type={selectedType} />
            </GraphContainer>

            <GraphContainer processing={regionProcessing} title='Climbs per country' dependantNum={countryData?.countries?.length}>
                <CountryGraph data={countryData} />
            </GraphContainer>

        </div>

    )
}