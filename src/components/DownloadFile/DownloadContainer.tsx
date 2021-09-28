import { Download } from './Download'
import { Channel } from '../../utils'
import { useState } from 'react'
import axios from 'axios'
import swal from '@sweetalert/with-react'


type DownloadContainerProps = {
  auth?: string
  channels: Channel[] | undefined
}

export const DownloadContainer = ({ auth, channels }: DownloadContainerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async (fqcn: string, amount: number, clientId?: string) => {
    setIsLoading(true)
    try {

      let query = `fqcn=${fqcn}`
      query += amount ? `&amount=${amount}` : ''
      query += clientId ? `&clientId=${clientId}` : ''

      const res = await axios.get(
        `/api/v1/message?${query}`,
        auth ? { headers: { Authorization: `Bearer ${auth}`, 'content-type': 'application/json' } } : undefined
      )
      const messages  = res.data
      console.log('messages', messages)

      swal(`Success`,`File downloaded Succesfully`, 'success')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        swal('Error', err.response?.data?.err?.reason, 'error')
      } else {
        swal('Error', `Could not set identity: ${err}`, 'error')
      }
      setIsLoading(false)
    }
  }

  return <Download channels={channels} onDownload={handleDownload} />
}
