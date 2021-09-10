import { config } from '../config'

export const PARENT_NAMESPACE = config.iam.parentNamespace
export const USER_ROLE = `user.roles.${PARENT_NAMESPACE}`
export const MESSAGEBROKER_ROLE = `messagebroker.roles.${PARENT_NAMESPACE}`
