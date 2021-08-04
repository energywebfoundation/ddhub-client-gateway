import react, { useState } from 'react'
import axios from 'axios'
import { ProxyCertificate } from './ProxyCertificate'

type ProxyCertificateContainerProps = {
    certificate?: {
        clientId: string
        tenantId: string
        clientSecret: string
    }
}

export const ProxyCertificateContainer = ({
    certificate
}: ProxyCertificateContainerProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (clientId: string, tenantId: string, clientSecret: string) => {
        setError('')
        setIsLoading(true)
        try {
            await axios.post('/api/config/credentials/proxy', {
                clientId,
                tenantId,
                clientSecret
            })
        } catch (err) {
            setError(`Error: ${err.response.data.err}`)
        }
        setIsLoading(false)
    }

    return (
        <ProxyCertificate
            originalClientId={certificate?.clientId ?? ''}
            originalTenantId={certificate?.tenantId ?? ''}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
        />
    )
}
