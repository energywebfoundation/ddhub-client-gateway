import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { useCertificateSave } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  useModalDispatch,
  useModalStore,
  ModalActionsEnum,
} from '../../../context';

enum Config {
  Certificate = 'certificate',
  PrivateKey = 'privateKey',
  CACertificate = 'caCertificate',
}

export const useCertificateEffects = () => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<FileWithPath>();
  const [selectedPrivateKey, setSelectedPrivateKey] = useState<FileWithPath>();
  const [selectedCACertificate, setSelectedCACertificate] =
    useState<FileWithPath>();

  const fileSetters = {
    [Config.Certificate]: setSelectedCertificate,
    [Config.PrivateKey]: setSelectedPrivateKey,
    [Config.CACertificate]: setSelectedCACertificate,
  };

  const {
    certificate: { open },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const Swal = useCustomAlert();
  const { createConfigurationHandler, isLoading: isUploading } =
    useCertificateSave();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CERTIFICATE,
      payload: {
        open: false,
      },
    });
  };

  const showModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CERTIFICATE,
      payload: {
        open: true,
      },
    });
  };

  const onFileChange = (acceptedFiles: File[], key: Config) => {
    const setFile = fileSetters[key];
    const file = acceptedFiles[0];

    setFile && setFile(file);
  };

  const clear = () => {
    setSelectedCertificate(undefined);
    setSelectedPrivateKey(undefined);
    setSelectedCACertificate(undefined);
  };

  const openCancelModal = async () => {
    closeModal();
    const result = await Swal.warning({
      text: 'The certificate configuration form will be closed.',
    });

    if (result.isConfirmed) {
      clear();
      closeModal();
    } else {
      showModal();
    }
  };

  const onSuccess = () => {
    clear();
    closeModal();
    Swal.success({
      text: 'Certificates have been successfully configured.',
    });
  };

  const createConfig = () => {
    const data = {
      [Config.Certificate]: selectedCertificate,
      [Config.PrivateKey]: selectedPrivateKey,
      ...(selectedCACertificate && {
        [Config.CACertificate]: selectedCACertificate,
      }),
    };
    createConfigurationHandler(data, onSuccess);
  };

  const onCertificateChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, Config.Certificate);

  const onPrivateKeyChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, Config.PrivateKey);

  const onCACertificateChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, Config.CACertificate);

  const certificateTextValue = selectedCertificate?.path ?? '';
  const privateKeyTextValue = selectedPrivateKey?.path ?? '';
  const caCertificateTextValue = selectedCACertificate?.path ?? '';

  const values = {
    certificate: certificateTextValue,
    privateKey: privateKeyTextValue,
    caCertificate: caCertificateTextValue,
  };

  const buttonDisabled = !selectedCertificate || !selectedPrivateKey;

  return {
    open,
    closeModal,
    onCertificateChange,
    onPrivateKeyChange,
    onCACertificateChange,
    values,
    clear,
    openCancelModal,
    createConfig,
    isUploading,
    buttonDisabled,
  };
};
