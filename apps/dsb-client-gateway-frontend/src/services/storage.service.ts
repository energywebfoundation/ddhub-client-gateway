import { promises as fs } from 'fs'
import { config } from '../config'
import { CertificateFiles, Enrolment, ErrorCode, Identity, Option, Result, Storage } from '../utils'
import path from 'path'

// TODO: cache reads

// SETTERS

// GETTERS

export async function getStorage(): Promise<Option<Storage>> {
  try {
    const contents = await fs.readFile(config.storage.inMemoryDbFile, 'utf-8')
    return {
      some: JSON.parse(contents)
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log('Error reading storage:', err.message)
      console.error(err);
    }
    return { none: true }
  }
}

export async function getIdentity(): Promise<Option<Identity>> {
  const { some: storage } = await getStorage()
  if (storage && storage.identity) {
    return { some: storage.identity }
  }
  return { none: true }
}

export async function getEnrolment(): Promise<Option<Enrolment>> {
  const { some: storage } = await getStorage()
  if (storage && storage.enrolment) {
    return { some: storage.enrolment }
  }
  return { none: true }
}

export async function getCertificate(): Promise<Option<CertificateFiles>> {
  const { some: storage } = await getStorage()
  if (storage && storage.certificate) {
    return { some: storage.certificate }
  }
  return { none: true }
}

// DELETE STATE

export async function deleteEnrolment(): Promise<Result<boolean, Error>> {
  const { some: storage } = await getStorage()
  if (storage?.enrolment) {
    try {
      await fs.writeFile(config.storage.inMemoryDbFile, JSON.stringify({ ...storage, enrolment: undefined }, null, 2))
      return { ok: true }
    } catch (err) {
      return { err: new Error(ErrorCode.DISK_WRITE_FAILED) }
    }
  }
  return { ok: true }
}
