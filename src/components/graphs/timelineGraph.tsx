import { ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, ChartsLegend, ChartDataProvider, ChartsSurface, legendClasses, HighlightScope, HighlightItemData, chartsTooltipClasses} from "@mui/x-charts";
import { lineElementClasses, LineHighlightPlot, LinePlot, markElementClasses } from "@mui/x-charts/LineChart";
import React, { useState } from "react";
import { rainbowSurgePalette } from "@mui/x-charts";
import { globalColours, mediumFontStyling, smallFontStyling } from "../../../resources/utils";
import { ChartsOverlay } from "@mui/x-charts/ChartsOverlay";

interface TimelineGraphProps {
    data: { [key: string]: Date | number }[],
    presentGrades: string[]
}

export default function TimelineGraph({ data, presentGrades }: TimelineGraphProps) {

    const [highlightedItem, setHighlightedItem] = useState<HighlightItemData | null>(null)
    const [showColours, setShowColours] = useState<string[]>(globalColours)

    function highlightSeries(index: number) {
        if (index == -1) {
            setShowColours(globalColours)
        } else {
            const highlightColours = Array(presentGrades.length).fill("#6b7280")
            highlightColours[index] = "#fc1e98"
            setShowColours(highlightColours)
        }
    }

    return (
        <ChartDataProvider
            dataset={data}
            colors={rainbowSurgePalette}

            series={presentGrades.map((grade, index) => ({
                id: grade,
                dataKey: grade,
                label: grade,
                type: "line",
                showMark: false,
                curve: "stepAfter",
                labelMarkType: "circle",
                highlightScope: { highlight: "item", fade: "global" } as HighlightScope,
                color: showColours[index % showColours.length]

            }))}

            onHighlightChange={(highlightedItem) => {
                highlightSeries(presentGrades.indexOf(highlightedItem?.seriesId.toString() ?? ""))
            }
            }

            highlightedItem={highlightedItem}

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

            yAxis={[{
                width: 45
            }]}

            margin={{ top: 20 }}
        >

            <ChartsSurface
                sx={{
                    [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
                        strokeWidth: 3,
                    },
                }}
            >

                <ChartsGrid horizontal />
                <LinePlot />
                <ChartsXAxis tickLabelStyle={{ ...smallFontStyling }} />
                <ChartsYAxis tickLabelStyle={{ ...smallFontStyling }} />
                <LineHighlightPlot />
                <ChartsOverlay />
                <LinePlot />
                <ChartsTooltip
                    trigger="axis"
                    sx={{
                        [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {

                            ...mediumFontStyling,
                        },
                    }}
                />

            </ChartsSurface>

            <ChartsLegend

                onItemClick={(_, legendItem, index) => {
                    if (legendItem.seriesId == highlightedItem?.seriesId) {
                        setHighlightedItem(null)
                        highlightSeries(-1)
                    }
                    else {
                        setHighlightedItem({ seriesId: legendItem.seriesId })
                        highlightSeries(index)
                    }

                }}

                sx={{
                    flexWrap: "wrap",
                    overflow: "auto",


                    "& .MuiChartsLegend-series": {
                        borderRadius: "1.25rem ",
                        padding: "0.313rem !important",

                    },
                    "& .MuiChartsLegend-series:hover": {
                        backgroundColor: "#e5e7eb !important",

                    },

                    [`.${legendClasses.mark}`]: {
                        height: 15,
                        width: 15,
                    },

                    ...mediumFontStyling
                }}
            />

        </ChartDataProvider>
    )

}
