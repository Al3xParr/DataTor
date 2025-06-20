'use client'
import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import tinygradient from "tinygradient";
import { Card } from "../ui/card";
import { CountyData } from "../../../resources/serverUtils";
import { BarPlot, ChartContainer, ChartsXAxis } from "@mui/x-charts";
import { smallFontStyling } from "../../../resources/utils";


const geoUrl = require("../../../resources/counties-simple.json")


interface CountyMapProps {
    data: Record<string, CountyData>
}

export default function CountyMap({ data }: CountyMapProps) {

    const grad = tinygradient(["#aef5d3", "#0e251a"])
    const max = Object.values(data).map((c) => c.freq).sort((a, b) => a - b).findLast(() => true) ?? 2
    const colours = grad.rgb(max)
    const [defaultCounty, setDefaultCounty] = useState("")
    const [county, setCounty] = useState("")

    function getColour(freq: number) {
        return freq == 0 ? "#e5e7eb" : colours[freq - 1]
    }

    function getAxisList(countyData: CountyData) {
        if (countyData.minGrade == countyData.maxGrade) return [countyData.minGrade]
        return [countyData.minGrade]
            .concat(new Array(countyData.gradeDistribution.length - 2).fill("0").map((_, i) => (i + 1).toString()))
            .concat([countyData.maxGrade])
    }

    return (
        <>
            {county != "" ?
                <Card className="bg-gray-200 absolute top-20 right-8 flex flex-col p-0 items-start">
                    <p className={`bg-tertiary w-full overflow-clip ${data[county] == null? "rounded-xl" : "rounded-t-xl"} px-3 py-1 font-bold`}>{county}</p>

                    {data[county] != null ?
                        <div className="p-3 flex flex-col items-start text-sm">

                            <div className="flex"><div className="font-bold ">{data[county]?.freq ?? 0}</div>&nbsp;ascents</div>
                            {data[county]?.topClimbs.map((topClimb) => {
                                
                                return (
                                    <div key={topClimb} className="flex">
                                        <div className="font-bold">{topClimb.split("/-")[0]}</div>
                                        &nbsp;{topClimb.split("/-")[1]}
                                    </div>
                                )
                            })}
                            <div className="w-full h-32 ">
                                <ChartContainer

                                    series={[{ data: data[county].gradeDistribution, label: "g", type: "bar", color: "#00778f" }]}
                                    xAxis={[{ 
                                        scaleType: "band", 
                                        disableLine: true, 
                                        disableTicks: true, 
                                        data: getAxisList(data[county]),
                                        valueFormatter(value) {
                                            if (Number(value)) return ""
                                            return value
                                        },
                                        height: 25,
                                        tickLabelStyle: {
                                            overflow: "visible",
                                            ...smallFontStyling
                                        },       
                                        sx: {overflow: "visisble"}                  
                                    }]}
                                    margin={{top: 10, left: 10, right: 10, bottom: 0}}
                                    yAxis={[{width: 0}]}
                                >
                                    <BarPlot borderRadius={7}/>
                                    <ChartsXAxis/>

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
                projectionConfig={{
                    scale: 6000,
                    center: [-3.2, 54],
                }}
            >
                <ZoomableGroup >
                    <Geographies
                        geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const name = geo.properties.UTLA22NM
                                const freq = data[name]?.freq ?? 0
                                const colour = getColour(freq)
                                return (
                                    <Geography
                                        onClick={() => { setCounty(name), setDefaultCounty(name) }}
                                        onMouseEnter={() => setCounty(name)}
                                        onMouseLeave={() => setCounty(defaultCounty)}

                                        key={geo.rsmKey}
                                        geography={geo}

                                        style={{
                                            default: { fill: colour, stroke: "black", strokeWidth: defaultCounty == name ? 1 : 0.2, outline: "none" },
                                            pressed: { fill: colour, stroke: "black", strokeWidth: 1, outline: "none" },
                                            hover: { fill: colour, stroke: "black", strokeWidth: 1, outline: "none" }
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