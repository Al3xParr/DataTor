import { ChartContainer, ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis } from "@mui/x-charts";
import { ChartsLegend, legendClasses } from "@mui/x-charts/ChartsLegend";
import { LinePlot } from "@mui/x-charts/LineChart";


interface TimelineGraphProps {
    data: { [key: string]: Date | number }[],
    presentGrades: string[]
}


const fontStyling = { fontSize: 18, fontWeight: "bold" }


export default function TimelineGraph({ data, presentGrades }: TimelineGraphProps) {
    return (
        <ChartContainer
            height={600}
            dataset={data}


            series={presentGrades.map((grade) => ({
                dataKey: grade,
                label: grade,
                type: "line",
                showMark: false,
                curve: "stepAfter",
                labelMarkType: "circle"
            }))}

            yAxis={[{
                width: 50,
            }]}

            xAxis={[{
                id: "date",
                dataKey: "date",
                scaleType: "time",
                tickMaxStep: 31556952000,
                tickMinStep: 31556952000,
                valueFormatter: (value: number, context) => {
                    return context.location === "tooltip" ?
                        new Date(value).toLocaleDateString()
                        :
                        new Date(value).getFullYear().toString()
                },
            }]}
        >

            <ChartsGrid horizontal />
            <LinePlot />
            <ChartsXAxis tickLabelStyle={{ fontWeight: "bold" }} />
            <ChartsYAxis />
            <ChartsTooltip trigger="axis" />

            <ChartsLegend

                direction="vertical"

                sx={{
                    [`.${legendClasses.mark}`]: {
                        height: 15,
                        width: 15,
                    },
                    ...fontStyling

                }}
            />

        </ChartContainer>
    )

}