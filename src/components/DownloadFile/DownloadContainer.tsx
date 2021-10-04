import { Download } from './Download'
import { Channel } from '../../utils'
import { useState } from 'react'
import axios from 'axios'
import swal from '@sweetalert/with-react'
import * as fs from 'fs'
import path from 'path'


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
        `/api/v1/download?${query}`,
        auth ? { headers: { Authorization: `Bearer ${auth}`, 'content-type': 'application/json' } } : undefined
      )

      let payload
      try {
        payload = JSON.parse(res.data[0])
      } catch (error) {
        payload = res.data[0]
      }

      const fileType = typeof payload === 'object' ? 'json' : 'txt'
      const fileName = `messages.${fileType}`
      const type = typeof payload === 'object' ? 'application/json' : 'application/text'

      const blob = new Blob([res.data], { type: type })
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
        swal('Error', `Could not set identity: ${err}`, 'error')
      }
      setIsLoading(false)
    }
  }

  return <Download channels={channels} onDownload={handleDownload} />
}
