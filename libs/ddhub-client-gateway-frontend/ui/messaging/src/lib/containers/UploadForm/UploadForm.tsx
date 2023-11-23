import { FC } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { UploadInput } from '@ddhub-client-gateway-frontend/ui/core';
import { TFileType } from './UploadForm.types';
import { useUploadFormEffects } from './UploadForm.effects';
import { useStyles } from './UploadForm.styles';
import clsx from 'clsx';

export interface UploadFormProps {
  acceptedFiles: File[];
  acceptedFileType: TFileType;
  maxFileSize: number;
  onFileChange: (acceptedFiles: File[]) => void;
  fileSizeInfo?: string;
  wrapperProps?: BoxProps;
}

export const UploadForm: FC<UploadFormProps> = ({
  onFileChange,
  acceptedFiles,
  wrapperProps,
  acceptedFileType,
  maxFileSize,
  fileSizeInfo,
}) => {
  const { classes } = useStyles();
  const { fileTextValue } = useUploadFormEffects({
    acceptedFiles,
  });

  return (
    <Box className={classes.wrapper} {...wrapperProps}>
      <Box
        display="flex"
        flexDirection="column"
        mb={2.5}
        sx={{ minHeight: '44px' }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography
            className={clsx(classes.title, {
              [classes.titleDisabled]: !acceptedFileType,
            })}
            variant="body1"
          >
            Upload {acceptedFileType ? acceptedFileType.toUpperCase() : 'file'}
          </Typography>
          {acceptedFileType && (
            <Typography className={classes.label} variant="body2">
              {fileSizeInfo}
            </Typography>
          )}
        </Box>
      </Box>
      <Box>
        <UploadInput
          uploadBox={true}
          acceptedFileType={acceptedFileType}
          value={fileTextValue}
          onChange={onFileChange}
          maxSize={maxFileSize}
          isUploadDisabled={!acceptedFileType}
          wrapperProps={{
            className: clsx(classes.uploadWrapper, {
              [classes.uploadWrapperDisabled]: !acceptedFileType,
              [classes.uploadWrapperHover]: acceptedFileType,
              [classes.uploadedWrapperHover]: acceptedFileType && fileTextValue,
            }),
          }}
        />
      </Box>
    </Box>
  );
};
