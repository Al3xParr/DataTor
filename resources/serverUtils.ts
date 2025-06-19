'use server'

import { GradeGraphData, Log, TimelineGraphData, TopClimbsGraphData } from "./types"
import { GradeConverter } from "./utils"

const styleIndex: Record<string, number> = {
    "Flash": 1,
    "Onsight": 2,
    "Sent": 0,
    "Redpoint": 0,
    "GroundUp": 0,
    "Repeat": 0
}

export interface TopClimbsDataRtn {
    topClimbsPerYear: TopClimbsGraphData[],
    gradesInTopClimbs: string[],
    topClimbNames: Record<string, string[]>
}

export async function getTopClimbsPerYear(logs: Log[], yearList: number[]): Promise<TopClimbsDataRtn> {
    const rtn = new Promise<TopClimbsDataRtn>((resolve) => {

        const topClimbsPerYear: TopClimbsGraphData[] = []
        // e.g {0: {year:2017, f7a: 1, f7c: 9}
        //      1: {year:2018, f7c: 7, f8a: 3}}
        const gradesInTopClimbs: string[] = []
        // e.g ["6a+", "6b", "7b", "7b+", "7c"]
        const topClimbNames: Record<string, string[]> = {}
        // e.g {2020-7a: ["green traverse"],
        //      2020-7a+: ["wish"]}

        let yearInc: { [key: string]: number }
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


        resolve({ topClimbsPerYear, gradesInTopClimbs, topClimbNames })
    })

    return rtn
}



export async function getTimelineData(climbs: Log[], presentGrades: string[], extendToToday: boolean = true): Promise<TimelineGraphData[]> {
    const rtn = new Promise<TimelineGraphData[]>((resolve) => {
        const climbDate: TimelineGraphData[] = []

        function newDate(date: number = new Date().getTime()): { [key: string]: number } {
            const a: { [key: string]: number } = { "date": date }
            for (const grade of presentGrades.values()) a[grade] = 0
            return a
        }

        let currentDate = newDate()
        structuredClone(climbs).sort((a, b) => a.date.valueOf() - b.date.valueOf()).forEach((climb, index) => {
            if (index == 0) currentDate["date"] = climb.date.getTime()
            if (currentDate["date"] != climb.date.getTime()) {

                climbDate.push({ ...currentDate })

                currentDate["date"] = climb.date.getTime()
            }
            const temp = currentDate[climb.grade] ?? 0
            if (typeof (temp) == "number") currentDate[climb.grade] = temp + 1

        })
        if (climbDate.length > 0 && extendToToday) {
            climbDate.push({ ...climbDate[climbDate.length - 1], "date": new Date().getTime() })
        }


        resolve(climbDate)
    })

    return rtn
}

export interface GradeDataRtn {
    gradeDataSet: GradeGraphData[]
    presentGrades: string[]
}

export async function getGradeData(logs: Log[]): Promise<GradeDataRtn> {
    const rtn = new Promise<GradeDataRtn>((resolve) => {
        const presentGrades: string[] = []
        const climbFreq: Record<string, number[]> = {}
        const gradeDataSet: GradeGraphData[] = []

        logs.forEach((climb) => {

            if (!presentGrades.includes(climb.grade)) presentGrades.push(climb.grade)

            const temp = climbFreq[climb.grade] ?? [0, 0, 0] // send, flash, onsight
            temp[styleIndex[climb.style]] = temp[styleIndex[climb.style]] + 1
            climbFreq[climb.grade] = temp
        })

        for (const key in climbFreq) {
            gradeDataSet.push({ "grade": key, "send": climbFreq[key][0].valueOf(), "flash": climbFreq[key][1].valueOf(), "onsight": climbFreq[key][2].valueOf() })
        }

        resolve({ gradeDataSet, presentGrades })
    })
    return rtn
}

export interface AvgMaxData {
    year: number,
    max: number,
    avg: number
}

export interface AvgMaxDataRtn {
    data: AvgMaxData[],
    min: number
}


export async function getAvgMaxData(logs: Log[], yearList: number[]): Promise<AvgMaxDataRtn> {

    if (logs.length == 0) return { data: [], min: 0 }

    const gradeConverter = new GradeConverter()

    let scale: "font" | "v" | "french" | "britTrad" = "font"
    switch (logs[0].type) {
        case "Sport": scale = "french"
        case "Trad": scale = "britTrad"
    }

    const avgMaxData: AvgMaxData[] = []

    let min = 100

    yearList.forEach((y) => {
        const yearLogs = logs.filter((l) => l.date.getFullYear() == y)

        if (yearLogs.length > 0) {
            const max = gradeConverter.getGradeIndex(yearLogs[0].grade)
            const avgList = yearLogs.map((l) => gradeConverter.getGradeIndex(l.grade))
            const avg = Math.floor(avgList.reduce((acc, val) => acc + val) / yearLogs.length)
            avgMaxData.push({ year: y, max: max, avg: avg })

            if (avg < min) min = avg
        }
    })
    return { data: avgMaxData, min: min }

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

export async function getMapData(logs: Log[]) {
    const countyFreq: Record<string, number> = {}
    logs.forEach((l) => {
        const temp = countyFreq[l.county] ?? 0
        countyFreq[l.county] = temp + 1
    })
    return countyFreq
}