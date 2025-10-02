import { BarLabelProps, ChartsGrid, ChartsTooltip, chartsTooltipClasses } from '@mui/x-charts'
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { mediumFontStyling, smallFontStyling } from '../../../resources/utils';
import React from "react";
import { GradeGraphData } from '../../../resources/types';

interface GradeGraphProps {
    data: GradeGraphData[]
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

        const gradeData = data[index] || {}

        const total = (gradeData.send + gradeData.flash + gradeData.onsight + gradeData.groundup + gradeData.repeat + 0).toString()

        switch (seriesId) {
            case "repeat": return total
            case "send": if (gradeData.repeat == 0) return total
            case "groundup": if (gradeData.send + gradeData.repeat == 0) return total
            case "flash": if (gradeData.groundup + gradeData.send + gradeData.repeat == 0) return total
            case "onsight": if (gradeData.flash + gradeData.groundup + gradeData.send + gradeData.repeat == 0) return total
            default: return ""
        }
    }


    return (
        <ChartContainer
            dataset={data as any[]}

            series={[
                { id: "onsight", dataKey: "onsight", stack: "total", label: "Onsight", color: "#E5BEED", type: "bar" },
                { id: "flash", dataKey: "flash", stack: "total", label: "Flash", color: "#F39B6D", type: "bar" },
                { id: "groundup", dataKey: "groundup", stack: "total", label: "Ground Up", color: "#007991", type: "bar" },
                { id: "send", dataKey: 'send', stack: "total", label: "Send", color: "#40ae79", type: "bar" },
                { id: "repeat", dataKey: 'repeat', stack: "total", label: "Repeat", color: "#222E50", type: "bar" }
            ]}
            xAxis={[{
                dataKey: "grade",
                disableTicks: true,
                disableLine: true,
                scaleType: "band",
                height: 25,
            }]}
            yAxis={[{
                width: 0
            }]}
            margin={{ top: 30 }}

        >
            <ChartsGrid horizontal />
            <BarPlot

                barLabel={(item, context) =>  context.bar.height != 0 ? getTotalForGrade(item.dataIndex, item.seriesId.toString()) : ""}
                borderRadius={7}
                slots={{
                    barLabel: BarLabel
                }}

                slotProps={{
                    barLabel: {

                        style: { fill: "var(--color-txt)" }
                    }
                }}

            />
            <ChartsTooltip
                sx={{
                    [`&.${chartsTooltipClasses.root} .${chartsTooltipClasses.cell}`]: {
                        ...mediumFontStyling,
                        color: "var(--color-title)"
                    },
                }}
            />
            <ChartsXAxis

                tickLabelStyle={{ ...smallFontStyling }}

                sx={{
                    "& .MuiChartsXAxis-tickContainer": {
                        height: "5.625rem !important",

                    },
                }}
            />
        </ChartContainer>

    )

}