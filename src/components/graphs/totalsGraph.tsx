import { PieChart, PieValueType, useDrawingArea } from "@mui/x-charts";
import { TotalsData } from "../../../resources/serverUtils";
import { globalColours } from "../../../resources/utils";
import { styled } from '@mui/material/styles';

interface TotalsGraphProps {
    data: TotalsData
}

const StyledText = styled('text')(({ theme }) => ({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 40,
    fontWeight: 700,
    fill: "var(--color-txt)"
}));

const StyledTextSub = styled('text')(({ theme }) => ({
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 16,
    fontWeight: 400,
    fill: "var(--color-txt-muted)"
}));

interface PieCenterProps {
    total: number
}

function PieCenterLabel({ total }: PieCenterProps) {
    const { width, height, left, top } = useDrawingArea();
    const x = left + width / 2
    const y = top + height / 2 - 7
    return (
        <>
            <StyledText x={x} y={y}>
                {total}
            </StyledText>
            <StyledTextSub x={x} y={y + 30}>
                Total Logs
            </StyledTextSub>
        </>
    );
}

export default function TotalsGraph({ data }: TotalsGraphProps) {

    return (

        <PieChart
        height={200}
        width={200}
            
            colors={globalColours}
            series={[
                {
                    data: data.individual.map((d, i) => ({ id: i, value: d.freq, label: d.name })),

                    innerRadius: 70,
                    outerRadius: 100
                },

            ]}
            // sx={{: "#000000"}}
            hideLegend

        >
            <PieCenterLabel total={data.total}>

            </PieCenterLabel>
        </PieChart>



    )
}