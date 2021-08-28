import React, { useState, useEffect } from 'react'
import { Upload } from './Upload'
import axios from 'axios'
import swal from '@sweetalert/with-react'
import { useErrors } from '../../hooks/useErrors'
import { Channel, Result, } from '../../utils';



type UploadContainerProps = {
	auth?: string
}

export const UploadContainer = ({ auth }: UploadContainerProps) => {
	const errors = useErrors()
	const [isLoading, setIsLoading] = useState(false)
	const [channels, setChannels] = useState<Channel[] | undefined>([])

	const loadChannels = async () => {
		try {
			const res = await axios.get(
				`/api/v1/channels`,
				auth
					? { headers: { 'Authorization': `Bearer ${auth}`, 'content-type': 'multipart/form-data' } }
					: undefined
			)
			setChannels(res.data)
		} catch (error) {
			swal('Error', errors(error.response.data.err), 'error')
		}
	}

	const handleUpload = async (file: File, fqcn: string, topic: string) => {

		setIsLoading(true)
		const formData = new FormData()
		formData.append("file", file)

		try {
			await axios.post(
				`/api/v1/upload?fqcn=${fqcn}&topic=${topic}`,
				formData,
				auth
					? { headers: { 'Authorization': `Bearer ${auth}`, 'content-type': 'multipart/form-data' } }
					: undefined
			)

			swal("'Success", "Your file has been uploaded!", "success")

		} catch (err) {
			swal('Error', errors(err.response.data.err), 'error')
			setIsLoading(false)
		}
	}

	return (
		<Upload
			channels={channels}
			fetchChannels={loadChannels}
			onUpload={handleUpload}
		/>
	)
}
