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
    },
    auth?: string
}

export const ProxyCertificateContainer = ({
    certificate,
    auth
}: ProxyCertificateContainerProps) => {
    const errors = useErrors()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (clientId: string, tenantId: string, clientSecret: string) => {
        setIsLoading(true)
        try {
            await axios.post(
                '/api/v1/config/certificate',
                {
                    clientId,
                    tenantId,
                    clientSecret
                },
                 auth
                    ? { headers: { 'Authorization': `Bearer ${auth}` } }
                    : undefined
            )
            swal('Success', 'Certificate saved', 'success')
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
