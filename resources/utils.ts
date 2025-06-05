import { Log, Logbook } from "./types";



export function getTotalClimbs(logbook: Logbook) {
    return (logbook.boulder.length + logbook.sport.length + logbook.trad.length + logbook.winter.length)
}





export class GradeConverter {

    font =  ["f3", "f3+", "f4", "f4+", "f5", "f5+", "f6A", "f6A+", "f6B", "f6B+", "f6C", "f6C+", "f7A", "f7A+", "f7B", "f7B+", "f7C", "f7C+", "f8A", "f8A+", "f8B", "f8B+", "f8C", "f8C+", "f9A"]
    v =     ["VB", "V0-", "V0", "V0+", "V1", "V2", "V3", "V3+", "V4", "V4+", "V5", "V5+", "V6", "V7", "V8", "V8+", "V9", "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17"]

    french = ["1", "2", "2+", "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c" ]

    britTrad = ["M", "D", "VD", "HVD", "S", "HS", "VS", "HVS", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10", "E11", "E12"]
    

    // For sorting lists of climbs based on grade in DESCENDING order
    compareGrade(a: Log, b: Log) {

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