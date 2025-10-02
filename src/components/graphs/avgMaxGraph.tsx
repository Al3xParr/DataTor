import { chartsTooltipClasses, LineChart, lineElementClasses, markElementClasses, MarkElementClasses } from "@mui/x-charts"
import { globalColours, GradeConverter, mediumFontStyling, smallFontStyling } from "../../../resources/utils"
import React from "react"

interface AvgMaxGraphProps {
    data: { "year": number, "avg": number, "max": number }[],
    type: string
}


export default function AvgMaxGraph({ data, type }: AvgMaxGraphProps) {

    const scale: Record<string, "font" | "v" | "french" | "britTrad"> = {
        "Bouldering": "font",
        "Sport": "french",
        "Trad": "britTrad",
    }

    const gradeConverter = new GradeConverter()

    return (

        <LineChart
            dataset={data}

            series={[
                { dataKey: "avg", label: "Average", type: "line", curve: "linear", labelMarkType: "circle", color: globalColours[0], valueFormatter: (v) => gradeConverter.getGradeFromIndex(v ?? 0, scale[type]) },
                { dataKey: "max", label: "Max", type: "line", curve: "linear", labelMarkType: "circle", color: globalColours[1], valueFormatter: (v) => gradeConverter.getGradeFromIndex(v ?? 0, scale[type]) },
            ]}

            xAxis={[{
                dataKey: "year",
                scaleType: "linear",
                tickMinStep: 1,
                min: data[0]?.year,
                max: data[data.length - 1]?.year,
                valueFormatter: (value: number) => value.toString(),
                tickLabelStyle: { ...smallFontStyling },

            }]}

            yAxis={[{
                domainLimit : (minVal, maxVal) => ({ min: minVal-4, max: maxVal + 1}),
                valueFormatter: (value: number) => gradeConverter.getGradeFromIndex(value, scale[type]),
                tickLabelStyle: { ...smallFontStyling }
            }]}

            grid={{ horizontal: true }}
            slotProps={{
                tooltip: {
                    sx: {
                        [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {
                            ...mediumFontStyling,
                        color: "var(--color-title)"
                        },
                    },
                },
                legend: {
                    sx: {
                       ...mediumFontStyling, 
                    }
                }
            }}
            sx={{
                [`& .${lineElementClasses.root}`]: {
                    strokeDasharray: '10 5',
                    strokeWidth: 3,
                },
                [`& .${markElementClasses.root}`]: {
                    fill: "var(--color-bg)",
                },
                
                
            }}
        />

    )
}