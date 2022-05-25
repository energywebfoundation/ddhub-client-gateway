import { useState } from 'react';
import { FileWithPath } from 'react-dropzone';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import {
  useModalDispatch,
  useModalStore,
  ModalActionsEnum,
} from '../../../context';

enum FileSetters {
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
    [FileSetters.Certificate]: setSelectedCertificate,
    [FileSetters.PrivateKey]: setSelectedPrivateKey,
    [FileSetters.CACertificate]: setSelectedCACertificate,
  };

  const {
    certificate: { open },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const Swal = useCustomAlert();

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_CERTIFICATE,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const hideModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_CERTIFICATE,
      payload: true,
    });
  };

  const showModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_CERTIFICATE,
      payload: false,
    });
  };

  const openCancelModal = async () => {
    hideModal();
    const result = await Swal.warning({
      text: 'you will close configure certificate form',
    });

    if (result.isConfirmed) {
      closeModal();
    } else {
      showModal();
    }
  };

  const onFileChange = (acceptedFiles: File[], key: FileSetters) => {
    const setFile = fileSetters[key];
    const file = acceptedFiles[0];

    setFile && setFile(file);
  };

  const clear = () => {
    setSelectedCertificate(undefined);
    setSelectedPrivateKey(undefined);
    setSelectedCACertificate(undefined);
  };

  const onCertificateChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, FileSetters.Certificate);

  const onPrivateKeyChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, FileSetters.PrivateKey);

  const onCACertificateChange = (acceptedFiles: File[]) =>
    onFileChange(acceptedFiles, FileSetters.CACertificate);

  const certificateTextValue = selectedCertificate?.path ?? '';
  const privateKeyTextValue = selectedPrivateKey?.path ?? '';
  const caCertificateTextValue = selectedCACertificate?.path ?? '';

  const values = {
    certificate: certificateTextValue,
    privateKey: privateKeyTextValue,
    caCertificate: caCertificateTextValue,
  };

  return {
    open,
    closeModal,
    onCertificateChange,
    onPrivateKeyChange,
    onCACertificateChange,
    values,
    clear,
    openCancelModal,
  };
};
