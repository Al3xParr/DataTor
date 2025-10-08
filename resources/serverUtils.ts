'use server'

import { GradeGraphData, Log, TimelineData, TopClimbsGraphData } from "./types"
import { GradeConverter } from "./utils"

const styleIndex: Record<string, number> = {
    "Flash": 1,
    "Onsight": 2,
    "Sent": 0,
    "Redpoint": 0,
    "Ground Up": 3,
    "Repeat": 4
}

export interface TopClimbsDataRtn {
    topClimbsPerYear: TopClimbsGraphData[],
    gradeList: string[],
    names: Record<string, string[]>
}

export async function getTopClimbsData(logs: Log[]): Promise<TopClimbsDataRtn> {
    const rtn = new Promise<TopClimbsDataRtn>((resolve) => {

        const topClimbsPerYear: TopClimbsGraphData[] = []
        // e.g {0: {year:2017, f7a: 1, f7c: 9}
        //      1: {year:2018, f7c: 7, f8a: 3}}
        const gradeList: string[] = []
        // e.g ["6a+", "6b", "7b", "7b+", "7c"]
        const names: Record<string, string[]> = {}
        // e.g {2020-7a: ["green traverse"],
        //      2020-7a+: ["wish"]}

        let yearInc: { [key: string]: number }

        let count = 0
        let currentYear = new Date().getFullYear()

        while (count != logs.length) {
            yearInc = { "year": currentYear }
            const climbsInyear = logs.filter((l) => l.date.getFullYear() == currentYear)
            const topClimbForYear = climbsInyear.slice(0, 10)

            topClimbForYear.forEach((l) => {

                names[currentYear + "-" + l.grade] = [...names[currentYear + "-" + l.grade] ?? []].concat([l.name])

                const temp = yearInc[l.grade] ?? 0
                yearInc[l.grade] = temp + 1
                if (!gradeList.includes(l.grade)) gradeList.push(l.grade)
            })
            topClimbsPerYear.push(yearInc)

            count += climbsInyear.length
            currentYear -= 1
        }

        const templateyear: { [key: string]: number } = {}
        for (const grade of gradeList.values()) templateyear[grade] = 0
        topClimbsPerYear.map((c) => {
            return { ...templateyear, ...c }
        })


        resolve({ topClimbsPerYear: topClimbsPerYear.reverse(), gradeList, names })
    })

    return rtn
}

export interface TimelineDataRtn {
    data: DatePoint[],
    presentGrades: string[]
}

export interface DatePoint {
    date: number,
    freq: {[key: string]: number}
    
}


// export async function getTimelineData(climbs: Log[], extendToToday: boolean = true): Promise<TimelineData[]> {
export async function getTimelineData(climbs: Log[]): Promise<TimelineDataRtn> {
    const rtn = new Promise<TimelineDataRtn>((resolve) => {
        const climbDate: DatePoint[] = []

        const presentGrades = [] as string[]

        function newDate(date: number = new Date().getTime()): DatePoint {
            const a: DatePoint = { date: date, freq: {} }
            for (const grade of presentGrades.values()) a.freq[grade] = 0
            return a
        }

        let currentDate = newDate()
        structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb, index) => {

            if (index == 0) currentDate.date = climb.date.getTime()

            if (currentDate.date != climb.date.getTime()) {

                climbDate.push({ ...structuredClone(currentDate) })

                currentDate.date = climb.date.getTime()
            }

            if (!presentGrades.includes(climb.grade)){
                presentGrades.push(climb.grade)
                climbDate.forEach((val) => val.freq[climb.grade] = 0)
            }

            const temp = currentDate.freq[climb.grade] ?? 0
            currentDate.freq[climb.grade] = temp + 1

        })

        const gradesOut = presentGrades.filter((grade) => grade.startsWith("5.")).sort((a, b) => new GradeConverter().compareGrade(a, b))
        const gradesOutYds = presentGrades.filter((grade) => !grade.startsWith("5.")).sort((a, b) => new GradeConverter().compareGrade(a, b))

        resolve({data: climbDate, presentGrades: gradesOutYds.concat(gradesOut) } as TimelineDataRtn)
    })

    return rtn
}


export async function getGradeData(logs: Log[]): Promise<GradeGraphData[]> {
    const rtn = new Promise<GradeGraphData[]>((resolve) => {
        const presentGrades: string[] = []
        const climbFreq: Record<string, number[]> = {}
        const gradeDataSet: GradeGraphData[] = []

        logs.forEach((climb) => {

            if (!presentGrades.includes(climb.grade)) presentGrades.push(climb.grade)

            const temp = climbFreq[climb.grade] ?? [0, 0, 0, 0, 0] // send, flash, onsight, groundup, repeat
            temp[styleIndex[climb.style]] = temp[styleIndex[climb.style]] + 1
            climbFreq[climb.grade] = temp
        })

        for (const key in climbFreq) {
            gradeDataSet.push({
                "grade": key, "send": climbFreq[key][0].valueOf(),
                "flash": climbFreq[key][1].valueOf(),
                "onsight": climbFreq[key][2].valueOf(),
                "groundup": climbFreq[key][3].valueOf(),
                "repeat": climbFreq[key][4].valueOf()
            })
        }

        resolve(gradeDataSet)
    })
    return rtn
}

export interface AvgMaxData {
    year: number,
    max: number,
    avg: number,
    total: number
}


export async function getAvgMaxData(logs: Log[]): Promise<AvgMaxData[]> {

    if (logs.length == 0) return [] as AvgMaxData[]

    const gradeConverter = new GradeConverter()

    let scale: "font" | "v" | "french" | "britTrad" | "yds" = "font"
    switch (logs[0].type) {
        case "Sport": scale = "french"
        case "Trad": scale = "britTrad"
    }

    const avgMaxData: AvgMaxData[] = []

    let count = 0
    let currentYear = new Date().getFullYear()

    while (count != logs.length) {
        const yearLogs = logs.filter((l) => l.date.getFullYear() == currentYear)

        if (yearLogs.length > 0) {
            const max = gradeConverter.getGradeIndex(yearLogs[0].grade)
            const avgList = yearLogs.map((l) => gradeConverter.getGradeIndex(l.grade))
            const avg = Math.floor(avgList.reduce((acc, val) => acc + val) / yearLogs.length)
            avgMaxData.push({ year: currentYear, max: max, avg: avg, total: yearLogs.length })
        }

        count += yearLogs.length
        currentYear -= 1
    }

    return avgMaxData.reverse()
}


export interface CountryData {
    countries: string[],
    count: number[]
}



export async function getCountryData(logs: Log[]): Promise<CountryData> {
    const countries: string[] = []
    const count: number[] = []

    logs.forEach((l) => {

        if (l.country != null) {
            if (countries.includes(l.country)) {
                const index = countries.indexOf(l.country)
                count[index]++
            } else {
                countries.push(l.country)
                count.push(1)
            }
        }
    }
    )

    return { countries, count }
}


function cleanAreaName(name: string) {
    switch (name) {
        case "USA": return "United States of America"
        case "Borders": return "Scottish Borders"
        case "Invernesshire": return "Highland"
        case "Lochaber": return "Highland"
        case "Isle of Skye": return "Highland"
        case "Caithness": return "Highland"
        case "Ross and Cromarty": return "Highland"
        case "Sutherland": return "Highland"
        case "Stirlingshire": return "Stirling"
        case "Perthshire": return "Perth and Kinross"
        case "Hebrides": return "Argyll and Bute"
        case "Herefordshire": return "Herefordshire, County of"
        case "Isle of Man": return "Man, Isle of"

        default: return name
    }
}

export interface AreaData {
    freq: number,
    topClimbs: string[],
    gradeDistribution: number[],
    minGrade: string,
    maxGrade: string
}

export async function getMapData(logs: Log[]) {
    const areaFreq: Record<string, AreaData> = {}

    const gradeConverter = new GradeConverter()

    if (logs.length == 0) return areaFreq

    const scale = (() => {
        switch (logs[0].type) {
            case "Sport": return "french"
            case "Trad": return "britTrad"
            default: return "font"
        }
    })()


    const counties = new Set(logs.filter((l) => ["England", "Wales", "Scotland", "Northern Ireland"].includes(l.country)).map((log) => log.county))
    const countries = new Set(logs.filter((l) => !["England", "Wales", "Scotland", "Northern Ireland"].includes(l.country)).map((log) => log.country))

    counties.forEach((county) => {
        const cleanedName = cleanAreaName(county)
        const climbs = logs.filter((log) => cleanAreaName(log.county) == cleanedName).sort((a, b) => gradeConverter.compareLog(a, b))
        const { minIndex: min,
            maxIndex: max,
            distribution: gradeDistribution
        } = gradeConverter.getGradeDistribution(climbs.map((climb) => climb.grade))

        areaFreq[cleanedName] = {
            freq: climbs.length,
            topClimbs: climbs.slice(0, 3).map((climb) => climb.grade + "/-" + climb.name),
            gradeDistribution: gradeDistribution,
            minGrade: gradeConverter.getGradeFromIndex(min, scale),
            maxGrade: gradeConverter.getGradeFromIndex(max, scale)
        } as AreaData
    })

    countries.forEach((country) => {
        const cleanedName = cleanAreaName(country)
        const climbs = logs.filter((log) => log.country == country).sort((a, b) => gradeConverter.compareLog(a, b))
        const { minIndex: min,
            maxIndex: max,
            distribution: gradeDistribution
        } = gradeConverter.getGradeDistribution(climbs.map((climb) => climb.grade))

        areaFreq[cleanedName] = {
            freq: climbs.length,
            topClimbs: climbs.slice(0, 3).map((climb) => climb.grade + "/-" + climb.name),
            gradeDistribution: gradeDistribution,
            minGrade: gradeConverter.getGradeFromIndex(min, (country == "USA" || country == "Canada") && logs[0].type != "Bouldering" ? "yds" :  scale),
            maxGrade: gradeConverter.getGradeFromIndex(max, (country == "USA" || country == "Canada") && logs[0].type != "Bouldering" ? "yds" :  scale)
        } as AreaData
    })

    return areaFreq
}