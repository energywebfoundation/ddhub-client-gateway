import { useState } from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import { ProxyCertificate } from './ProxyCertificate';
import { CertificateFiles } from '../../utils';

type ProxyCertificateContainerProps = {
  certificate?: CertificateFiles;
  auth?: string;
};

export const ProxyCertificateContainer = ({
  certificate,
  auth,
}: ProxyCertificateContainerProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (cert: File, key: File, ca?: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('certificate', cert);
    formData.append('privateKey', key);

    if (ca) {
      formData.append('caCertificate', ca);
    }

    try {
      const res = await axios.post(`/v1/certificate`, formData, {
        headers: {
          Authorization: auth ? `Bearer ${auth}` : undefined,
          'content-type': 'multipart/form-data',
        },
      });
      Swal.fire('Success', 'Certificate saved', 'success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Swal.fire('Error', err.response?.data?.err?.reason, 'error');
      } else {
        Swal.fire('Error', `Could not set identity: ${err}`, 'error');
      }
    }
    setIsLoading(false);
  };

  return (
    <ProxyCertificate
      certificate={certificate}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
};
