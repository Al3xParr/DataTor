import {
    BarPlot,
    ChartContainer,
    ChartsTooltip,
    ChartsXAxis,
    ChartsYAxis,
    barLabelClasses,
    chartsTooltipClasses,
} from '@mui/x-charts'
import {
    globalColours,
    GradeConverter,
    mediumFontStyling,
    smallFontStyling,
} from '../../../resources/utils'
import React, { useEffect } from 'react'
import tinygradient from 'tinygradient'

interface TopClimbsGraphProps {
    data: { [key: string]: number }[]
    presentGrades: string[]
    climbNames: Record<string, string[]>
}

export default function TopClimbsGraph({
    data,
    presentGrades,
    climbNames,
}: TopClimbsGraphProps) {
    const gradeConverter = new GradeConverter()
    const numberOfGrades = Math.max(presentGrades.length, 2)
    const globalColourList = globalColours.slice(
        0,
        Math.min(numberOfGrades, globalColours.length)
    )

    const grad = tinygradient(globalColourList)
    const colours = grad.rgb(numberOfGrades)

    if (presentGrades.length == 0) return

    return (
        <ChartContainer
            className="h-max"
            dataset={data}
            series={presentGrades
                .sort((a, b) => gradeConverter.compareGrade(a, b))
                .reverse()
                .map((grade, index) => ({
                    id: grade,
                    dataKey: grade,
                    label: grade,

                    type: 'bar',
                    stack: 'total',
                    color: colours[index],
                    valueFormatter: (v, context) => {
                        const yearGradeString =
                            data[context.dataIndex].year + '-' + grade
                        return climbNames[yearGradeString].join('\n   ')
                    },
                }))}
            xAxis={[
                {
                    dataKey: 'year',
                    disableTicks: true,
                    scaleType: 'band',
                },
            ]}
            yAxis={[
                {
                    width: 25,
                },
            ]}
            margin={{ top: 20 }}
            sx={{
                [`.${barLabelClasses.root}`]: {
                    ...mediumFontStyling,
                    fill: 'white',
                },
            }}
        >
            <BarPlot
                borderRadius={7}
                barLabel={(item, _) => {
                    if (item.value == 0) return ''
                    return item.seriesId.toString()
                }}
            />
            <ChartsXAxis tickLabelStyle={{ ...smallFontStyling }} />
            <ChartsYAxis tickLabelStyle={{ ...smallFontStyling }} />

            <ChartsTooltip
                trigger="item"
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]:
                        {
                            display: 'inline !important',
                            whiteSpace: 'pre !important',
                        },
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]:
                        {
                            ...mediumFontStyling,
                            color: 'var(--color-txt-header)',
                        },
                }}
            />
        </ChartContainer>
    )
}
