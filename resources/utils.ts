import clsx, { ClassValue } from "clsx";
import { Log } from "./types";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]){
    return twMerge(clsx(inputs))
}


export const globalColours = ["#40AE79","#F39B6D", "#E5BEED", "#007991","#222E50"]

export class GradeConverter {

    font = ["f3", "f3+", "f4", "f4+", "f5", "f5+", "f6A", "f6A+", "f6B", "f6B+", "f6C", "f6C+", "f7A", "f7A+", "f7B", "f7B+", "f7C", "f7C+", "f8A", "f8A+", "f8B", "f8B+", "f8C", "f8C+", "f9A"]
    v = ["VB", "V0-", "V0", "V0+", "V1", "V2", "V3", "V3+", "V4", "V4+", "V5", "V5+", "V6", "V7", "V8", "V8+", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17"]

    french = ["1", "2", "2+", "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c"]

    britTrad = ["M", "D", "VD", "HVD", "S", "HS", "VS", "HVS", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12"]


    // For sorting lists of climbs based on grade in DESCENDING order
    compareLog(a: Log, b: Log) {

        const aGrade = a.grade
        const bGrade = b.grade

        let aIndex = this.font.indexOf(aGrade) + this.v.indexOf(aGrade) + 1
        let bIndex = this.font.indexOf(bGrade) + this.v.indexOf(bGrade) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(aGrade)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(aGrade)
        if (bIndex == -1) bIndex = this.french.indexOf(bGrade)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(bGrade)

        if (aIndex == bIndex) return a.date.getTime() - b.date.getTime()

        return bIndex - aIndex
    }

    compareGrade(a: string, b: string) {

        let aIndex = this.font.indexOf(a) + this.v.indexOf(a) + 1
        let bIndex = this.font.indexOf(b) + this.v.indexOf(b) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(a)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(a)
        if (bIndex == -1) bIndex = this.french.indexOf(b)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(b)

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

    getGradeIndex(grade: string){
        let index = this.font.indexOf(grade)
        if (index == -1) index = this.v.indexOf(grade)
        if (index == -1) index = this.britTrad.indexOf(grade)
        if (index == -1) index = this.french.indexOf(grade)
        return index
    }

    getGradeFromIndex(index: number, scale: "font" | "v" | "french" | "britTrad"){
        switch (scale) {
            case "v": return this.v[index]
            case "french": return this.french[index]
            case "britTrad": return this.britTrad[index]
            default: return this.font[index]
        }
    }
}

export const smallFontStyling = { fontSize: 12, fontWeight: 400, fontFamily: "Nunito" }
export const mediumFontStyling = { fontSize: 14, fontWeight: 600, fontFamily: "Nunito" }

export function getStyle(style: string) {
    switch (style) {
        case "Sent x": return "Sent"
        case "Sent β": return "Flash"
        case "Sent Î²": return "Flash"
        case "Sent O/S": return "Onsight"
        case "Sent rpt": return "Repeat"
        case "Sent dnf": return "DNF"
        case "Lead RP": return "Redpoint"
        case "Lead β": return "Flash"
        case "Lead Î²": return "Flash"
        case "Lead G/U": return "GroundUp"
        case "Lead O/S": return "Onsight"
        case "Lead rpt": return "Repeat"
        case "Lead dnf": return "DNF"
        case "Lead dog": return "Dogged"
        case "Solo": return "Sent"
        case "Solo β": return "Flash"
        case "Solo Î²": return "Flash"
        case "Solo O/S": return "Onsight"
        default : return "Sent"
    }
}


export function cleanGrade(grade: string, type: string) {
    const splitGrade = grade.split(" ")[0]
    if (type == "Bouldering") return new GradeConverter().getBoulderGrade(splitGrade)
    return splitGrade
}

export function createDate(date: string) {
    return new Date(date.replace("???", "01/Jan").replace("??", "01"))
}

