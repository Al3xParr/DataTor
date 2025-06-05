
import { Select } from '@radix-ui/themes';
import { useState } from 'react';
import { Medal } from 'lucide-react';

import { Log } from "../../resources/types";
import { GradeConverter } from "../../resources/utils";
import { Badge } from './badge';
import GradeGraph from './gradeGraph';
import TimelineGraph from './timelineGraph';


interface StyleSummaryProps {
    title: string,
    logs: Log[],
    firstYear: number
}


function getDateData(climbs: Log[], presentGrades: string[]) {
    const climbDate: { [key: string]: Date | number }[] = []

    function newDate(date: number = new Date().getTime()): { [key: string]: number | number } {
        const a: { [key: string]: number | number } = { "date": date }
        for (const grade of presentGrades.values()) a[grade] = 0
        return a
    }


    var currentDate = newDate()
    structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb, index) => {
        if (index == 0) currentDate["date"] = climb.date.getTime()
        if (currentDate["date"] != climb.date.getTime()) {

            climbDate.push({ ...currentDate })

            currentDate["date"] = climb.date.getTime()
        }
        const temp = currentDate[climb.grade] ?? 0
        if (typeof (temp) == "number") currentDate[climb.grade] = temp + 1

    })

    return climbDate
}

interface TopClimbProps {
    style: string,
    name: string,
    grade: string,
    colour: string
}

function TopClimb({ style, name, grade, colour }: TopClimbProps) {
    return (
        <div className="font-normal flex text-center items-center my-1 ">
            {style}
            <p className=' font-bold text-xl mx-2 text-ellipsis'>{name}</p>
            <Badge text={grade} colour={colour}></Badge>
        </div>
    )
}

export default function StyleSummary({ title, logs, firstYear }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);

    const yearList = Array.from({ length: new Date().getFullYear() - firstYear + 1 }, (_, index) => firstYear + index)

    const gradeConverter = new GradeConverter()
    const allClimbs = logs.filter((l) => selectedYear == 0 || l.date.getFullYear() == selectedYear).sort((a, b) => gradeConverter.compareGrade(a, b))

    const total = allClimbs.length
    const flash = allClimbs.filter((l) => l.style == "Flash")
    const onsight = allClimbs.filter((l) => l.style == "Onsight")

    const presentGrades: string[] = []

    const climbFreq: Record<string, number[]> = {}
    const climbDataSet = []
    function getStyleIndex(style: string) {
        switch (style) {
            case "Flash": return 1
            case "Onsight": return 2
            default: return 0
        }
    }
    structuredClone(allClimbs).reverse().forEach((climb) => {
        if (!presentGrades.includes(climb.grade)) presentGrades.push(climb.grade)
        let temp = climbFreq[climb.grade] ?? [0, 0, 0] // send, flash, onsight
        temp[getStyleIndex(climb.style)] = temp[getStyleIndex(climb.style)] + 1
        climbFreq[climb.grade] = temp
    })

    for (const key in climbFreq) {
        climbDataSet.push({ "grade": key, "send": climbFreq[key][0].valueOf(), "flash": climbFreq[key][1].valueOf(), "onsight": climbFreq[key][2].valueOf() })
    }


    const timelineData = getDateData(allClimbs, presentGrades)

    return (
        <div className="flex flex-col p-4 rounded-lg shadow-md border border-gray-300 dark:bg-gray-800">
            <div className="font-bold text-xl w-full  flex justify-between">{title}

                <Select.Root defaultValue='0' onValueChange={(value) => setSelectedYear(parseInt(value))} >
                    <Select.Trigger className='SelectTrigger' >
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

            </div>
            <div className='flex flex-col md:flex-row gap-3 items-center p-4 justify-items-center '>
                <div className='flex divide-x divide-gray-400 border-gray-400 p-2 border rounded-xl shadow-md w-max'>

                    <div className="flex flex-col items-center px-5">
                        <div>Total Sent</div>
                        <div className='font-bold text-3xl'>{total}</div>
                    </div>

                    <div className="flex flex-col items-center px-5">
                        <div>Flash</div>
                        <div className='font-bold text-3xl'>{flash?.length}</div>
                    </div>

                    <div className="flex flex-col items-center px-5">
                        <div>Onsight</div>
                        <div className='font-bold text-3xl'>{onsight?.length}</div>
                    </div>

                </div>

                <div className='gap-2 font-bold justify-items-center border bg-dark rounded-xl border-gray-400 shadow-md p-4 w-max max-w-fit'>
                    <Medal size={50} className='flex'></Medal>
                    <TopClimb style="Style" name={allClimbs[0]?.name ?? "N/A"} grade={allClimbs[0]?.grade ?? "N/A"} colour={allClimbs[0]?.grade != null ? "blue" : "grey"} />
                    <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour={flash[0]?.grade != null ? "blue" : "grey"} />
                    <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour={onsight[0]?.grade != null ? "blue" : "grey"} />

                </div>
            </div>


            {allClimbs.length > 0 ?
                <GradeGraph data={climbDataSet} />
                : 
                <div className='w-full h-full text-center'>No Logged Climbs</div>
                }
            {allClimbs.length > 0 ?
                <TimelineGraph data={timelineData} presentGrades={presentGrades}/>

                :
                <div className='w-full h-full text-center'>No Logged Climbs</div>
                }

        </div>
    )

}