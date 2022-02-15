import { useState } from 'react'
import { Upload } from './Upload'
import axios from 'axios'
import swal from '@sweetalert/with-react'
import { Channel, Topic } from '../../utils'

type UploadContainerProps = {
  auth?: string
  channels: Channel[] | undefined
  topics: Topic[] | undefined

}

export const UploadContainer = ({ auth, channels, topics }: UploadContainerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async (file: File, fqcn: string, topic: string) => {
    setIsLoading(true)


    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('fqcn', fqcn)
    formData.append('signature', 'ssss')
    formData.append('topicId', '6205d2affce4e863261e529a')

    try {
      const res = await axios.post(
        `/api/v1/upload?fqcn=${fqcn}&topic=${topic}`,
        formData,
        {
          headers: {
            Authorization: auth ? `Bearer ${auth}` : undefined,
            'content-type': 'multipart/form-data'
          }
        }
      )

      const { transactionId } = res.data
      swal(`Successful`, `File uploaded succesfully`, 'success')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        swal('Error', err.response?.data?.err?.reason, 'error')
      } else {
        swal('Error', `Could not set identity: ${err}`, 'error')
      }
      setIsLoading(false)
    }
  }

  return <Upload channels={channels} topics={topics} onUpload={handleUpload} />
}
