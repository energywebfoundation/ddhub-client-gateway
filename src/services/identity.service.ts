import { BigNumber, providers, Wallet } from "ethers"
import { IAM, RegistrationTypes, setCacheClientOptions } from "iam-client-lib"
import { Claim } from "iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types"
import { ErrorCode, HttpApiError, HttpError, Result } from "utils"
import { config } from 'config'
import { parseEther } from 'ethers/lib/utils'
import { writeIdentity } from './storage.service'

/**
 * TODO:
 * - don't necessarily error on each step: persist and maintain state
 *      throughout process so it can be continued at an point
 * - sync to DID document after approved - probably have a button in FE to do this manually
 */

const PARENT_NAMESPACE = config.iam.parentNamespace
const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`
const MESSAGEBROKER_ROLE = `messagebroker.roles.${PARENT_NAMESPACE}`

export enum RoleState {
    NO_CLAIM,
    AWAITING_APPROVAL,
    APPROVED,
    NOT_WANTED, // if gateway is not controlling message broker
}

export enum BalanceState {
    NONE = 'NONE',
    LOW = 'LOW',
    OK = 'OK'
}

export type EnrolmentState = {
    ready: boolean
    user: RoleState
    messagebroker: RoleState
}

export type IdentityManager = {
    /**
     * Decentralized Identifer (DID) belonging to gateway identity
     */
    did: string
    /**
     * Public key of associated private key of gateway
     */
    publicKey: string
    /**
     * Reports the status of the balance (i.e. if the identity will be able to
     * pay for the transaction(s))
     */
    balance: BalanceState
    /**
     * Get enrolment status of the configured identity (private key)
     *
     * @returns individual state of messagebroker and user roles
     */
    getEnrolmentState: () => Promise<Result<EnrolmentState, HttpApiError>>
    /**
     * Creates enrolment claims (messagebroker and user) for gateway identity
     *
     * @param state current state, retreived from getEnrolmentState
     * @returns ok (boolean) or error code
     */
    handleEnrolement: (state: EnrolmentState) => Promise<Result<boolean, HttpApiError>>
    /**
     * Persists gateway identity to json file
     *
     * @returns ok (boolean) or error code
     */
    writeToFile: (state: EnrolmentState) => Promise<Result<boolean, HttpApiError>>
}

/**
 * Configure Identity Access Management (IAM)
 *
 * @param privateKey sets IAM to use this private key
 * @returns IdentityManager - object with helper methods to query and create claims
 */
export async function initIdentity(privateKey: string): Promise<Result<IdentityManager, HttpApiError>> {
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
                        state.ready = isAccepted && !config.dsb.controllable
                        state.messagebroker = isAccepted
                            ? RoleState.APPROVED
                            : RoleState.AWAITING_APPROVAL
                    }
                    if (claimType === USER_ROLE) {
                        state.ready = isAccepted
                        state.user = isAccepted
                            ? RoleState.APPROVED
                            : RoleState.AWAITING_APPROVAL
                    }
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
