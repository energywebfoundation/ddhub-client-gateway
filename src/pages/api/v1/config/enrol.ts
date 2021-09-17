import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthorized } from '../../../../services/auth.service'
import { initEnrolment } from '../../../../services/identity.service'
import { getEnrolment, getIdentity } from '../../../../services/storage.service'
import {
  Enrolment,
  ErrorBody,
  ErrorCode,
  GatewayError,
  NoPrivateKeyError,
  NotEnroledError,
  UnknownError
} from '../../../../utils'
import { captureException, withSentry } from '@sentry/nextjs'

type Response = Enrolment | { err: ErrorBody }

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const authHeader = req.headers.authorization
  const { err } = isAuthorized(authHeader)
  if (!err) {
    switch (req.method) {
      case 'GET':
        return forGET(req, res)
      case 'POST':
        return forPOST(req, res)
      default:
        return res.status(405).end()
    }
  } else {
    if (err.message === ErrorCode.UNAUTHORIZED) {
      res.status(401)
      res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"')
      res.end()
    } else {
      res.status(403).end()
    }
  }
}

/**
 * Gets the current enrolment state
 */
async function forGET(req: NextApiRequest, res: NextApiResponse<Response>) {
  const { some: identity } = await getIdentity()
  if (!identity) {
    return res.status(400).send({ err: new NoPrivateKeyError().body })
  }
  const { some: enrolment } = await getEnrolment()
  if (!enrolment || !enrolment.did) {
    return res.status(400).send({ err: new NotEnroledError().body })
  }
  // todo: refresh state
  return res.status(200).send(enrolment)
}

/**
 * Attempts complete enrolment based on current state.
 * Subscribes to identity events to auto-sync claim approval
 */
async function forPOST(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const { some: identity } = await getIdentity()
    if (!identity) {
      throw new NoPrivateKeyError()
    }
    const { ok: requestor, err: initError } = await initEnrolment(identity)
    if (!requestor) {
      throw initError
    }
    const { ok: state, err: stateError } = await requestor.getState()
    if (!state) {
      throw stateError
    }
    if (state.approved || state.waiting) {
      await requestor.save(state)
      return res.status(200).send({ did: requestor.did, state })
    }
    const { ok: enroled, err: enrolError } = await requestor.handle(state)
    if (!enroled) {
      throw enrolError
    }
    // fetch latest state after enroling
    const { ok: newState, err: newStateError } = await requestor.getState()
    if (!newState) {
      throw newStateError
    }
    const { ok: saved, err: saveError } = await requestor.save(newState)
    if (!saved) {
      throw saveError
    }
    return res.status(200).send({
      did: requestor.did,
      state: newState
    })
  } catch (err) {
    if (err instanceof GatewayError) {
      res.status(err.statusCode).send({ err: err.body })
    } else {
      const error = new UnknownError(err)
      captureException(error)
      res.status(500).send({ err: new UnknownError(err).body })
    }
  }
}
export default withSentry(handler)
