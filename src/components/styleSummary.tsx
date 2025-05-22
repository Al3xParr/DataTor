import { Log } from "../../resources/types";
import { GradeConverter } from "../../resources/utils";


interface StyleSummaryProps {
    title: string,
    logs: Log[]
}

export default function StyleSummary({title, logs} : StyleSummaryProps){
    const gradeConverter = new GradeConverter()
    const total = logs.length
    const flash = logs.filter((l) => l.style == "Flash").sort((a, b) => gradeConverter.compareBoulderGrade(a.grade, b.grade))
    const onsight = logs.filter((l) => l.style == "Onsight")

    return(
        <div className="rounded border m-4">
            <div>{title}</div>
            <div>{total} climbs sent</div>
            <div>{flash.length} climbs flashed</div>
            <div>Your hardest flash - {flash.pop()?.name} {flash.pop()?.grade}</div>
            <div>{onsight?.length} climbs onsighted</div>
        </div>
    )

}