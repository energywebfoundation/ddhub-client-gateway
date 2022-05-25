import { useDropzone } from 'react-dropzone';
import { UploadInputProps } from './UploadInput';
import { acceptedFileTypes } from './UploadInput.utils';

export const useUploadInputEffects = ({
  acceptedFileType,
  onChange,
  maxSize = Infinity,
  maxFiles = 1,
  multiple = false
}: Omit<UploadInputProps, 'value'>) => {
  const fileType = acceptedFileTypes[acceptedFileType];

  const { open } = useDropzone({
    onDrop: onChange,
    noClick: true,
    noKeyboard: true,
    maxFiles,
    maxSize,
    multiple,
    accept: fileType,
  });

  return {
    open,
  };
};
