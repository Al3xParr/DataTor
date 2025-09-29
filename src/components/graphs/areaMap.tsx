'use client'
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import tinygradient from "tinygradient";
import { Card } from "../ui/card";
import { AreaData } from "../../../resources/serverUtils";
import { BarPlot, ChartContainer, ChartsXAxis } from "@mui/x-charts";
import { smallFontStyling } from "../../../resources/utils";
import { Badge } from "../ui/badge";
import geoUrl from "../../../resources/uk_and_world.json";


interface AreaMapProps {
    data: Record<string, AreaData>
}

export default function AreaMap({ data }: AreaMapProps) {

    const grad = tinygradient(["#aef5d3", "#0e251a"])
    const max = Object.values(data).map((c) => c.freq).sort((a, b) => a - b).findLast(() => true) ?? 2
    const colours = grad.rgb(max)
    const [defaultArea, setDefaultArea] = useState("")
    const [area, setArea] = useState("")

    function getColour(freq: number) {
        return freq == 0 ? "#e5e7eb" : colours[freq - 1]
    }

    function getAxisList(areaData: AreaData) {
        if (areaData.minGrade == areaData.maxGrade) return [areaData.minGrade]
        return [areaData.minGrade]
            .concat(new Array(areaData.gradeDistribution.length - 2).fill("0").map((_, i) => (i + 1).toString()))
            .concat([areaData.maxGrade])
    }

    return (
        <>

            <ComposableMap
                className="md:h-full h-[28rem] w-full"
                projection={"geoMercator"}
            >
                <ZoomableGroup
                    zoom={6}
                    maxZoom={500}
                    center={[0, 45]}
                >
                    <Geographies

                        geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const name = geo.properties.UTLA22NM ? geo.properties.UTLA22NM : geo.properties.cntry_name ?? ""
                                const freq = data[name]?.freq ?? 0
                                const colour = getColour(freq)
                                return (
                                    <Geography
                                        onClick={() => { setArea(name); setDefaultArea(name) }}
                                        onMouseEnter={() => setArea(name)}
                                        onMouseLeave={() => setArea(defaultArea)}

                                        key={geo.rsmKey}
                                        geography={geo}

                                        style={{
                                            default: { fill: colour, stroke: "black", strokeWidth: defaultArea == name ? 0.1 : 0.03, outline: "none" },
                                            pressed: { fill: colour, stroke: "black", strokeWidth: 0.1, outline: "none" },
                                            hover: { fill: colour, stroke: "black", strokeWidth: 0.1, outline: "none" }
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {area != "" ?
                <Card className="bg-bg-light not-md:w-full not-md:h-[13.5rem] md:w-[20rem] md:absolute md:top-17 md:right-4 flex flex-col p-0 items-start overflow-hidden not-md:rounded-none ">
                    <p className={`bg-tertiary text-bg-light w-full px-3 py-1 font-bold`}>{area}</p>

                    {data[area] != null ?
                        <div className="p-4 grid not-md:h-full not-md:max-h-full not-md:w-full not-md:overflow-clip md:grid-cols-1 md:grid-rows-2 not-md:grid-cols-2 not-md:grid-rows-1 items-start text-sm">
                            <div className="not-md:h-full">
                                <div className="flex md:col-span-2">
                                    <div className="font-bold ">{data[area]?.freq ?? 0}</div>
                                    &nbsp;Ascents
                                </div>

                                <div className="mt-5">Top Climbs</div>
                                <div className="flex flex-col md:flex-row md:w-full justify-around mb-5">
                                    {data[area]?.topClimbs.map((topClimb) => {
                                        return (
                                            <div key={topClimb} className="md:basis-1 md:grow-1 flex md:flex-col items-center pt-1 mx-1 overflow-clip">
                                                <Badge text={topClimb.split("/-")[0]} colour="light-text" />
                                                <div className="w-fit font-bold mt-1 not-md:line-clamp-1 pl-1 md:pl-0 text-left md:text-center">{topClimb.split("/-")[1]}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="md:w-full md:h-32 not-md:h-fit md:shrink">
                                <ChartContainer

                                    series={[{ data: data[area].gradeDistribution, label: "g", type: "bar", color: "#00778f" }]}
                                    xAxis={[{
                                        scaleType: "band",
                                        disableLine: true,
                                        disableTicks: true,
                                        data: getAxisList(data[area]),
                                        valueFormatter(value) {
                                            if (Number(value)) return ""
                                            return value
                                        },
                                        height: 25,
                                        tickLabelStyle: {
                                            overflow: "visible",
                                            ...smallFontStyling
                                        },
                                        sx: { overflow: "visisble" }
                                    }]}
                                    margin={{ top: 10, left: 10, right: 10, bottom: 0 }}
                                    yAxis={[{ width: 0 }]}
                                >
                                    <BarPlot borderRadius={7} />
                                    <ChartsXAxis />

                                </ChartContainer>

                            </div>
                        </div>
                        :
                        <></>
                    }
                </Card>
                :
                <></>
            }
        </>
    )
}