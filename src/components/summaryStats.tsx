import { Log, Logbook } from "../../resources/types"
import { getTotalClimbs } from "../../resources/utils"


interface SummaryStatsProps {
    logbook: Logbook
}


export default function SummaryStats({logbook} : SummaryStatsProps){

    

    return(
        <div className="border rounded">
            <div>{getTotalClimbs(logbook)} climbs in your logbook</div>
            <div>{logbook.boulder.length} boulders in your logbook</div>
            <div>{logbook.sport.length} sport routesd in your logbook</div>
            <div>{logbook.trad.length} trad routes in your logbook</div>
            <div>{logbook.winter.length} winter routes in your logbook</div>
        </div>
    )
}