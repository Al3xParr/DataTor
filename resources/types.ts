
export type Logbook = {
    boulder: Log[],
    sport: Log[],
    trad: Log[],
    winter: Log[]
}


export type Log = {
    id: number,
    name: string,
    date: string,
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

