import { Download } from './Download'
import { Channel } from '../../utils'
import { useState } from 'react'
import axios from 'axios'
import swal from '@sweetalert/with-react'
import {
  UnknownError
} from '../../utils'
import { captureException } from '@sentry/nextjs'


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

      //@todo check file type when select by topic is available

      // const channelData = channels?.filter((channel) => {
      //   return channel.fqcn === fqcn && channel.topics && channel.topics.length > 0
      // })
      // const fileType = channelData && channelData.length > 0 ? 'json' : 'txt'

      const res = await axios.get(
        `/api/v1/message?${query}`,
        auth ? { headers: { Authorization: `Bearer ${auth}`, 'content-type': 'application/json' } } : undefined
      )

      let payload

      if (res.data && Array.isArray(res.data) && res.data.length === 0) {
        return swal('Info', `No recent messages to download`, 'info')
      }

      try {
        payload = JSON.parse(res.data[0].payload)
      } catch (error) {
        payload = res.data[0].payload
      }

      const fileType = typeof payload === 'object' ? 'json' : 'txt'
      const fileName = `${fqcn}_${new Date().getTime()}.${fileType}`
      const type = typeof payload === 'object' ? 'application/json' : 'application/text'

      const blob = new Blob([res.data[0].payload], { type: type })
      const url = await window.URL.createObjectURL(blob)
      const tempLink = document.createElement('a')
      tempLink.href = url
      tempLink.setAttribute('download', fileName)
      tempLink.click()

      swal(`Success`, `File downloaded Succesfully`, 'success')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        swal('Error', err.response?.data?.err?.reason, 'error')
      } else {
        const error = new UnknownError(err)
        captureException(error)
        swal('Error', `${new UnknownError(err).body}`, 'error')
      }
      setIsLoading(false)
    }
  }

  return <Download channels={channels} onDownload={handleDownload} />
}
