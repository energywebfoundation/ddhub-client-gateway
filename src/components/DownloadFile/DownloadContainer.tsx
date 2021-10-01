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

      // const channelData = channels?.filter((channel) => {
      //   return channel.fqcn === fqcn && channel.topics && channel.topics.length > 0
      // })

    

      // const fileType = channelData && channelData.length > 0 ? 'json' : 'txt'

      // console.log('fileType', fileType)

      const res = await axios.get(
        `/api/v1/download?${query}`,
        auth ? { headers: { Authorization: `Bearer ${auth}`, 'content-type': 'application/json' } } : undefined
      )

      const fileName = "messages.txt"
      const json = JSON.stringify(res.data)
      const blob = new Blob([json], { type: 'application/json' })
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
