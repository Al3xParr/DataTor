'use client'
import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import tinygradient from "tinygradient";
import { Card } from "../ui/card";
import { AreaData } from "../../../resources/serverUtils";
import { BarPlot, ChartContainer, ChartsXAxis } from "@mui/x-charts";
import { smallFontStyling } from "../../../resources/utils";
import { Badge } from "../ui/badge";


const geoUrl = require("../../../resources/uk_and_world.json")


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
            {area != "" ?
                <Card className="bg-gray-200 w-[20rem] absolute top-20 right-8 flex flex-col p-0 items-start overflow-hidden">
                    <p className={`bg-tertiary text-gray-200 w-full ${data[area] == null ? "rounded-xl" : "rounded-t-xl"} px-3 py-1 font-bold`}>{area}</p>

                    {data[area] != null ?
                        <div className="p-3 flex flex-col items-start text-sm">

                            <div className="flex"><div className="font-bold ">{data[area]?.freq ?? 0}</div>&nbsp;Ascents</div>
                            <div className="mt-5">Top Climbs</div>
                            <div className="flex w-full justify-around mb-5">
                                {data[area]?.topClimbs.map((topClimb) => {
                                    return (
                                        <div key={topClimb} className="basis-1 grow-1 flex flex-col items-center pt-1 mx-1 overflow-clip">
                                            <Badge text={topClimb.split("/-")[0]} colour="tertiary-gray" />
                                            <div className="w-fit font-bold mt-1">{topClimb.split("/-")[1]}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="w-full h-32 ">
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
            <ComposableMap
                className="h-full w-full"
                projection={"geoMercator"}
            >
                <ZoomableGroup 
                zoom={6}
                maxZoom={ 500}
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
                                        onClick={() => { setArea(name), setDefaultArea(name) }}
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
        </>
    )
}