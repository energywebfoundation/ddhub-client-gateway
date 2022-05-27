import { FC } from 'react';
import { Box, BoxProps, Grid, Typography } from '@mui/material';
import { UploadInput } from '@ddhub-client-gateway-frontend/ui/core';
import { TFileType } from './UploadForm.types';
import { useUploadFormEffects } from './UploadForm.effects';
import { useStyles } from './UploadForm.styles';

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
      <Grid container>
        <Grid item sx={{ minWidth: 183 }}>
          <Typography className={classes.label} variant="body1">
            Upload file
          </Typography>
        </Grid>
        <Grid item>
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              mt={3.8}
              mb={4.1}
              sx={{ minHeight: '44px' }}
            >
              {acceptedFileType && (
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1">File:</Typography>
                  <Typography variant="body2">{fileSizeInfo}</Typography>
                </Box>
              )}
            </Box>
            <UploadInput
              acceptedFileType={acceptedFileType}
              value={fileTextValue}
              onChange={onFileChange}
              maxSize={maxFileSize}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
