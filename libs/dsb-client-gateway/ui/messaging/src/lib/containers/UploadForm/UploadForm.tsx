import { FC } from 'react';
import { Box, BoxProps, Grid, Typography, Button } from '@mui/material';
import { TextField } from '@dsb-client-gateway/ui/core';
import { useUploadFormEffects } from './UploadForm.effects';
import { useStyles } from './UploadForm.styles';

const bytesToMegaBytes = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

export interface UploadFormProps {
  acceptedFiles: File[];
  onFileChange: (acceptedFiles: File[]) => void;
  wrapperProps?: BoxProps;
}

export const UploadForm: FC<UploadFormProps> = ({
  onFileChange,
  acceptedFiles,
  wrapperProps,
}) => {
  const { classes } = useStyles();
  const { open, files, fileTextValue } = useUploadFormEffects({
    onFileChange,
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
              {files?.map((file) => {
                return (
                  <Box key={file.name} display="flex" flexDirection="column">
                    <Typography variant="body1">File:</Typography>
                    <Typography variant="body2">
                      JSON size {bytesToMegaBytes(file.size)}mb.
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <TextField
              placeholder="Choose a file"
              className={classes.input}
              value={fileTextValue}
              disabled
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    component="span"
                    className={classes.button}
                    size="large"
                    color="primary"
                    onClick={open}
                  >
                    <Typography className={classes.buttonText} variant="body2">
                      Browse
                    </Typography>
                  </Button>
                ),
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
