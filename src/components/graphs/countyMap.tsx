'use client'
import { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import tinygradient from "tinygradient";
import { Card } from "../ui/card";


const geoUrl = require("../../../resources/counties-simple.json")

interface CountyMapProps {
    data: Record<string, number>
}

export default function CountyMap({ data }: CountyMapProps) {


    const grad = tinygradient(["#aef5d3", "#0e251a"])
    const max = Object.values(data).sort((a, b) => a - b).findLast(() => true) ?? 2
    const colours = grad.rgb(max)
    const [defaultCounty, setDefaultCounty] = useState("")
    const [county, setCounty] = useState("")

    function getColour(freq: number) {
        return freq == 0 ? "#e5e7eb" : colours[freq - 1]
    }

    return (
        <>
            {county != "" ?
                <Card className="bg-gray-200  absolute top-10 right-8 px-3 py-1">
                    {county} - {data[county] ?? 0} ascents
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
                                const freq = data[name] ?? 0
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