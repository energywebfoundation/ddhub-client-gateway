export type Result<T = boolean, E = Error> = {
    ok?: T
    err?: E
}

export type Option<T> = {
    some?: T
    none?: Boolean
}

export enum StringType {
    STANDARD,
    HEX,
    HEX_COMPRESSED,
    DID
}

export enum DsbControlType {
    PM2 = 'PM2'
}
