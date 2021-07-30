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

export const snip = (some: string, type: StringType) => {
    let start
    switch (type) {
        case StringType.HEX:
            start = 2
            break
        case StringType.HEX_COMPRESSED:
            start = 4
            break
        case StringType.DID:
            start = 11
            break
        default:
            start = 0
    }
    return `${some.slice(0, start + 5)}...${some.slice(some.length - 5)}`
}
