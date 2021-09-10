import { ErrorBodySerialized, GatewayError, UnknownError } from '.'
import { Result, StringType } from './types'

export const snip = (some: string, type: StringType) => {
  let start: number
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

export const serializeError = <T>(result: Result<T, GatewayError>): Result<T, ErrorBodySerialized> => {
  return result.err ? { err: result.err.serialize() } : { ok: result.ok }
}

export const errorOrElse = (error: GatewayError | undefined): GatewayError => {
  return error ?? new UnknownError(error)
}
