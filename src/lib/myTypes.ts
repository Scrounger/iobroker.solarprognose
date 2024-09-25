export interface dataStructure {
    preferredNextApiRequestAt: preferredNextApiRequestAt;
    status: number;
    iLastPredictionGenerationEpochTime: number;
    datalinename: string;
    data: { [key: number]: Array<number> } | number
}

export interface preferredNextApiRequestAt {
    secondOfHour: number;
    epochTimeUtc: number;
}

export interface tStateDefinition {
    id?: string,
    common?: any,
    ignore?: boolean,
}

export interface myJsonStructure {
    timestamp: number;
    val: number;
    total: number;
}

export const stateDefinition: { [key: string]: tStateDefinition; } = {
    json: {
        id: 'json',
        common: {
            type: 'json',
            read: true,
            write: false,
            role: 'json',
            def: '{}'
        },
    }
}