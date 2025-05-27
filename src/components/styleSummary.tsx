import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { Select } from '@radix-ui/themes';
import { useState } from 'react';
import { Medal } from 'lucide-react';

import { Log } from "../../resources/types";
import { GradeConverter } from "../../resources/utils";
import { Badge } from './badge';


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
    structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb) => {

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
        <div className="font-normal flex text-center items-center my-1">
            {style}
            <p className=' font-bold text-xl mx-2'>{name}</p>
            <Badge text={grade} colour={colour}></Badge>
        </div>
    )
}

export default function StyleSummary({ title, logs, firstYear }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);

    const yearList = Array.from({ length: new Date().getFullYear() - firstYear + 1 }, (_, index) => firstYear + index)

    const gradeConverter = new GradeConverter()
    const allClimbs = logs.filter((l) => selectedYear == 0 || l.date.getFullYear() == selectedYear).sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade))

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


    const climbByDateDataset = getDateData(allClimbs, presentGrades)

    const config: Partial<BarChartProps> = {
        height: 350,
        margin: { left: 40 },
        hideLegend: true,
        grid: { horizontal: true }
    };

    const lineConfig: Partial<LineChartProps> = {
        margin: { left: 40 },
        grid: { horizontal: true }
    };

    const fontStyling = { fontSize: 18, fontWeight: "bold" }


    return (
        <div className="flex flex-col p-4 rounded-lg shadow-md border border-gray-300 dark:bg-gray-800">
            <div className="font-bold text-xl w-full  flex justify-between">{title}

                <Select.Root defaultValue='0' onValueChange={(value) => setSelectedYear(parseInt(value))} >
                    <Select.Trigger className='SelectTrigger' >
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Years</Select.Label>
                            <Select.Item value={"0"}>All Years</Select.Item>
                            {yearList.map((y) => {
                                return (<Select.Item key={y} value={y.toString()}>{y.toString()}</Select.Item>)
                            })}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>

            </div>
            <div className='grid grid-cols-2 items-center p-4'>
                <div className='grid grid-cols-3 divide-x divide-gray-400 border-gray-400 p-2 border rounded-xl shadow-md'>
                    <div className="flex flex-col items-center">
                        <div>Sent</div>
                        <div className='font-bold text-3xl'>{total}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div>Flash</div>
                        <div className='font-bold text-3xl'>{flash?.length}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div>Onsight</div>
                        <div className='font-bold text-3xl'>{onsight?.length}</div>
                    </div>

                </div>

                <div className='gap-2 font-bold justify-items-center'>
                    <Medal size={50} className='flex'></Medal>
                    <TopClimb style="Style" name={allClimbs[0]?.name ?? "N/A"} grade={allClimbs[0]?.grade ?? "N/A"} colour="blue" />
                    <TopClimb style="Flash" name={flash[0]?.name ?? "N/A"} grade={flash[0]?.grade ?? "N/A"} colour="blue" />
                    <TopClimb style="Onsight" name={onsight[0]?.name ?? "N/A"} grade={onsight[0]?.grade ?? "N/A"} colour="blue" />

                </div>
            </div>


            {allClimbs.length > 0 ?
                <>
                    <BarChart
                        dataset={climbDataSet}

                        series={[
                            { dataKey: "onsight", stack: "total", label: "Onsight", color: "#e15759" },
                            { dataKey: "flash", stack: "total", label: "Flash", color: "#edc949" },
                            { dataKey: 'send', stack: "total", label: "Send", color: "#59a14f" }
                        ]}
                        xAxis={[{ dataKey: "grade" }]}
                        yAxis={[{ dataKey: "freq" }]}
                        barLabel={"value"}
                        borderRadius={7}
                        {...config}
                    />
                </>
                : <div className='w-full h-full text-center'>No Logged Climbs</div>}


            {allClimbs.length > 0 ?

                <LineChart
                    height={600}

                    dataset={climbByDateDataset}
                    series={presentGrades.map((grade) => ({
                        dataKey: grade,
                        label: grade,
                        type: "line",
                        showMark: false,

                        curve: "stepAfter",
                        labelMarkType: "circle"
                    }))}

                    slotProps={{
                        tooltip: { trigger: "axis", },
                        legend: {
                            direction: "vertical",
                            sx: {
                                [`.${legendClasses.mark}`]: {
                                    height: 15,
                                    width: 15,
                                },
                                ...fontStyling
                            }
                        }
                    }}
                    yAxis={[{
                        width: 50,
                        label: "Number of Climbs",
                        labelStyle: { ...fontStyling }

                    }]}
                    xAxis={[{
                        id: "date",
                        dataKey: "date",
                        scaleType: "time",
                        //label: "Date",
                        //labelStyle: { ...fontStyling },
                        valueFormatter: (date: number) => new Date(date).toLocaleDateString(),

                    }]}

                    {...lineConfig}
                />
                :
                <div className='w-full h-full text-center'>No Logged Climbs</div>}

        </div>
    )

}