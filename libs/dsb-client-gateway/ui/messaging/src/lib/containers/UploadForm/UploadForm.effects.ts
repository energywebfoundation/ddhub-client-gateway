import { useDropzone, FileWithPath } from 'react-dropzone';
import { UploadFormProps } from './UploadForm';

export const useUploadFormEffects = ({ onFileChange }: UploadFormProps) => {
  const { open, acceptedFiles } = useDropzone({
    onDrop: onFileChange,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: 50000000,
    multiple: false,
    accept: {
      'application/JSON': ['.json'],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => file);

  const fileTextValue = files[0]?.path ?? '';

  return {
    open,
    files,
    fileTextValue,
  };
};
