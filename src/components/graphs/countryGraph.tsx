import {
    BarPlot,
    ChartContainer,
    ChartsGrid,
    ChartsTooltip,
    chartsTooltipClasses,
    ChartsXAxis,
    ChartsYAxis,
} from '@mui/x-charts'
import { CountryData } from '../../../resources/serverUtils'
import {
    globalColours,
    mediumFontStyling,
    smallFontStyling,
} from '../../../resources/utils'
import React, { useEffect } from 'react'

interface CountryGraphProps {
    data: CountryData
}

export default function CountryGraph({ data }: CountryGraphProps) {
    if (data.countries.length == 0) return

    return (
        <ChartContainer
            series={[
                {
                    data: data.count,
                    type: 'bar',
                    color: globalColours[3],
                    layout: 'horizontal',
                },
            ]}
            yAxis={[
                {
                    data: data.countries,
                    scaleType: 'band',
                    tickLabelStyle: { ...smallFontStyling },
                    width: 80,
                    valueFormatter: (value) => value,
                },
            ]}
            xAxis={[
                {
                    tickLabelStyle: { ...smallFontStyling },
                },
            ]}
        >
            <ChartsGrid vertical />
            <BarPlot borderRadius={7} />
            <ChartsTooltip
                trigger="axis"
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]:
                        {
                            ...mediumFontStyling,
                            color: 'var(--color-title)',
                        },
                }}
            />
            <ChartsXAxis />
            <ChartsYAxis disableTicks />
        </ChartContainer>
    )
}
