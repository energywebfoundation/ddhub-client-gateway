import react, { useState } from 'react'
import axios from 'axios'
import { useErrors } from 'hooks/useErrors'
import { GatewayIdentity } from './GatewayIdentity'
import { BalanceState, Enrolment, EnrolmentState, Identity } from 'utils'

type GatewayIdentityContainerProps = {
    identity?: Identity
    enrolment?: Enrolment
}

const hasFunds = (balance?: BalanceState) => {
    if (!balance) {
        return false
    }
    return balance !== BalanceState.NONE
}

export const GatewayIdentityContainer = ({
    identity,
    enrolment
}: GatewayIdentityContainerProps) => {
    const errors = useErrors()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [did, setDid] = useState(enrolment?.did ?? '')
    const [address, setAddress] = useState(identity?.address ?? '')
    const [balance, setBalance] = useState(hasFunds(identity?.balance))
    const [enroled, setEnroled] = useState<EnrolmentState | undefined>(enrolment?.state)

    const handleSubmit = async (privateKey?: string) => {
        setError('')
        setIsLoading(true)
        try {
            const body = privateKey ? { privateKey } : undefined
            const res = await axios.post('/api/config/identity', body)
            setAddress(res.data.address)
            setBalance(hasFunds(res.data.balance))
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
            enroled={enroled}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
        />
    )
}
