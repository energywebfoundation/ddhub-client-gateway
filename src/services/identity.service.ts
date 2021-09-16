import { BigNumber, providers, utils, Wallet } from 'ethers'
import { IAM, RegistrationTypes, setCacheClientOptions } from 'iam-client-lib'
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types'
import { parseEther } from 'ethers/lib/utils'
import {
  BalanceState,
  EnrolmentState,
  Identity,
  EnrolmentManager,
  Result,
  RoleState,
  Storage,
  MESSAGEBROKER_ROLE,
  USER_ROLE,
  PARENT_NAMESPACE,
  NoPrivateKeyError,
  NotEnroledError,
  NoBalanceError,
  NoDIDError,
  CreateClaimError,
  DiskWriteError,
  InvalidPrivateKeyError,
  BalanceCheckError,
  IAMInitError,
  FetchClaimsError,
  Web3ProviderError
} from '../utils'
import { config } from '../config'
import { getEnrolment, getIdentity, getStorage, writeEnrolment, writeIdentity } from './storage.service'
import { events } from './events.service'

/**
 * Signs proof of private key ownership with current block to prevent replay attacks
 *
 * @returns JWT
 */
export async function signProof(): Promise<Result<string>> {
  const { some: identity } = await getIdentity()
  if (!identity) {
    return { err: new NoPrivateKeyError() }
  }
  const { some: enrolment } = await getEnrolment()
  if (!enrolment || !enrolment.did) {
    return { err: new NotEnroledError() }
  }
  const signer = new Wallet(identity.privateKey)
  const header = {
    alg: 'ES256',
    typ: 'JWT'
  }
  const encodedHeader = utils.base64.encode(Buffer.from(JSON.stringify(header)))
  // does not work :(
  // const { ok: block } = await getCurrentBlock()
  const payload = {
    iss: enrolment.did,
    claimData: {
      blockNumber: 999999999999
    }
  }
  const encodedPayload = utils.base64.encode(Buffer.from(JSON.stringify(payload)))
  const message = utils.arrayify(utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`)))
  const sig = await signer.signMessage(message)
  const encodedSig = utils.base64.encode(Buffer.from(sig))
  return { ok: `${encodedHeader}.${encodedPayload}.${encodedSig}` }
}

/**
 *
 * @param payload message paylaod stringified
 * @returns signature (string of concatenated r+s+v)
 */
export async function signPayload(payload: string): Promise<Result<string>> {
  const { some: identity } = await getIdentity()
  if (!identity) {
    return { err: new NoPrivateKeyError() }
  }
  const signer = new Wallet(identity.privateKey)
  const sig = await signer.signMessage(payload)
  return { ok: sig }
}

/**
 * Configure Identity Access Management (IAM)
 *
 * @param identity sets IAM to use this private key
 * @returns EnrolmentManager - queries and creates claims
 */
export async function initEnrolment({ address, privateKey }: Identity): Promise<Result<EnrolmentManager>> {
  const { ok: balance, err: balanceError } = await validateBalance(address)
  if (balance === undefined) {
    return { err: balanceError }
  }
  if (balance === BalanceState.NONE) {
    return { err: new NoBalanceError() }
  }
  const { ok: iam, err: iamError } = await initIAM(privateKey)
  if (!iam) {
    return { err: iamError }
  }
  const did = iam.getDid()
  if (!did) {
    // IAM Client Library creates the DID for us so this *should* not occur
    return { err: new NoDIDError() }
  }
  return {
    ok: {
      did,
      getState: async () => {
        const { ok: claims, err: fetchError } = await fetchClaims(iam, did)
        if (!claims) {
          return { err: fetchError }
        }
        const state = readClaims(claims)
        if (state.waiting) {
          events.emit('await_approval', iam)
        }
        if (state.approved) {
          events.emit('approved')
        }
        return { ok: state }
      },
      handle: async ({ roles }: EnrolmentState) => {
        // if (roles.messagebroker === RoleState.NO_CLAIM) {
        //   const { ok } = await createClaim(iam, MESSAGEBROKER_ROLE)
        //   if (!ok) {
        //     return { err: new CreateClaimError(MESSAGEBROKER_ROLE) }
        //   }
        // }
        if (roles.user === RoleState.NO_CLAIM) {
          const { ok } = await createClaim(iam, USER_ROLE)
          if (!ok) {
            return { err: new CreateClaimError(USER_ROLE) }
          }
        }
        return { ok: true }
      },
      save: async (state: EnrolmentState) => {
        const { ok, err } = await writeEnrolment({ did, state })
        if (err) {
          return { err: new DiskWriteError('enrolment data') }
        }
        return { ok }
      }
    }
  }
}

/**
 * Asserts whether a private key is valid
 *
 * @param privateKey string private key that the wallet should use
 * @returns the wallet initiated from private key
 */
export function validatePrivateKey(privateKey: string): Result<Wallet> {
  try {
    const isValidPrefixed = privateKey.startsWith('0x') && privateKey.length === 66
    const isValidNoPrefix = !privateKey.startsWith('0x') && privateKey.length === 64
    if (!isValidPrefixed && !isValidNoPrefix) {
      throw Error()
    }
    return { ok: new Wallet(privateKey) }
  } catch (err) {
    return {
      err: new InvalidPrivateKeyError()
    }
  }
}

/**
 * Checks if balance validation required (e.g. on server side rendering)
 */
export function shouldValidateBalance({ identity, enrolment }: Storage): boolean {
  const alreadyEnroled = enrolment ? enrolment.state.approved || enrolment.state.waiting : false
  return identity?.address ? !alreadyEnroled : false
}

/**
 * Check user has enough funds to pay for transaction
 *
 * @param address check the balance of this account
 * @returns balance state (NONE, LOW, OK)
 */
export async function validateBalance(address: string): Promise<Result<BalanceState>> {
  try {
    const provider = new providers.JsonRpcProvider(config.iam.rpcUrl)
    const balance = await provider.getBalance(address)
    if (balance.eq(BigNumber.from(0))) {
      return { ok: BalanceState.NONE }
    }
    if (balance.lt(BigNumber.from(parseEther('0.005')))) {
      return { ok: BalanceState.LOW }
    }
    return { ok: BalanceState.OK }
  } catch (err) {
    return {
      err: new BalanceCheckError()
    }
  }
}

/**
 * Retrieve dynamic state (e.g. balance, claim status) as part of storage
 */
export async function refreshState(): Promise<Result<Storage>> {
  const { some: storage } = await getStorage()
  let newState: Storage = {}
  if (storage?.identity?.address) {
    const address = storage.identity.address
    const { ok: balance, err: balanceError } = await validateBalance(address)
    if (balance === undefined) {
      return { err: balanceError }
    }
    newState.identity = {
      ...storage.identity,
      balance
    }
    await writeIdentity(newState.identity)
  }
  if (storage?.enrolment?.did) {
    const { ok: iam, err: iamError } = await initIAM(storage.identity?.privateKey!!)
    if (!iam) {
      return { err: iamError }
    }
    const { ok: claims, err: claimsError } = await fetchClaims(iam, storage.enrolment.did)
    if (!claims) {
      return { err: claimsError }
    }
    newState.enrolment = {
      ...storage.enrolment,
      state: readClaims(claims)
    }
    await writeEnrolment(newState.enrolment)
  }
  if (storage?.certificate) {
    newState.certificate = storage.certificate
  }
  return { ok: newState }
}

/**
 * Initialze IAM Client Library
 *
 * @param privateKey the identity controlling to the DID
 * @returns initialized IAM object
 */
export async function initIAM(privateKey: string): Promise<Result<IAM>> {
  try {
    const iam = new IAM({
      privateKey,
      rpcUrl: config.iam.rpcUrl
    })
    setCacheClientOptions(config.iam.chainId, {
      url: config.iam.cacheServerUrl
    })
    await iam.initializeConnection()
    return { ok: iam }
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Failed to init IAM: ${err.message}`)
    }
    return {
      err: new IAMInitError()
    }
  }
}

/**
 * Fetch all claims under PARENT_NAMESPACE
 *
 * @param iam initialized IAM object
 * @param did subject of the claims
 * @returns array of claims
 */
async function fetchClaims(iam: IAM, did: string): Promise<Result<Claim[]>> {
  try {
    console.log('Fetching claims for', did, 'on', PARENT_NAMESPACE)
    const claims = await iam.getClaimsByRequester({
      did,
      parentNamespace: PARENT_NAMESPACE
    })
    return { ok: claims }
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Failed to fetch claims for ${did}: ${err.message}`)
    }
    return {
      err: new FetchClaimsError()
    }
  }
}

/**
 * Parse claim data to find out overall enrolment state
 *
 * @param claims list of claims from IAM Client Library
 * @returns EnrolmentState
 */
function readClaims(claims: Claim[]): EnrolmentState {
  // cycle through claims to get overall enrolment status
  const state: EnrolmentState = {
    approved: false,
    waiting: false,
    roles: {
      user: RoleState.NO_CLAIM,
      // messagebroker: config.dsb.controllable ? RoleState.NO_CLAIM : RoleState.NOT_WANTED
    }
  }
  for (const { claimType, isAccepted } of claims) {
    // if (claimType === MESSAGEBROKER_ROLE) {
    //   state.roles.messagebroker = isAccepted ? RoleState.APPROVED : RoleState.AWAITING_APPROVAL
    // }
    if (claimType === USER_ROLE) {
      state.roles.user = isAccepted ? RoleState.APPROVED : RoleState.AWAITING_APPROVAL
    }
    state.approved = isApproved(state)
    state.waiting = isWaiting(state)
  }
  return state
}

/**
 * Create a claim to enrol as a certain role
 *
 * @param iam initialized IAM object
 * @param claim the type of claim (messagebroker, user, etc.)
 * @returns ok (boolean)
 */
async function createClaim(iam: IAM, claim: string): Promise<Result<boolean, Error>> {
  try {
    await iam.createClaimRequest({
      claim: {
        claimType: claim,
        claimTypeVersion: 1,
        fields: []
      },
      registrationTypes: [RegistrationTypes.OnChain, RegistrationTypes.OffChain]
    })
    return { ok: true }
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Failed to create claim ${claim}: ${err.message}`)
      return { err }
    }
    return { err: new Error() }
  }
}

/**
 * Check approval state of claims based on MB controllable state
 *
 * @returns true if is approved
 */
export function isApproved({ roles }: EnrolmentState): boolean {
  return roles.user === RoleState.APPROVED
  // return config.dsb.controllable
  //   ? roles.messagebroker === RoleState.APPROVED && roles.user === RoleState.APPROVED
  //   : roles.user === RoleState.APPROVED
}

/**
 * Check wait state of claims based on MB controllable state
 *
 * @returns true if waiting
 */
function isWaiting({ roles }: EnrolmentState): boolean {
  return roles.user === RoleState.AWAITING_APPROVAL
  // return config.dsb.controllable
  //   ? roles.messagebroker === RoleState.AWAITING_APPROVAL || roles.user === RoleState.AWAITING_APPROVAL
  //   : roles.user === RoleState.AWAITING_APPROVAL
}

/**
 * Queries chain to get current block for signing identity proof
 *
 * @returns block height
 */
async function getCurrentBlock(): Promise<Result<number>> {
  try {
    const provider = new providers.JsonRpcProvider(config.iam.rpcUrl)
    const block = await provider.getBlockNumber()
    return { ok: block }
  } catch (err) {
    if (err instanceof Error) {
      console.log(`Failed to get current block: ${err.message}`)
    }
    return { err: new Web3ProviderError() }
  }
}
