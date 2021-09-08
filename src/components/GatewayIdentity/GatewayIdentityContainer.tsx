import { useState } from 'react'
import axios from 'axios'
import swal from '@sweetalert/with-react'
import { useErrors } from '../../hooks/useErrors'
import { GatewayIdentity } from './GatewayIdentity'
import { BalanceState, Enrolment, EnrolmentState, Identity } from '../../utils'

type GatewayIdentityContainerProps = {
    identity?: Identity
    enrolment?: Enrolment
    auth?: string
}

const hasFunds = (balance?: BalanceState) => {
    if (!balance) {
        return false
    }
    return balance !== BalanceState.NONE
}

export const GatewayIdentityContainer = ({
    identity,
    enrolment,
    auth
}: GatewayIdentityContainerProps) => {
    const errors = useErrors()
    const [isLoading, setIsLoading] = useState(false)
    const [did, setDid] = useState(enrolment?.did ?? '')
    const [address, setAddress] = useState(identity?.address ?? '')
    const [balance, setBalance] = useState(hasFunds(identity?.balance))
    const [enroled, setEnroled] = useState<EnrolmentState | undefined>(enrolment?.state)

    const handleCreate = async (privateKey?: string) => {
        setIsLoading(true)
        try {
            const body = privateKey ? { privateKey } : undefined
            const res = await axios.post(
                '/api/v1/config/identity',
                body,
                auth
                    ? { headers: { 'Authorization': `Bearer ${auth}` } }
                    : undefined
            )
            setAddress(res.data.address)
            setBalance(hasFunds(res.data.balance))
            setDid('')
            setEnroled(undefined)
            swal(
                'Success',
                'Private key saved. If not already funded, visit https://voltafaucet.energyweb.org',
                'success'
            )
        } catch (err) {
            swal('Error', errors(err.response.data.err), 'error')
        }
        setIsLoading(false)
    }

    const handleEnrol = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post(
                '/api/v1/config/enrol',
                undefined,
                auth
                    ? { headers: { 'Authorization': `Bearer ${auth}` } }
                    : undefined
            )
            setDid(res.data.did)
            setEnroled(res.data.state)
            swal(
                'Success',
                'Enrolment to DSB requested. The gateway is listening for approval and will automatically '
                + 'sync the approved claims to the configured DID\'s Document once notified.',
                'success'
            )
        } catch (err) {
            swal('Enrolment Error', errors(err.response.data.err), 'error')
        }
        setIsLoading(false)
    }

    return (
        <GatewayIdentity
            did={did}
            address={address}
            balance={balance}
            enroled={enroled}
            isLoading={isLoading}
            onCreate={handleCreate}
            onEnrol={handleEnrol}
        />
    )
}
