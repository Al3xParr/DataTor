import clsx, { ClassValue } from 'clsx'
import { Log } from './types'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const globalColours = [
    '#40AE79',
    '#F39B6D',
    '#E5BEED',
    '#007991',
    '#222E50',
]

export class GradeConverter {
    font = [
        'f2',
        'f2+',
        'f3',
        'f3+',
        'f4',
        'f4+',
        'f5',
        'f5+',
        'f6A',
        'f6A+',
        'f6B',
        'f6B+',
        'f6C',
        'f6C+',
        'f7A',
        'f7A+',
        'f7B',
        'f7B+',
        'f7C',
        'f7C+',
        'f8A',
        'f8A+',
        'f8B',
        'f8B+',
        'f8C',
        'f8C+',
        'f9A',
    ]
    v = [
        'VE',
        'VM',
        'VB',
        'V0-',
        'V0',
        'V0+',
        'V1',
        'V2',
        'V3',
        'V3+',
        'V4',
        'V4+',
        'V5',
        'V5+',
        'V6',
        'V7',
        'V8',
        'V8+',
        'V9',
        'V10',
        'V11',
        'V12',
        'V13',
        'V14',
        'V15',
        'V16',
        'V17',
    ]

    french = [
        '1',
        '2',
        '2+',
        '3a',
        '3b',
        '3c',
        '4a',
        '4b',
        '4c',
        '5a',
        '5b',
        '5c',
        '6a',
        '6a+',
        '6b',
        '6b+',
        '6c',
        '6c+',
        '7a',
        '7a+',
        '7b',
        '7b+',
        '7c',
        '7c+',
        '8a',
        '8a+',
        '8b',
        '8b+',
        '8c',
        '8c+',
        '9a',
        '9a+',
        '9b',
        '9b+',
        '9c',
    ]
    yds = [
        '5.0',
        '5.1',
        '5.2',
        '5.3',
        '5.4',
        '5.4',
        '5.5',
        '5.6',
        '5.7',
        '5.8',
        '5.9',
        '5.10a',
        '5.10b',
        '5.10c',
        '5.10d',
        '5.11a',
        '5.11b',
        '5.11c',
        '5.11d',
        '5.12a',
        '5.12b',
        '5.12c',
        '5.12d',
        '5.13a',
        '5.13b',
        '5.13c',
        '5.13d',
        '5.14a',
        '5.14b',
        '5.14c',
        '5.14d',
        '5.15a',
        '5.15b',
        '5.15c',
        '5.15d',
    ]

    britTrad = [
        'M',
        'D',
        'VD',
        'HVD',
        'S',
        'HS',
        'VS',
        'HVS',
        'E1',
        'E2',
        'E3',
        'E4',
        'E5',
        'E6',
        'E7',
        'E8',
        'E9',
        'E10',
        'E11',
        'E12',
    ]

    // For sorting lists of climbs based on grade in DESCENDING order
    compareLog(a: Log, b: Log) {
        const aGrade = a.grade
        const bGrade = b.grade

        let aIndex = this.font.indexOf(aGrade) + this.v.indexOf(aGrade) + 1
        let bIndex = this.font.indexOf(bGrade) + this.v.indexOf(bGrade) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(aGrade)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(aGrade)
        if (aIndex == -1) aIndex = this.yds.indexOf(aGrade)
        if (bIndex == -1) bIndex = this.french.indexOf(bGrade)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(bGrade)
        if (bIndex == -1) bIndex = this.yds.indexOf(bGrade)

        if (aIndex == bIndex) return a.date.getTime() - b.date.getTime()

        return bIndex - aIndex
    }

    compareGrade(a: string, b: string) {
        let aIndex = this.font.indexOf(a) + this.v.indexOf(a) + 1
        let bIndex = this.font.indexOf(b) + this.v.indexOf(b) + 1
        if (aIndex == -1) aIndex = this.french.indexOf(a)
        if (aIndex == -1) aIndex = this.britTrad.indexOf(a)
        if (aIndex == -1) aIndex = this.yds.indexOf(a)
        if (bIndex == -1) bIndex = this.french.indexOf(b)
        if (bIndex == -1) bIndex = this.britTrad.indexOf(b)
        if (bIndex == -1) bIndex = this.yds.indexOf(b)

        return bIndex - aIndex
    }

    private getFontGrade(vGrade: any) {
        return this.font[this.v.indexOf(vGrade)]
    }
    private getVGrade(fontGrade: any) {
        return this.v[this.font.indexOf(fontGrade)]
    }

    getBoulderGrade(grade: string, gradeScale: 'font' | 'v' = 'font') {
        if (grade.startsWith('V')) {
            if (gradeScale == 'v') return grade.toUpperCase()
            return this.getFontGrade(grade.toUpperCase())
        }

        if (grade.startsWith('f')) {
            if (gradeScale == 'font') return grade
            return this.getVGrade(grade)
        }
    }

    getGradeIndex(grade: string) {
        let index = this.font.indexOf(grade)
        if (index == -1) index = this.v.indexOf(grade)
        if (index == -1) index = this.britTrad.indexOf(grade)
        if (index == -1) index = this.french.indexOf(grade)
        if (index == -1) index = this.yds.indexOf(grade)
        return index
    }

    getGradeFromIndex(
        index: number,
        scale: 'font' | 'v' | 'french' | 'britTrad' | 'yds'
    ) {
        switch (scale) {
            case 'v':
                return this.v[index]
            case 'yds':
                return this.yds[index]
            case 'french':
                return this.french[index]
            case 'britTrad':
                return this.britTrad[index]
            default:
                return this.font[index]
        }
    }

    getGradeDistribution(grades: string[]) {
        const gradesIndex = grades
            .map((grade) => this.getGradeIndex(grade))
            .sort((a, b) => a - b)
        const minIndex = gradesIndex[0]
        const maxIndex = gradesIndex[gradesIndex.length - 1]
        const distribution: number[] = new Array(maxIndex - minIndex + 1).fill(
            0
        )

        gradesIndex.forEach((index) => {
            distribution[index - minIndex]++
        })

        return { minIndex, maxIndex, distribution }
    }
}

export const smallFontStyling = {
    fontSize: 12,
    color: 'var(--color-txt)',
    fill: 'var(--color-txt)',
    fontWeight: 400,
    fontFamily: 'Nunito',
}
export const mediumFontStyling = {
    fontSize: 14,
    color: 'var(--color-txt)',
    fill: 'var(--color-txt)',
    fontWeight: 600,
    fontFamily: 'Nunito',
}

export function getStyle(style: string) {
    switch (style) {
        case 'Sent x':
            return 'Sent'
        case 'Sent β':
            return 'Flash'
        case 'Sent Î²':
            return 'Flash'
        case 'Sent O/S':
            return 'Onsight'
        case 'Sent rpt':
            return 'Repeat'
        case 'Sent dnf':
            return 'DNF'

        case 'Lead':
            return 'Sent'
        case 'Lead RP':
            return 'Sent'
        case 'Lead β':
            return 'Flash'
        case 'Lead Î²':
            return 'Flash'
        case 'Lead G/U':
            return 'Ground Up'
        case 'Lead O/S':
            return 'Onsight'
        case 'Lead rpt':
            return 'Repeat'
        case 'Lead dnf':
            return 'DNF'
        case 'Lead dog':
            return 'Dogged'

        case 'Solo':
            return 'Sent'
        case 'Solo β':
            return 'Flash'
        case 'Solo Î²':
            return 'Flash'
        case 'Solo O/S':
            return 'Onsight'
        case 'Solo G/U':
            return 'Ground Up'
        case 'Solo RP':
            return 'Sent'
        case 'Solo rpt':
            return 'Repeat'
        case 'Solo dnf':
            return 'DNF'

        case 'TR':
            return 'DNF'
        case 'TR RP':
            return 'DNF'
        case 'TR β':
            return 'DNF'
        case 'TR Î²':
            return 'DNF'
        case 'TR G/U':
            return 'DNF'
        case 'TR O/S':
            return 'DNF'
        case 'TR rpt':
            return 'DNF'
        case 'TR dnf':
            return 'DNF'
        case 'TR dog':
            return 'DNF'

        case 'DWS':
            return 'DNF'
        case 'DWS RP':
            return 'DNF'
        case 'DWS β':
            return 'DNF'
        case 'DWS Î²':
            return 'DNF'
        case 'DWS G/U':
            return 'DNF'
        case 'DWS O/S':
            return 'DNF'
        case 'DWS rpt':
            return 'DNF'
        case 'DWS dnf':
            return 'DNF'

        case '2nd':
            return 'DNF'
        case '2nd RP':
            return 'DNF'
        case '2nd β':
            return 'DNF'
        case '2nd Î²':
            return 'DNF'
        case '2nd &beta;':
            return 'DNF'
        case '2nd G/U':
            return 'DNF'
        case '2nd O/S':
            return 'DNF'
        case '2nd rpt':
            return 'DNF'
        case '2nd dnf':
            return 'DNF'

        case 'AltLd':
            return 'Sent'
        case 'AltLd RP':
            return 'Sent'
        case 'AltLd β':
            return 'Flash'
        case 'AltLd Î²':
            return 'Flash'
        case 'AltLd G/U':
            return 'Ground Up'
        case 'AltLd O/S':
            return 'Onsight'
        case 'AltLd rpt':
            return 'Repeat'
        case 'AltLd dnf':
            return 'DNF'
        case 'AltLd dog':
            return 'Dogged'

        default:
            return 'Sent'
    }
}

export function cleanGrade(grade: string, type: string) {
    const splitGrade = grade.split(' ')[0]
    if (type == 'Bouldering')
        return new GradeConverter().getBoulderGrade(splitGrade)
    return splitGrade
}

function getMonthIndex(month: string): number {
    switch (month) {
        case 'Jan':
            return 0
        case 'Feb':
            return 1
        case 'Mar':
            return 2
        case 'Apr':
            return 3
        case 'May':
            return 4
        case 'Jun':
            return 5
        case 'Jul':
            return 6
        case 'Aug':
            return 7
        case 'Sep':
            return 8
        case 'Oct':
            return 9
        case 'Nov':
            return 10
        case 'Dec':
            return 11
        default:
            return 0
    }
}

function getYear(year: string) {
    return year.length == 4 ? Number(year) : Number('20' + year)
}

export function createDate(date: string) {
    const extendedDate = date
        .replace('???', '01/Jan')
        .replace('??', '01')
        .split('/')
    const d = new Date(
        Number(getYear(extendedDate[2])),
        getMonthIndex(extendedDate[1]),
        Number(extendedDate[0])
    )
    return d
}

export function cleanName(filename: string): string {
    const re = /_Logbook_DLOG( \(\d+\))*.csv/
    return filename.replace(re, '')
}
