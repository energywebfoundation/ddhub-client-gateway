import { useState } from 'react';
import { Upload } from './Upload';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import { Channel, Topic } from '../../utils';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';

type UploadContainerProps = {
  auth?: string;
  channels: Channel[] | undefined;
  topics: Topic[] | undefined;
};

export const UploadContainer = ({
  auth,
  channels,
  topics,
}: UploadContainerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File, fqcn: string, topic: Topic) => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fqcn', fqcn);
    formData.append('signature', 'ssss');
    formData.append('topicId', topic.id);

    try {
      const res = await axios.post(`/v1/dsb/file/upload`, formData, {
        headers: {
          Authorization: auth ? `Bearer ${auth}` : undefined,
          'content-type': 'multipart/form-data',
        },
      });

      swal(`Successful`, `File uploaded succesfully`, 'success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        swal('Error', err.response?.data?.err?.reason, 'error');
      } else {
        swal('Error', `Could not set identity: ${err}`, 'error');
      }
      setIsLoading(false);
    }
  };

  return <Upload channels={channels} topics={topics} onUpload={handleUpload} />;
};
