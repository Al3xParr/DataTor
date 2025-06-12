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


export interface GradeGraphData {
    "grade": string,
    "send": number,
    "flash": number,
    "onsight": number
}

export interface TopClimbsGraphData {
    [key: string]: number
}

export interface TimelineGraphData {
    [key: string]: Date | number
}