import { useDropzone, FileWithPath } from 'react-dropzone';
import { UploadFormProps } from './UploadForm';
import { acceptedFileTypes } from './UploadForm.utils';

export const useUploadFormEffects = ({
  onFileChange,
  acceptedFiles,
  acceptedFileType,
  maxFileSize,
}: UploadFormProps) => {
  const fileType = acceptedFileTypes[acceptedFileType];

  const { open } = useDropzone({
    onDrop: onFileChange,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: maxFileSize,
    multiple: false,
    accept: fileType,
  });

  const files = acceptedFiles?.map((file: FileWithPath) => file);

  const fileTextValue = files[0]?.path ?? '';

  return {
    open,
    fileTextValue,
  };
};
