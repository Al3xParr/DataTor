import { GradeConverter } from "./utils"

export type Logbook = {
    boulder: Log[],
    sport: Log[],
    trad: Log[],
    winter: Log[]
}


export type Log = {
    id: number,
    name: string,
    date: Date,
    style: string,  //flash onsight etc
    grade: string,
    stars: number,
    type: string, //bouldering sport
    notes: string,
    crag: string,
    county: string,
    region: string,
    pitches: number,
    partner: string,
    country: string
}


// export interface LogbookStats {
//     firstDate: Date,
//     presentGrades: 
// }


export class LogBook {
    logs: Log[]
    presentGrades: string[] = []
    presentYears: number[] = []
    totalClimbs = new Map()




    constructor(logs: Log[] = []) {
        this.logs = logs.sort((a, b) => this.gradeConverter.compareGrade(a.grade, b.grade))
        this.totalClimbs = new Map([["Total", 0],
                                    ["Bouldering", 0],
                                    ["Sport", 0,],
                                    ["Trad", 0,],
                                    ["Winter", 0]
                                    ]);

        this.logs.forEach((climb) => {

            if (!this.presentGrades.includes(climb.grade)) this.presentGrades.push(climb.grade)
            const climbYear = climb.date.getFullYear()
            if (!this.presentYears.includes(climbYear)) this.presentYears.push(climbYear)

            this.totalClimbs.set("Total", this.totalClimbs.get("Total") + 1)
            //this.totalClimbs.set(climb., this.totalClimbs.get("total") + 1)

        })
    }

    gradeConverter = new GradeConverter()

    public getClimbs(sortBy: "name" | "grade" = "name",
        style: "flash" | "onsight" | "repeat" | "dogged" | "dnf" | "redpoint" | "sent" | "groundup" | "all" = "all",
        type: "boulder" | "sport" | "trad" | "all" = "all"): Log[] {

        const rtnLogs = this.logs.filter((climb) => {
            (style == "all" || climb.style.toLowerCase() == style) && (type == "all" || climb.type.toLowerCase() == type)
        })
        switch (sortBy) {
            case "name": return rtnLogs.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
            case "grade": return rtnLogs.sort((a, b) => this.gradeConverter.compareGrade(a.grade, b.grade))
        }

    }




}
