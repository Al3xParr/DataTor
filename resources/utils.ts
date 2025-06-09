import { Log } from "./types";


export class GradeConverter {

    font = ["f3", "f3+", "f4", "f4+", "f5", "f5+", "f6A", "f6A+", "f6B", "f6B+", "f6C", "f6C+", "f7A", "f7A+", "f7B", "f7B+", "f7C", "f7C+", "f8A", "f8A+", "f8B", "f8B+", "f8C", "f8C+", "f9A"]
    v = ["VB", "V0-", "V0", "V0+", "V1", "V2", "V3", "V3+", "V4", "V4+", "V5", "V5+", "V6", "V7", "V8", "V8+", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17"]

    french = ["1", "2", "2+", "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c"]

    britTrad = ["M", "D", "VD", "HVD", "S", "HS", "VS", "HVS", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12"]


    // For sorting lists of climbs based on grade in DESCENDING order
    compareLog(a: Log, b: Log) {

        const aGrade = a.grade
        const bGrade = b.grade

        var aIndex = this.font.indexOf(aGrade) + this.v.indexOf(aGrade) + 1
        var bIndex = this.font.indexOf(bGrade) + this.v.indexOf(bGrade) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(aGrade)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(aGrade.split(" ")[0])
        if (bIndex == -1) bIndex = this.french.indexOf(bGrade)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(bGrade.split(" ")[0])

        if (aIndex == bIndex) return a.date.getTime() - b.date.getTime()

        return bIndex - aIndex
    }

    compareGrade(a: string, b: string) {

        var aIndex = this.font.indexOf(a) + this.v.indexOf(a) + 1
        var bIndex = this.font.indexOf(b) + this.v.indexOf(b) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(a)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(a.split(" ")[0])
        if (bIndex == -1) bIndex = this.french.indexOf(b)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(b.split(" ")[0])

        return bIndex - aIndex
    }

    private getFontGrade(vGrade: any) { return this.font[this.v.indexOf(vGrade)] }
    private getVGrade(fontGrade: any) { return this.v[this.font.indexOf(fontGrade)] }


    getBoulderGrade(grade: string, gradeScale: "font" | "v" = "font") {

        if (grade.startsWith("V")) {
            if (gradeScale == "v") return grade.toUpperCase()
            return this.getFontGrade(grade.toUpperCase())
        }

        if (grade.startsWith("f")) {
            if (gradeScale == "font") return grade
            return this.getVGrade(grade)
        }


    }
}

export const smallFontStyling = { fontSize: 12, fontWeight: 800, fontFamily: "Nunito" }
export const mediumFontStyling = { fontSize: 15, fontWeight: 800, fontFamily: "Nunito" }

export function getStyle(style: string) {
    switch (style) {
        case "Sent x": return "Sent"
        case "Sent β": return "Flash"
        case "Sent O/S": return "Onsight"
        case "Sent rpt": return "Repeat"
        case "Sent dnf": return "DNF"
        case "Lead RP": return "Redpoint"
        case "Lead β": return "Flash"
        case "Lead G/U": return "GroundUp"
        case "Lead O/S": return "Onsight"
        case "Lead rpt": return "Repeat"
        case "Lead dnf": return "DNF"
        case "Lead dog": return "Dogged"
    }
}

export function getStyleIndex(style: string) {
    switch (style) {
        case "Flash": return 1
        case "Onsight": return 2
        default: return 0
    }
}

export function cleanGrade(grade: string, type: string) {
    if (type == "Bouldering") return new GradeConverter().getBoulderGrade(grade)
    if (type == "Trad") return grade.split(" ")[0]
    return grade
}

export function createDate(date: string) {
    return new Date(date.replace("???", "01/Jan").replace("??", "01"))
}


export function getTopClimbsPerYear(logs: Log[], yearList: number[]) {
    const topClimbsPerYear: { [key: string]: number }[] = []
    // e.g {0: {year:2017, f7a: 1, f7c: 9}
    //      1: {year:2018, f7c: 7, f8a: 3}}
    const gradesInTopClimbs: string[] = []
    // e.g ["6a+", "6b", "7b", "7b+", "7c"]
    const topClimbNames: Record<string, string[]> = {}
    // e.g {2020-7a: ["green traverse"],
    //      2020-7a+: ["wish"]}

    var yearInc: { [key: string]: number }
    yearList.forEach((year) => {
        yearInc = { "year": year }
        const topClimbForYear = logs.filter((l) => l.date.getFullYear() == year).slice(0, 10)

        topClimbForYear.forEach((l) => {

            topClimbNames[year + "-" + l.grade] = [...topClimbNames[year + "-" + l.grade] ?? []].concat([l.name])

            const temp = yearInc[l.grade] ?? 0
            yearInc[l.grade] = temp + 1
            if (!gradesInTopClimbs.includes(l.grade)) gradesInTopClimbs.push(l.grade)
        })
        topClimbsPerYear.push(yearInc)
    })

    const templateyear: { [key: string]: number } = {}
    for (const grade of gradesInTopClimbs.values()) templateyear[grade] = 0
    topClimbsPerYear.map((c) => {
        return { ...templateyear, ...c }
    })

    return { topClimbsPerYear, gradesInTopClimbs, topClimbNames }
}


export function getTimelineData(climbs: Log[], presentGrades: string[]) {
    const climbDate: { [key: string]: Date | number }[] = []

    function newDate(date: number = new Date().getTime()): { [key: string]: number } {
        const a: { [key: string]: number } = { "date": date }
        for (const grade of presentGrades.values()) a[grade] = 0
        return a
    }

    var currentDate = newDate()
    structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb, index) => {
        if (index == 0) currentDate["date"] = climb.date.getTime()
        if (currentDate["date"] != climb.date.getTime()) {

            climbDate.push({ ...currentDate })

            currentDate["date"] = climb.date.getTime()
        }
        const temp = currentDate[climb.grade] ?? 0
        if (typeof (temp) == "number") currentDate[climb.grade] = temp + 1

    })
    if (climbDate.length > 0) {
        climbDate.push({...climbDate[climbDate.length - 1], "date": new Date().getTime()})
    }
    return climbDate
}



export function getFrequencyData(logs: Log[]) {
    const presentGrades: string[] = []
    const climbFreq: Record<string, number[]> = {}
    const gradeDataSet: {
        "grade": string,
        "send": number,
        "flash": number,
        "onsight": number
    }[] = []

    logs.forEach((climb) => {

        if (!presentGrades.includes(climb.grade)) presentGrades.push(climb.grade)

        const temp = climbFreq[climb.grade] ?? [0, 0, 0] // send, flash, onsight
        temp[getStyleIndex(climb.style)] = temp[getStyleIndex(climb.style)] + 1
        climbFreq[climb.grade] = temp
    })

    for (const key in climbFreq) {
        gradeDataSet.push({ "grade": key, "send": climbFreq[key][0].valueOf(), "flash": climbFreq[key][1].valueOf(), "onsight": climbFreq[key][2].valueOf() })
    }

    return { gradeDataSet, presentGrades }
}