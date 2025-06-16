import { ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, ChartsLegend, ChartDataProvider, ChartsSurface, legendClasses, HighlightScope, HighlightItemData, chartsTooltipClasses } from "@mui/x-charts";
import { lineElementClasses, LinePlot, markElementClasses } from "@mui/x-charts/LineChart";
import React, { useState } from "react";
import { rainbowSurgePalette } from "@mui/x-charts";
import { mediumFontStyling, smallFontStyling } from "../../../resources/utils";
import Gradient from "javascript-color-gradient";
import { Card } from "../ui/card";

interface TimelineGraphProps {
    data: { [key: string]: Date | number }[],
    presentGrades: string[]
}

export default function TimelineGraph({ data, presentGrades }: TimelineGraphProps) {

    const [highlightedItem, setHighlightedItem] = useState<HighlightItemData | null>(null)

    const baseColours = new Gradient().setColorGradient("#d9f2da", "#0a595c").setMidpoint(Math.max(presentGrades.length, 2)).getColors()

    const [showColours, setShowColours] = useState<string[]>(baseColours)


    function highlightSeries(index: number) {
        if (index == -1) {
            setShowColours(baseColours)
        } else {
            const highlightColours = Array(presentGrades.length).fill("#6b7280")
            highlightColours[index] = "#fc1e98"
            setShowColours(highlightColours)
        }

    }


    return (
        <Card className="flex flex-col items-start h-full ">
            <h4 className="font-bold shrink">Accumulation of climbs over time</h4>

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
                    color: showColours[index],


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
                    width: 30
                }]}
                margin={{top: 20}}


            >

                <ChartsSurface
                    className=""

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
                    // direction="vertical"
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

        </Card>
        // </div>
    )

}