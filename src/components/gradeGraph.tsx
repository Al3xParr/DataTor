import { BarLabelProps, ChartsGrid, ChartsTooltip } from '@mui/x-charts'
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { styled } from '@mui/material/styles';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '@mui/x-charts/hooks';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

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
  fontWeight: "bold",
  fontSize: 15
}));

function BarLabel(props: BarLabelProps) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
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

    function getTotalForGrade(index: number){

        return (data[index]?.send + data[index]?.flash + data[index]?.onsight + 0).toString()
    }

    return (
        <ChartContainer
            dataset={data}
            height={350}

            series={[
                { id:"onsight", dataKey: "onsight", stack: "total", label: "Onsight", color: "#e15759", type: "bar" },
                { id: "flash", dataKey: "flash", stack: "total", label: "Flash", color: "#edc949", type: "bar" },
                { id: "send", dataKey: 'send', stack: "total", label: "Send", color: "#59a14f", type: "bar" }
            ]}
            xAxis={[{
                dataKey: "grade",
                disableTicks: true,
                disableLine: true,
                scaleType: "band",
                tickLabelStyle: { fontSize: 14, fontWeight: "bold" }
            }]}
        >
            <ChartsGrid horizontal />
            <BarPlot
                barLabel={(item) => {
                    return item.seriesId == "send" ? getTotalForGrade(item.dataIndex) : ""
                }}
                borderRadius={7}
                slots={{
                    barLabel: BarLabel                   
                }}
            />
            <ChartsTooltip/>
            <ChartsXAxis />
            

        </ChartContainer>
    )

}