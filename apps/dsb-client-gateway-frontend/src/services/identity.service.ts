import { Wallet } from 'ethers';
import {
  EnrolmentState,
  NoPrivateKeyError,
  Result,
  RoleState,
  Storage,
} from '../utils';
import { config } from '../config';
import { getIdentity } from './storage.service';
import axios from 'axios';

/**
 *
 * @param payload message paylaod stringified
 * @returns signature (string of concatenated r+s+v)
 */
export async function signPayload(payload: string): Promise<Result<string>> {
  const { some: identity } = await getIdentity();
  console.log('signing payload');

  if (!identity) {
    return { err: new NoPrivateKeyError() };
  }
  const signer = new Wallet(identity.privateKey);
  const sig = await signer.signMessage(payload);
  return { ok: sig };
}

/**
 * Retrieve dynamic state (e.g. balance, claim status) as part of storage
 */
export async function refreshState(): Promise<Result<Storage>> {
  const api = axios.create({
    baseURL: config.dsb.backendUrl,
    validateStatus: () => true, // no throw
  });

  const identity = await api.get('/api/v1/identity').then(({ data }) => data);

  const enrolment = await api.get('/api/v1/enrol').then(({ data }) => data);

  const storage: Storage = {
    identity: {},
    enrolment: {},
  };

  if (identity.address) {
    storage.identity = {
      address: identity.address,
      privateKey: null as any,
      balance: identity.balance,
      publicKey: identity.publicKey,
    };
  }

  if (enrolment.did) {
    storage.enrolment = {
      state: enrolment.state,
      did: enrolment.did,
    };
  }

  return {
    ok: storage,
    err: null,
  };
}

/**
 * Check approval state of claims based on MB controllable state
 *
 * @returns true if is approved
 */
export function isApproved({ roles }: EnrolmentState): boolean {
  return roles.user === RoleState.APPROVED;
  // return config.dsb.controllable
  //   ? roles.messagebroker === RoleState.APPROVED && roles.user === RoleState.APPROVED
  //   : roles.user === RoleState.APPROVED
}
