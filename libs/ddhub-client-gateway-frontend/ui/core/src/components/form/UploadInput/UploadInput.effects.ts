import { useDropzone } from 'react-dropzone';
import { UploadInputProps } from './UploadInput';
import { acceptedFileTypes } from './UploadInput.utils';

export const useUploadInputEffects = ({
  acceptedFileType,
  maxSize,
  maxFiles,
  onChange,
}: Omit<UploadInputProps, 'value'>) => {
  const fileType = acceptedFileTypes[acceptedFileType];

  const { open } = useDropzone({
    onDrop: onChange,
    noClick: true,
    noKeyboard: true,
    maxFiles,
    maxSize,
    multiple: false,
    accept: fileType,
  });

  return {
    open,
  };
};
