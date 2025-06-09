import {  BarPlot, ChartContainer, ChartsTooltip, ChartsXAxis, ChartsYAxis, barLabelClasses, chartsTooltipClasses } from "@mui/x-charts"
import { GradeConverter, mediumFontStyling, smallFontStyling } from "../../../resources/utils"
import Gradient from "javascript-color-gradient"


interface TopClimbsGraphProps {
    data: { [key: string]: number }[],
    presentGrades: string[],
    climbNames: Record<string, string[]>
}



export default function TopClimbsGraph({ data, presentGrades, climbNames }: TopClimbsGraphProps) {

    const gradeConverter = new GradeConverter()
    const colours = new Gradient().setColorGradient("#40ae79", "#2a1f2d").setMidpoint(presentGrades.length).getColors();

    return (
        <ChartContainer
            dataset={data}
            height={450}

            series={presentGrades.sort((a, b) => gradeConverter.compareGrade(a, b)).reverse().map((grade, index) => ({
                id: grade,
                dataKey: grade,
                label: grade,
                type: "bar",
                stack: "total",
                color: colours[index],
                valueFormatter: (v, context) => {
                    const yearGradeString = data[context.dataIndex].year + "-" + grade
                    return climbNames[yearGradeString].join("\n")
                }

            }))}

            xAxis={[{
                dataKey: "year",
                disableTicks: true,
                scaleType: "band",


            }]}
            sx={{
                [`.${barLabelClasses.root}`]: {
                    ...mediumFontStyling
                },
            }}

        >
            <BarPlot
                borderRadius={7}
                barLabel={(item, _) => {
                    if (item.value == 0) return ""
                    return item.seriesId.toString()
                }}

            />
            <ChartsXAxis
                tickLabelStyle={{ ...smallFontStyling }}
            />
            <ChartsYAxis
                tickLabelStyle={{ ...smallFontStyling }}
            />

            <ChartsTooltip
                trigger="item"
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.valueCell}`]: {
                        display: "inline !important",
                        whiteSpace: "pre-line !important"
                    },
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {
                        ...mediumFontStyling,
                    }
                }}

            />

        </ChartContainer>
    )
}