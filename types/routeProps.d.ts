interface Route {
    id: number,
    title: string,
    image: string[]
    memo: string,
    isShared: boolean,
    tags: string[],
    departure: Location,
    destination: Location,
    stopovers: Location[]
}

interface Location {
    name: string,
    latitude: number,
    longitude: number
}