import { BarPlot, ChartContainer, ChartsGrid, ChartsTooltip, chartsTooltipClasses, ChartsXAxis, ChartsYAxis } from "@mui/x-charts";
import { CountryData } from "../../../resources/serverUtils";
import { globalColours, mediumFontStyling, smallFontStyling } from "../../../resources/utils";
import React from "react"


interface CountryGraphProps {
    data: CountryData
}


export default function CountryGraph({ data }: CountryGraphProps) {
    return (

        <ChartContainer
            series={[{

                data: data.count,
                type: "bar",
                color: globalColours[3],
                layout: "horizontal"
            }]}


            yAxis={[{
                data: data.countries,
                scaleType: "band",
                tickLabelStyle: { ...smallFontStyling },
                width: 80,
                valueFormatter: (value) => value
            }]}

            xAxis={[{
                tickLabelStyle: { ...smallFontStyling }
            }]}


        >
            <ChartsGrid vertical />
            <BarPlot />
            <ChartsTooltip
                trigger="axis"
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {
                        ...mediumFontStyling,
                    },
                }}
            />
            <ChartsXAxis />
            <ChartsYAxis disableTicks />

        </ChartContainer>


    )
}