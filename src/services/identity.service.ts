import { BigNumber, providers, utils, Wallet } from "ethers"
import { IAM, RegistrationTypes, setCacheClientOptions } from "iam-client-lib"
import { Claim } from "iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types"
import {
    BalanceState,
    EnrolmentState,
    ErrorCode,
    HttpApiError,
    HttpError,
    IdentityManager,
    Result,
    RoleState
} from "utils"
import { config } from 'config'
import { parseEther } from 'ethers/lib/utils'
import { getIdentity, writeIdentity } from './storage.service'

const PARENT_NAMESPACE = config.iam.parentNamespace
const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`
const MESSAGEBROKER_ROLE = `messagebroker.roles.${PARENT_NAMESPACE}`

/**
 * Signs proof of private key ownership with current block to prevent replay attacks
 *
 * @returns JWT
 */
export async function signProof(): Promise<Result<string>> {
    const { some: identity } = await getIdentity()
    if (!identity) {
        return { err: new Error(ErrorCode.NO_PRIVATE_KEY) }
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
        iss: identity.did,
        claimData: {
            blockNumber: 999999999999
        }
    }
    const encodedPayload = utils.base64.encode(Buffer.from(JSON.stringify(payload)))
    const message = utils.arrayify(
        utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`))
    )
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
        return { err: new Error(ErrorCode.NO_PRIVATE_KEY) }
    }
    const signer = new Wallet(identity.privateKey)
    const sig = await signer.signMessage(payload)
    return { ok: sig }
}

/**
 * TODO:
 * - don't necessarily error on each step: persist and maintain state
 *      throughout process so it can be continued at an point
 * - sync to DID document after approved - probably have a button in FE to do this manually
 */

/**
 * Configure Identity Access Management (IAM)
 *
 * @param privateKey sets IAM to use this private key
 * @returns IdentityManager - object with helper methods to query and create claims
 */
export async function initIdentity(privateKey: string): Promise<Result<IdentityManager, HttpApiError>> { // TODO: change
    const { ok: wallet, err: privateKeyError } = validatePrivateKey(privateKey)
    if (!wallet) {
        return { err: privateKeyError }
    }
    const { ok: balance, err: balanceError } = await validateBalance(wallet.address)
    if (balance === undefined) {
        return { err: balanceError }
    }
    if (balance === BalanceState.NONE) {
        // TODO: make this check optional - esp. in the context of generating keys
        return {
            err: new HttpApiError(HttpError.BAD_REQUEST, ErrorCode.NO_BALANCE)
        }
    }
    const { ok: iam, err: iamError } = await initIAM(privateKey)
    if (!iam) {
        return { err: iamError }
    }
    const did = iam.getDid()
    if (!did) {
        // IAM Client Library creates the DID for us so this *should* not occur
        return { err: new HttpApiError(HttpError.BAD_REQUEST, ErrorCode.NO_DID) }
    }
    return {
        ok: {
            did,
            publicKey: wallet.publicKey,
            balance,
            getEnrolmentState: async () => {
                const { ok: claims, err: fetchError } = await fetchClaims(iam, did)
                if (!claims) {
                    return { err: fetchError }
                }
                // cycle through claims to get overall enrolment status
                const state = {
                    ready: false,
                    user: RoleState.NO_CLAIM,
                    messagebroker: config.dsb.controllable ? RoleState.NO_CLAIM : RoleState.NOT_WANTED
                }
                for (const { claimType, isAccepted } of claims) {
                    if (claimType === MESSAGEBROKER_ROLE) {
                        state.messagebroker = isAccepted
                            ? RoleState.APPROVED
                            : RoleState.AWAITING_APPROVAL
                    }
                    if (claimType === USER_ROLE) {
                        state.user = isAccepted
                            ? RoleState.APPROVED
                            : RoleState.AWAITING_APPROVAL
                    }
                    state.ready = config.dsb.controllable
                        ? (state.messagebroker === RoleState.APPROVED) && (state.user === RoleState.APPROVED)
                        : state.user === RoleState.APPROVED
                }
                return { ok: state }
            },
            handleEnrolement: async (state: EnrolmentState) => {
                if (state.messagebroker === RoleState.NO_CLAIM) {
                    const { ok } = await createClaim(iam, MESSAGEBROKER_ROLE)
                    if (!ok) {
                        return { err: new HttpApiError(
                            HttpError.INTERNAL_SERVER_ERROR,
                            ErrorCode.CREATE_MESSAGEBROKER_CLAIM_FAILED)
                        }
                    }
                }
                if (state.user === RoleState.NO_CLAIM) {
                    const { ok } = await createClaim(iam, USER_ROLE)
                    if (!ok) {
                        return { err: new HttpApiError(
                            HttpError.INTERNAL_SERVER_ERROR,
                            ErrorCode.CREATE_USER_CLAIM_FAILED)
                        }
                    }
                }
                return { ok: true }
            },
            writeToFile: async (state: EnrolmentState) => {
                const { ok, err } = await writeIdentity({
                    did,
                    address: wallet.address,
                    publicKey: wallet.publicKey,
                    privateKey: wallet.privateKey,
                    balance,
                    state
                })
                if (err) {
                    return { err: new HttpApiError(
                        HttpError.INTERNAL_SERVER_ERROR,
                        ErrorCode.DISK_PERSIST_FAILED
                    ) }
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
function validatePrivateKey(privateKey: string): Result<Wallet, HttpApiError> {
    try {
        return { ok: new Wallet(privateKey) }
    } catch (err) {
        return {
            err: new HttpApiError(
                HttpError.BAD_REQUEST,
                ErrorCode.INVALID_PRIVATE_KEY)
        }
    }
}

/**
 * Check user has enough funds to pay for transaction
 *
 * @param address check the balance of this account
 * @returns balance state (NONE, LOW, OK)
 */
async function validateBalance(address: string): Promise<Result<BalanceState, HttpApiError>> {
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
            err: new HttpApiError(
                HttpError.INTERNAL_SERVER_ERROR,
                ErrorCode.BALANCE_CHECK_FAILED
            )
        }
    }
}

/**
 * Initialze IAM Client Library
 *
 * @param privateKey the identity controlling to the DID
 * @returns initialized IAM object
 */
async function initIAM(privateKey: string): Promise<Result<IAM, HttpApiError>> {
    try {
        const iam = new IAM({
            privateKey,
            rpcUrl: config.iam.rpcUrl,
        })
        setCacheClientOptions(
            config.iam.chainId,
            {
                url: config.iam.cacheServerUrl
            }
        )
        await iam.initializeConnection()
        return { ok: iam }
    } catch (err) {
        console.log(`Failed to init IAM: ${err.message}`)
        return {
            err: new HttpApiError(
                HttpError.INTERNAL_SERVER_ERROR,
                ErrorCode.IAM_INIT_ERROR)
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
async function fetchClaims(iam: IAM, did: string): Promise<Result<Claim[], HttpApiError>> {
    try {
        const claims = (await iam.getClaimsBySubject({
            did,
            parentNamespace: PARENT_NAMESPACE,
        }))
        return { ok: claims }
    } catch (err) {
        console.log(`Failed to fetch claims for ${did}: ${err.message}`)
        return {
            err: new HttpApiError(
                HttpError.INTERNAL_SERVER_ERROR,
                ErrorCode.FETCH_CLAIMS_FAILED)
        }
    }
}

/**
 * Create a claim to enrol as a certain role
 *
 * @param iam initialized IAM object
 * @param claim the type of claim (messagebroker, user, etc.)
 * @returns ok (boolean)
 */
async function createClaim(iam: IAM, claim: string): Promise<Result> {
    try {
        await iam.createClaimRequest({
            claim: {
                claimType: claim,
                claimTypeVersion: 1,
                fields: []
            },
            registrationTypes: [
                RegistrationTypes.OnChain,
                RegistrationTypes.OffChain,
            ]
        })
        return { ok: true }
    } catch (err) {
        console.log(`Failed to create claim ${claim}: ${err.message}`)
        return { err }
    }
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
        console.log(`Failed to get current block: ${err.message}`)
        return { err: new Error(ErrorCode.WEB3_PROVIDER_ERROR) }
    }
}
