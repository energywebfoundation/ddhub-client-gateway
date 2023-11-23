import { FC } from 'react';
import { Box, BoxProps, Typography, Button, InputLabel } from '@mui/material';
import {
  TextField,
  FileUploadPartial,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useUploadInputEffects } from './UploadInput.effects';
import { useStyles } from './UploadInput.styles';
import { TFileType } from './UploadInput.types';
import { Upload, X } from 'react-feather';
import clsx from 'clsx';

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
  uploadBox?: boolean;
  isUploadDisabled?: boolean;
}

export const UploadInput: FC<UploadInputProps> = (props) => {
  const { classes } = useStyles();
  const { open, getRootProps, getInputProps, isValidFileType } =
    useUploadInputEffects(props);

  const chooseFileBox = (
    <>
      <Upload
        className={clsx(classes.icon, {
          [classes.iconDisabled]: props.isUploadDisabled,
        })}
      ></Upload>
      <Typography
        variant="body2"
        paddingTop={4.6}
        className={clsx(classes.subtitle, {
          [classes.subtitleDisabled]: props.isUploadDisabled,
        })}
      >
        <strong>Drag and drop</strong> or browse to choose a file
      </Typography>
    </>
  );

  const invalidFileBox = (
    <>
      <X className={`${classes.icon} ${classes.iconInvalidFile}`}></X>
      <Typography variant="body2" className={classes.subtitle} paddingTop={3}>
        <strong>Upload failed:</strong> File not allowed
      </Typography>
    </>
  );

  const fileUploadedView = (
    <>
      <Box className={classes.iconFile} id="upload-icon">
        <FileUploadPartial />
      </Box>
      <Typography
        variant="body2"
        className={classes.subtitle}
        marginTop={-0.625}
      >
        {props.value}
      </Typography>
      <Typography
        variant="body2"
        className={classes.subtitle}
        paddingTop={2.875}
        id="upload-message"
      >
        Upload complete!
      </Typography>
      <Typography
        variant="body2"
        className={classes.subtitle}
        paddingTop={2.875}
        id="replace-message"
      >
        <strong>Drag and drop</strong> or browse to replace this file
      </Typography>
    </>
  );

  const noFileView = isValidFileType ? chooseFileBox : invalidFileBox;

  const boxView = (
    <Box display="flex" flexDirection="column" justifyContent="center">
      {props.value ? fileUploadedView : noFileView}
    </Box>
  );

  const inputView = (
    <TextField
      autoComplete="off"
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
  );

  return (
    <Box {...props?.wrapperProps} {...getRootProps()}>
      {props?.label && (
        <InputLabel className={classes.label}>{props.label}</InputLabel>
      )}

      <input {...getInputProps()} />
      {props?.uploadBox ? boxView : inputView}
    </Box>
  );
};
