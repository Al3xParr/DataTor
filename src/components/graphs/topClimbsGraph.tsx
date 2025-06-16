import { BarPlot, ChartContainer, ChartsTooltip, ChartsXAxis, ChartsYAxis, barLabelClasses, chartsTooltipClasses } from "@mui/x-charts"
import { GradeConverter, mediumFontStyling, smallFontStyling } from "../../../resources/utils"
import Gradient from "javascript-color-gradient"
import React from "react";
import { Card } from "../ui/card";

interface TopClimbsGraphProps {
    data: { [key: string]: number }[],
    presentGrades: string[],
    climbNames: Record<string, string[]>
}



export default function TopClimbsGraph({ data, presentGrades, climbNames}: TopClimbsGraphProps) {

    const gradeConverter = new GradeConverter()
    const colours = new Gradient().setColorGradient("#d9f2da", "#0a595c").setMidpoint(Math.max(presentGrades.length, 2)).getColors();

    return (
        <Card className="flex flex-col items-start h-full ">

            <h4 className="font-bold shrink">Top 10 hardest climbs per year</h4>
            <ChartContainer
                className={"h-max"}
                dataset={data}

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
                    },

                }))}

                xAxis={[{
                    dataKey: "year",
                    disableTicks: true,
                    scaleType: "band",


                }]}
                yAxis={[{
                    width: 20
                }]}

                margin={{ top: 10 }}

                sx={{
                    [`.${barLabelClasses.root}`]: {
                        ...mediumFontStyling
                    }
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
        </Card>
    )
}