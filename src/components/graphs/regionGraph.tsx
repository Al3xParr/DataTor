import { BarPlot, ChartContainer, ChartsTooltip, chartsTooltipClasses, ChartsXAxis, ChartsYAxis } from "@mui/x-charts";
import { RegionData } from "../../../resources/serverUtils";
import { globalColours, mediumFontStyling, smallFontStyling } from "../../../resources/utils";


interface PartnerGraphProps {
    data: RegionData
}


export default function RegionGraph({ data }: PartnerGraphProps) {
    return (

        <ChartContainer
            series={[{

                data: data.count,
                type: "bar",
                color: globalColours[3],
                layout: "horizontal"
            }]}

            yAxis={[{
                data: data.regions,
                scaleType: "band",
                tickLabelStyle: { ...smallFontStyling },
                width: 120,
                valueFormatter: (value) => value
            }]}

            xAxis={[{
                tickLabelStyle: { ...smallFontStyling }
            }]}
        >
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