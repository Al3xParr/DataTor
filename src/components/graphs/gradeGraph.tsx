import { BarLabelProps, ChartsGrid, ChartsTooltip, chartsTooltipClasses } from '@mui/x-charts'
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { mediumFontStyling, smallFontStyling } from '../../../resources/utils';
import React from "react";
import { Card } from '../ui/card';

interface GradeGraphProps {
    data: {
        "grade": string,
        "send": number,
        "flash": number,
        "onsight": number
    }[]
}

const Text = styled('text')(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: 'none',
    fill: (theme.vars || theme)?.palette?.text?.primary,
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    pointerEvents: 'none',
    fontWeight: 600,
    fontFamily: "Nunito",
    fontSize: 14
}));

function BarLabel(props: BarLabelProps) {
    const {
        color,
        yOrigin,
        x,
        y,
        width,
        skipAnimation,
        ...otherProps
    } = props;

    const animatedProps = useAnimate(
        { x: x + width / 2, y: y - 12 },
        {
            initialProps: { x: x + width / 2, y: yOrigin },
            createInterpolator: interpolateObject,
            transformProps: (p) => p,
            applyProps: (element: SVGTextElement, p) => {
                element.setAttribute('x', p.x.toString());
                element.setAttribute('y', p.y.toString());
            },
            skip: skipAnimation,
        },
    );

    return (
        <Text  {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
    );
}

export default function GradeGraph({ data }: GradeGraphProps) {

    function getTotalForGrade(index: number, seriesId: string) {
        const total = (data[index]?.send + data[index]?.flash + data[index]?.onsight + 0).toString()
        if (seriesId == "flash" && data[index]?.send == 0 && data[index]?.flash != 0) return total
        if (seriesId == "onsight" && data[index]?.send == 0 && data[index]?.flash == 0 && data[index]?.onsight != 0) return total
        if (seriesId == "send" && data[index]?.send != 0) return total
        return ""
    }


    return (
        <ChartContainer
            dataset={data}

            series={[
                { id: "onsight", dataKey: "onsight", stack: "total", label: "Onsight", color: "#E5BEED", type: "bar" },
                { id: "flash", dataKey: "flash", stack: "total", label: "Flash", color: "#F39B6D", type: "bar" },
                { id: "send", dataKey: 'send', stack: "total", label: "Send", color: "#40ae79", type: "bar" }
            ]}
            xAxis={[{
                dataKey: "grade",
                disableTicks: true,
                disableLine: true,
                scaleType: "band",
                height: 25
            }]}
            yAxis={[{
                width: 0
            }]}
            margin={{ top: 30 }}

        >
            <ChartsGrid horizontal />
            <BarPlot

                barLabel={(item) => getTotalForGrade(item.dataIndex, item.seriesId.toString())}
                borderRadius={7}
                slots={{
                    barLabel: BarLabel
                }}

            />
            <ChartsTooltip
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {
                        ...mediumFontStyling,
                    },
                }}
            />
            <ChartsXAxis

                tickLabelStyle={{ ...smallFontStyling }}

                sx={{
                    "& .MuiChartsXAxis-tickContainer": {
                        height: "5.625rem !important"
                    },
                }}
            />
        </ChartContainer>

    )

}