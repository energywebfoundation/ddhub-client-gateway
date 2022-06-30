import { FC } from 'react';
import { Box, BoxProps, Typography, Button, InputLabel } from '@mui/material';
import { TextField } from '@ddhub-client-gateway-frontend/ui/core';
import { useUploadInputEffects } from './UploadInput.effects';
import { useStyles } from './UploadInput.styles';
import { TFileType } from './UploadInput.types';

export interface UploadInputProps {
  value: string;
  onChange: (acceptedFiles: File[]) => void;
  acceptedFileType: TFileType;
  label?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  placeholder?: string;
  wrapperProps?: BoxProps;
}

export const UploadInput: FC<UploadInputProps> = (props) => {
  const { classes } = useStyles();
  const { open, getRootProps, getInputProps } = useUploadInputEffects(props);
  
  return (
    <Box {...props?.wrapperProps} {...getRootProps()}>
      {props?.label && (
        <InputLabel className={classes.label}>{props.label}</InputLabel>
      )}

      <input {...getInputProps()} />
      <TextField
        placeholder={props?.placeholder ?? 'Choose a file'}
        className={classes.input}
        value={props.value}
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
              disabled={!props.acceptedFileType}
            >
              <Typography className={classes.buttonText} variant="body2">
                Browse
              </Typography>
            </Button>
          ),
        }}
      />
    </Box>
  );
};
