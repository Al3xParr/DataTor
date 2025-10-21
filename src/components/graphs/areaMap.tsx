'use client'
import React, { useEffect, useState } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps'
import tinygradient from 'tinygradient'
import { Card } from '../ui/card'
import { AreaData } from '../../../resources/serverUtils'
import { BarPlot, ChartContainer, ChartsXAxis } from '@mui/x-charts'
import { smallFontStyling } from '../../../resources/utils'
import { Badge } from '../ui/badge'
import geoUrl from '../../../resources/uk_and_world.json'

interface AreaMapProps {
    data: Record<string, AreaData>
}

const GREENLIGHT = '#aef5d3'
const GREENDARK = '#0e251a'

export default function AreaMap({ data }: AreaMapProps) {
    let lowCol = GREENLIGHT
    let highCol = GREENDARK

    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        lowCol = GREENDARK
        highCol = GREENLIGHT
    }

    const [colours, setColours] = useState([] as string[])

    function calculateColours() {
        const grad = tinygradient([lowCol, highCol])
        const max = Math.max(
            Object.values(data)
                .map((c) => c.freq)
                .sort((a, b) => a - b)
                .findLast(() => true) ?? 2,
            2
        )
        setColours(grad.rgb(max))
    }

    useEffect(() => {
        calculateColours()
    }, [data])

    const [defaultArea, setDefaultArea] = useState('')
    const [area, setArea] = useState('')

    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (event) => {
            if (event.matches) {
                lowCol = GREENDARK
                highCol = GREENLIGHT
            } else {
                lowCol = GREENLIGHT
                highCol = GREENDARK
            }

            calculateColours()
        })

    function getColour(freq: number) {
        return freq == 0 ? 'var(--color-bg-light)' : colours[freq - 1]
    }

    function getAxisList(areaData: AreaData) {
        if (areaData.minGrade == areaData.maxGrade) return [areaData.minGrade]
        return [areaData.minGrade]
            .concat(
                new Array(areaData.gradeDistribution.length - 2)
                    .fill('0')
                    .map((_, i) => (i + 1).toString())
            )
            .concat([areaData.maxGrade])
    }

    return (
        <>
            <ComposableMap className="h-full w-full" projection={'geoMercator'}>
                <ZoomableGroup zoom={6} maxZoom={500} center={[0, 45]}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const name = geo.properties.UTLA22NM
                                    ? geo.properties.UTLA22NM
                                    : (geo.properties.cntry_name ?? '')
                                const freq = data[name]?.freq ?? 0
                                const colour = getColour(freq)
                                return (
                                    <Geography
                                        onClick={() => {
                                            setArea(name)
                                            setDefaultArea(name)
                                        }}
                                        onMouseEnter={() => setArea(name)}
                                        onMouseLeave={() =>
                                            setArea(defaultArea)
                                        }
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: {
                                                fill: colour,
                                                stroke: 'black',
                                                strokeWidth:
                                                    defaultArea == name
                                                        ? 0.1
                                                        : 0.03,
                                                outline: 'none',
                                            },
                                            pressed: {
                                                fill: colour,
                                                stroke: 'black',
                                                strokeWidth: 0.1,
                                                outline: 'none',
                                            },
                                            hover: {
                                                fill: colour,
                                                stroke: 'black',
                                                strokeWidth: 0.1,
                                                outline: 'none',
                                            },
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {area != '' ? (
                <Card className="bg-bg-light absolute bottom-0 flex h-max w-full flex-col items-start overflow-hidden p-0 max-lg:h-min max-lg:rounded-none lg:top-17 lg:right-4 lg:w-[20rem]">
                    <p
                        className={`bg-tertiary text-bg-light w-full px-3 py-1 font-bold`}
                    >
                        {area}
                    </p>
                    {data[area] != null ? (
                        <div className="grid h-full w-full grid-cols-2 grid-rows-1 items-start overflow-clip p-4 text-sm lg:grid-cols-1 lg:grid-rows-2">
                            <div className="h-full">
                                <div className="flex lg:col-span-2">
                                    <div className="self-baseline-last pr-1 text-base font-bold">
                                        {data[area]?.freq ?? 0}
                                    </div>
                                    <div className="self-baseline-last">
                                        Ascents
                                    </div>
                                </div>

                                <div className="mt-5">Top Climbs</div>
                                <div className="mb-5 flex flex-col justify-around lg:w-full lg:flex-row">
                                    {data[area]?.topClimbs.map(
                                        (topClimb, index) => {
                                            return (
                                                <div
                                                    key={
                                                        topClimb +
                                                        index.toString()
                                                    }
                                                    className="mx-1 flex items-center overflow-clip pt-1 lg:grow-1 lg:basis-1 lg:flex-col"
                                                >
                                                    <Badge
                                                        text={
                                                            topClimb.split(
                                                                '/-'
                                                            )[0]
                                                        }
                                                        colour="light-text"
                                                    />
                                                    <div className="mt-1 line-clamp-1 w-fit pl-1 text-left font-bold lg:pl-0 lg:text-center">
                                                        {
                                                            topClimb.split(
                                                                '/-'
                                                            )[1]
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="flex h-42 items-center lg:h-32 lg:w-full lg:shrink">
                                <ChartContainer
                                    series={[
                                        {
                                            data: data[area].gradeDistribution,
                                            label: 'g',
                                            type: 'bar',
                                            color: '#00778f',
                                        },
                                    ]}
                                    xAxis={[
                                        {
                                            scaleType: 'band',
                                            disableLine: true,
                                            disableTicks: true,
                                            data: getAxisList(data[area]),
                                            height: 25,
                                            tickLabelInterval(value, index) {
                                                return (
                                                    index == 0 ||
                                                    index ==
                                                        data[area]
                                                            .gradeDistribution
                                                            .length -
                                                            1
                                                )
                                            },
                                            tickLabelStyle: {
                                                overflow: 'visible',
                                                ...smallFontStyling,
                                            },
                                            sx: { overflow: 'visisble' },
                                        },
                                    ]}
                                    margin={{
                                        top: 5,
                                        left: 10,
                                        right: 10,
                                        bottom: 0,
                                    }}
                                    yAxis={[{ width: 0 }]}
                                >
                                    <BarPlot borderRadius={7} />
                                    <ChartsXAxis />
                                </ChartContainer>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </Card>
            ) : (
                <></>
            )}
        </>
    )
}
