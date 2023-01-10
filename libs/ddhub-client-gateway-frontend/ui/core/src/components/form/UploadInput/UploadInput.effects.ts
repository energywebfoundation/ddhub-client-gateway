import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadInputProps } from './UploadInput';
import { acceptedFileTypes } from './UploadInput.utils';

export const useUploadInputEffects = ({
  acceptedFileType,
  onChange,
  maxSize = Infinity,
  maxFiles = 1,
  multiple = false,
  uploadBox = false,
}: Omit<UploadInputProps, 'value'>) => {
  const fileType = acceptedFileTypes[acceptedFileType];
  const [isValidFileType, setIsValidFileType] = useState(true);

  const fileTypeValidator = (file: any) => {
    if (file.name && !file.type.includes(acceptedFileType)) {
      setIsValidFileType(false);
    } else {
      setIsValidFileType(true);
    }

    return null;
  };

  const { open, getRootProps, getInputProps } = useDropzone({
    onDrop: onChange,
    noClick: !uploadBox,
    noKeyboard: true,
    maxFiles,
    maxSize,
    multiple,
    accept: fileType,
    disabled: !acceptedFileType,
    validator: fileTypeValidator,
  });

  return {
    open,
    getRootProps,
    getInputProps,
    isValidFileType,
  };
};
