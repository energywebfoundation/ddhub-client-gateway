export * from './errors'

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

export const joinUrl = (base: string, path: string): string => {
    const baseEndRoot = base.endsWith('/')
    const pathStartRoot = path.startsWith('/')
    if (baseEndRoot && pathStartRoot) {
        return `${base}${path.slice(1)}`
    }
    if (!baseEndRoot && !pathStartRoot) {
        return `${base}/${path}`
    }
    return `${base}${path}`
}
