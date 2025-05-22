import { Logbook } from "./types";



export function getTotalClimbs(logbook: Logbook) {
    return (logbook.boulder.length + logbook.sport.length + logbook.trad.length + logbook.winter.length)
}





export class GradeConverter {

    map: Record<string, string> = {
        "VB": "f3",
        "V0-": "f3+",
        "V0": "f4",
        "V0+": "f4+",
        "V1": "f5",
        "V2": "f5+",
        "V3": "f6A",
        "V3+": "f6A+",
        "V4": "f6B",
        "V4+": "f6B+",
        "V5": "f6C",
        "V5+": "f6C+",
        "V6": "f7A",
        "V7": "f7A+",
        "V8": "f7B",
        "V8+": "f7B+",
        "V9": "f7C",
        "V10": "f7C+",
        "V11": "f8A",
        "V12": "f8A+",
        "V13": "f8B",
        "V14": "f8B+",
        "V15": "f8C",
        "V16": "f8C+",
        "V17": "f9A"
    }

    reverseMap: Record<string, string> = {}

    constructor() {
        for (const key in this.map) {
            const value = this.map[key]
            this.reverseMap[value] = key
        }

    }

    compareBoulderGrade(a: string, b: string) {
        const aNorm = this.getBoulderGrade(a, "v")?.substring(1)
        const bNorm = this.getBoulderGrade(b, "v")?.substring(1)


        const trueA = parseInt(aNorm!)
        const trueB = parseInt(bNorm!)

        if (trueA.toString() == aNorm && trueB.toString() == bNorm) {



            if (trueA < trueB) { //a < b
                return -1;
            } else if (trueA > trueB) { // a > b
                return 1
            }
            return 0
        }

        if (trueA < trueB) { //a < b
            return -1;
        } else if (trueA > trueB) { // a > b
            return 1
        } else if (aNorm?.endsWith("+")) {
            return 1
        } else if (bNorm?.endsWith("+")) {
            return -1
        }

        return 0


    }

    private getFontGrade(vGrade: any) { return this.map[vGrade] ?? vGrade }
    private getVGrade(fontGrade: any) { return this.reverseMap[fontGrade] ?? fontGrade }


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