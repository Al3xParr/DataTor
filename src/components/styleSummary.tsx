
import { Select, Theme } from '@radix-ui/themes';
import { useState } from 'react';
import { Log } from "../../resources/types";
import GradeGraph from './graphs/gradeGraph';
import TimelineGraph from './graphs/timelineGraph';
import TopClimbsGraph from './graphs/topClimbsGraph';
import { TopClimb } from './topClimb';
import { getFrequencyData,  getTimelineData, getTopClimbsPerYear } from '../../resources/utils';


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

    const {
        gradeDataSet,
        presentGrades
    } = getFrequencyData(filteredClimbs)

    const {
        topClimbsPerYear,
        gradesInTopClimbs,
        topClimbNames
    } = getTopClimbsPerYear(logs, yearList);

    const timelineData = getTimelineData(filteredClimbs, presentGrades)

    return (
        <div className="flex flex-col p-6 rounded-xl shadow-md  bg-white">
            <div className="font-extrabold text-3xl w-full  flex justify-between">{title}

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
            <div className='flex flex-col md:flex-row gap-3 items-center p-4 justify-around'>
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

            {filteredClimbs.length > 0 ?
                <GradeGraph data={gradeDataSet.reverse()} />
                :
                <div className='w-full h-full text-center'>No Logged Climbs</div>
            }

            {filteredClimbs.length > 0 ?
                <TimelineGraph data={timelineData} presentGrades={presentGrades} />
                :
                <div className='w-full h-full text-center'>No Logged Climbs</div>
            }

            {logs.length > 0 ?
                <TopClimbsGraph data={topClimbsPerYear} presentGrades={gradesInTopClimbs} climbNames={topClimbNames} />
                :
                <div className='w-full h-full text-center'>No Logged Climbs</div>
            }

        </div>
    )
}