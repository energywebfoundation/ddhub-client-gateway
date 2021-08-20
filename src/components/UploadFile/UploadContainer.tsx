import React, { useState } from 'react';
import { Upload } from './Upload';
import axios from 'axios'
import swal from '@sweetalert/with-react'
import { useErrors } from 'hooks/useErrors'


type UploadContainerProps = {
	auth?: string
}

export const UploadContainer = ({ auth }: UploadContainerProps) => {
	const errors = useErrors()
	const [isLoading, setIsLoading] = useState(false)


	const handleUpload = async (file: File, fqcn: string) => {

		setIsLoading(true)
		const formData = new FormData();
		formData.append("file", file);

		try {
			await axios.post(
				`/api/v1/upload?fqcn=${fqcn}`,
				formData,
				auth
					? { headers: { 'Authorization': `Bearer ${auth}`, 'content-type': 'multipart/form-data' } }
					: undefined
			)

			swal("'Success", "Your file has been uploaded!", "success");

		} catch (err) {
			swal('Error', errors(err.response.data.err), 'error');
			setIsLoading(false);
		}
	}

	return (
		<Upload
			onUpload={handleUpload}
		/>
	)
}
