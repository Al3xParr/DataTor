import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { BarLabelProps, BarPlot } from '@mui/x-charts/BarChart';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

import { Log } from "../../resources/types";
import { GradeConverter } from "../../resources/utils";



import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { YearSummary } from './yearSummary';
import { Button, Select } from '@radix-ui/themes';
import { useEffect, useState } from 'react';



interface StyleSummaryProps {
    title: string,
    logs: Log[],
    firstYear: number
}


function getDateData(climbs: Log[], presentGrades: string[]) {
    const climbDate: { [key: string]: Date | number }[] = []

    function newDate(date: Date = new Date()): { [key: string]: Date | number } {
        const a: { [key: string]: Date | number } = { "date": date }
        for (const grade of presentGrades.values()) a[grade] = 0
        return a
    }


    var currentDate = newDate()
    structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb) => {

        if (currentDate["date"].toString() != climb.date.toString()) {

            climbDate.push({ ...currentDate })

            currentDate["date"] = climb.date
        }
        const temp = currentDate[climb.grade] ?? 0
        if (typeof (temp) == "number") currentDate[climb.grade] = temp + 1

    })

    return climbDate
}

export default function StyleSummary({ title, logs, firstYear }: StyleSummaryProps) {

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [yearList, setYearList] = useState<number[]>([])

    useEffect(() => {
        setYearList(Array.from({ length: new Date().getFullYear() - firstYear + 1 }, (_, index) => firstYear + index))

    }, [firstYear])

    const gradeConverter = new GradeConverter()
    const datedLogs = logs.filter((l) => selectedYear == 0 || l.date.getFullYear() == selectedYear).sort((a, b) => gradeConverter.compareGrade(a.grade, b.grade))


    const total = datedLogs.length
    const flash = datedLogs.filter((l) => l.style == "Flash")
    const onsight = datedLogs.filter((l) => l.style == "Onsight")

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
    structuredClone(datedLogs).reverse().forEach((climb) => {
        if (!presentGrades.includes(climb.grade)) presentGrades.push(climb.grade)
        let temp = climbFreq[climb.grade] ?? [0, 0, 0] // send, flash, onsight
        temp[getStyleIndex(climb.style)] = temp[getStyleIndex(climb.style)] + 1
        climbFreq[climb.grade] = temp
    })

    for (const key in climbFreq) {
        climbDataSet.push({ "grade": key, "send": climbFreq[key][0].valueOf(), "flash": climbFreq[key][1].valueOf(), "onsight": climbFreq[key][2].valueOf() })
    }


    const climbByDateDataset = getDateData(datedLogs, presentGrades)


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

    const Text = styled('text')(({ theme }) => ({
        ...theme?.typography?.body2,
        stroke: 'none',
        fill: (theme.vars || theme)?.palette?.text?.primary,
        transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
        textAnchor: 'middle',
        dominantBaseline: 'central',
        pointerEvents: 'none',
    }));

    function BarLabel(props: BarLabelProps) {
        const {
            seriesId,
            dataIndex,
            color,
            isFaded,
            isHighlighted,
            classes,
            xOrigin,
            yOrigin,
            x,
            y,
            width,
            height,
            layout,
            skipAnimation,
            ...otherProps
        } = props;

        const animatedProps = useAnimate(
            { x: x + width / 2, y: y - 8 },
            {
                initialProps: { x: x + width / 2, y: yOrigin },
                createInterpolator: interpolateObject,
                transformProps: (p) => p,
                applyProps: (element: SVGTextElement, p) => {
                    element.setAttribute('x', p.x.toString());
                    element.setAttribute('y', p.y.toString());
                },
                skip: skipAnimation,
            },
        );

        return (
            <Text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
        );
    }

    return (
        <div className="rounded border m-4">
            <div className="font-bold">{title}</div>
            <div className="font-bold">{total} climbs sent</div>
            <div className="font-bold">{flash.length} climbs flashed</div>
            {/* <div>{flash.map((climb) => {return <div key={climb.id}>{climb.name} - {climb.grade}</div>})}</div> */}
            <div className="font-bold">{onsight?.length} climbs onsighted</div>
            {/* <div>{onsight.map((climb) => {return <div key={climb.id}>{climb.name} - {climb.grade}</div>})}</div> */}
            <div className="font-bold">Hardest Send - {datedLogs[0]?.name ?? "N/A"} - {datedLogs[0]?.grade ?? "N/A"}</div>
            <div className="font-bold">Hardest Flash - {flash[0]?.name ?? "N/A"} - {flash[0]?.grade ?? "N/A"}</div>
            <div className="font-bold">Hardest Onsight - {onsight[0]?.name ?? "N/A"} - {onsight[0]?.grade ?? "N/A"}</div>


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



            {datedLogs.length > 0 ?
                <>
                    <BarChart
                        dataset={climbDataSet}
                        
                        series={[
                            { dataKey: "onsight", stack: "total", label: "Onsight" },
                            { dataKey: "flash", stack: "total", label: "Flash" },
                            { dataKey: 'send', stack: "total", label: "Send" }
                        ]}
                        xAxis={[{ dataKey: "grade" }]}
                        yAxis={[{ dataKey: "freq" }]}
                        barLabel={"value"}
                        borderRadius={7}
                        {...config}
                    />
                </>
                : <></>}


            {datedLogs.length > 0 ?

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
                        dataKey: "date",
                        scaleType: "time",
                        //label: "Date",
                        labelStyle: { ...fontStyling },
                        //valueFormatter: (date: number) => new Date(date).toLocaleDateString(),
                        //min: climbDate[0]["date"],
                        //max: Date.now(),
                    }]}

                    {...lineConfig}
                />


                :

                <></>}


        </div>
    )

}