import { FileWithPath } from 'react-dropzone';
import { UploadFormProps } from './UploadForm';

export const useUploadFormEffects = ({
  acceptedFiles,
}: Pick<UploadFormProps, 'acceptedFiles'>) => {
  const files = acceptedFiles?.map((file: FileWithPath) => file);

  const fileTextValue = files[0]?.path ?? '';

  return {
    fileTextValue,
  };
};
