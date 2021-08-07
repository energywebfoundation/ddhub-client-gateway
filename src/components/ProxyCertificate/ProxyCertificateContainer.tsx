import React, { useState } from 'react'
import swal from '@sweetalert/with-react'
import axios from 'axios'
import { ProxyCertificate } from './ProxyCertificate'
import { useErrors } from 'hooks/useErrors'

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
    const errors = useErrors()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (clientId: string, tenantId: string, clientSecret: string) => {
        setIsLoading(true)
        try {
            await axios.post('/api/config/certificate', {
                clientId,
                tenantId,
                clientSecret
            })
        } catch (err) {
            swal('Error', errors(err.response.data.err), 'error')
        }
        setIsLoading(false)
    }

    return (
        <ProxyCertificate
            originalClientId={certificate?.clientId ?? ''}
            originalTenantId={certificate?.tenantId ?? ''}
            isLoading={isLoading}
            onSubmit={handleSubmit}
        />
    )
}
