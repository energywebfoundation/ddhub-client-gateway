import react, { useState } from 'react'
import axios from 'axios'
import { useErrors } from 'hooks/useErrors'
import { GatewayIdentity } from './GatewayIdentity'
import { BalanceState, EnrolmentState } from 'utils'
import { Identity } from 'services/storage.service'

type GatewayIdentityContainerProps = {
    identity?: Identity
}

const hasFunds = (balance?: BalanceState) => {
    if (!balance) {
        return false
    }
    return balance !== BalanceState.NONE
}

export const GatewayIdentityContainer = ({
    identity
}: GatewayIdentityContainerProps) => {
    const errors = useErrors()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [did, setDid] = useState(identity?.did ?? '')
    const [address, setAddress] = useState(identity?.address ?? '')
    const [balance, setBalance] = useState(hasFunds(identity?.balance))
    const [enrolment, setEnrolment] = useState<EnrolmentState | undefined>(identity?.state)

    const handleSubmit = async (privateKey?: string) => {
        setError('')
        setIsLoading(true)
        try {
            const body = privateKey ? { privateKey } : undefined
            const res = await axios.post('/api/config/identity', body)
            setDid(res.data.did)
            setAddress(res.data.address)
            setBalance(hasFunds(res.data.balance))
            setEnrolment(res.data.state)
        } catch (err) {
            setError(`Error: ${errors(err.response.data.err)}`)
        }
        setIsLoading(false)
    }

    return (
        <GatewayIdentity
            did={did}
            address={address}
            balance={balance}
            enrolment={enrolment}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
        />
    )
}
