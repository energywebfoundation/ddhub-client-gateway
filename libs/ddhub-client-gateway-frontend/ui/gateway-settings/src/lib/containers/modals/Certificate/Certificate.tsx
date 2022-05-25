import { FC } from 'react';
import {
  Dialog,
  DialogSubTitle,
  CloseButton,
  UploadInput,
  FileTypesEnum,
  Button,
} from '@ddhub-client-gateway-frontend/ui/core';
import { DialogTitle, Box } from '@mui/material';
import { useCertificateEffects } from './Certificate.effects';
import { useStyles } from './Certificate.styles';

export const Certificate: FC = () => {
  const { classes } = useStyles();
  const {
    open,
    onCertificateChange,
    onPrivateKeyChange,
    onCACertificateChange,
    openCancelModal,
    values,
    clear,
  } = useCertificateEffects();
  return (
    <Dialog
      open={open}
      onClose={openCancelModal}
      paperClassName={classes.paper}
    >
      <DialogTitle className={classes.title}>Outbound Certificate</DialogTitle>
      <DialogSubTitle>add or update certificates, private key</DialogSubTitle>
      <Box mt={5.7}>
        <UploadInput
          label="Certificate"
          acceptedFileType={FileTypesEnum.PEM}
          value={values.certificate}
          onChange={onCertificateChange}
          wrapperProps={{ mb: 3.6 }}
        />
        <UploadInput
          label="Private Key"
          acceptedFileType={FileTypesEnum.KEY}
          value={values.privateKey}
          onChange={onPrivateKeyChange}
          wrapperProps={{ mb: 3.6 }}
        />
        <UploadInput
          label="CA Certificate (Optional)"
          acceptedFileType={FileTypesEnum.CRT}
          value={values.caCertificate}
          onChange={onCACertificateChange}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        flexGrow={1}
      >
        <Button
          variant="outlined"
          secondary
          style={{ marginRight: 20 }}
          onClick={openCancelModal}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          secondary
          style={{ marginRight: 20 }}
          onClick={clear}
        >
          Clear
        </Button>
        <Button>Save</Button>
      </Box>
      <Box className={classes.closeButtonWrapper}>
        <CloseButton onClose={openCancelModal} />
      </Box>
    </Dialog>
  );
};
