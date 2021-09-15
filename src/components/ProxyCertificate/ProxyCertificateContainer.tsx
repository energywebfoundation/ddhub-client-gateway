import { useState } from 'react'
import swal from '@sweetalert/with-react'
import axios from 'axios'
import { ProxyCertificate } from './ProxyCertificate'

type ProxyCertificateContainerProps = {
  certificate?: {
    clientId: string
    tenantId: string
    clientSecret: string
  }
  auth?: string
}

export const ProxyCertificateContainer = ({ certificate, auth }: ProxyCertificateContainerProps) => {
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
        auth ? { headers: { Authorization: `Bearer ${auth}` } } : undefined
      )
      swal('Success', 'Certificate saved', 'success')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        swal('Error', err.response?.data?.err?.reason, 'error')
      } else {
        swal('Error', `Could not set identity: ${err}`, 'error')
      }
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
