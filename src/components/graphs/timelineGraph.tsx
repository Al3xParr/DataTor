import { ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, ChartsLegend, ChartDataProvider, ChartsSurface, legendClasses, HighlightScope, HighlightItemData, chartsTooltipClasses } from "@mui/x-charts";
import { lineElementClasses, LinePlot, markElementClasses } from "@mui/x-charts/LineChart";
import React, { useState } from "react";
import { rainbowSurgePalette } from "@mui/x-charts";
import { mediumFontStyling, smallFontStyling } from "../../../resources/utils";
import { Audio } from 'react-loading-icons';

interface TimelineGraphProps {
    data: { [key: string]: Date | number }[],
    presentGrades: string[],
    className?: string
}

export default function TimelineGraph({ data, presentGrades, className = "" }: TimelineGraphProps) {

    const [highlightedItem, setHighlightedItem] = useState<HighlightItemData | null>(null)



    return (
        <div className={`flex ${className}`}>

            <ChartDataProvider
                dataset={data}
                height={600}
                colors={rainbowSurgePalette}

                series={presentGrades.map((grade) => ({
                    dataKey: grade,
                    label: grade,
                    type: "line",
                    showMark: false,
                    curve: "stepAfter",
                    labelMarkType: "circle",
                    highlightScope: { highlight: "item", fade: "global" } as HighlightScope,

                }))}
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

                    onItemClick={(_, legendItem) => {
                        if (legendItem.seriesId == highlightedItem?.seriesId) setHighlightedItem(null)
                        else setHighlightedItem({ seriesId: legendItem.seriesId })
                    }}
                    direction="vertical"
                    sx={{

                        "& .MuiChartsLegend-series": {
                            borderRadius: "20px ",
                            padding: "5px !important",

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

        </div>
    )

}