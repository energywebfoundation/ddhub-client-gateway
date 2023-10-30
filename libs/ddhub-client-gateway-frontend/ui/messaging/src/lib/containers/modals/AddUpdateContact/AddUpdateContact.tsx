import React, { FC } from 'react';
import {
  DialogContent,
  DialogActions,
  Box,
  DialogTitle,
  InputLabel,
} from '@mui/material';
import {
  Button,
  CloseButton,
  Dialog,
  DialogSubTitle,
  TextField,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useAddUpdateContactEffects } from './AddUpdateContact.effects';
import { useStyles } from './AddUpdateContact.styles';

export const AddUpdateContact: FC = () => {
  const { classes } = useStyles();
  const {
    closeModal,
    open,
    openUpdate,
    openCancelModal,
    createUpdateContact,
    clear,
    isSaving,
    buttonDisabled,
    didInput,
    aliasInput,
    didInputChangeHandler,
    aliasInputChangeHandler,
    isValid,
    isDirty,
  } = useAddUpdateContactEffects();

  return (
    <Dialog
      open={open || openUpdate}
      onClose={closeModal}
      paperClassName={classes.paper}
    >
      <DialogTitle className={classes.title}>
        {openUpdate ? 'Update' : 'Add'} DID
      </DialogTitle>
      <DialogSubTitle>
        {openUpdate ? 'Update' : 'Provide'} data with this form
      </DialogSubTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Box mt={5.7}>
          <Box pb={4}>
            <InputLabel className={classes.label}>Alias</InputLabel>
            <TextField
              autoComplete="off"
              fullWidth
              variant={'outlined'}
              value={aliasInput}
              placeholder="E.g. Name"
              onChange={(event) => {
                aliasInputChangeHandler(event.target.value);
              }}
              error={isDirty && !aliasInput}
              helperText={isDirty && !aliasInput ? 'Alias is required' : ''}
            />
          </Box>
          <Box>
            <InputLabel className={classes.label}>DID</InputLabel>
            <TextField
              autoComplete="off"
              fullWidth
              variant={'outlined'}
              value={didInput}
              disabled={openUpdate}
              placeholder="E.g. did:ethr:volta:0x09Df...46993"
              onChange={(event) => {
                didInputChangeHandler(event.target.value);
              }}
              error={!isValid}
              helperText={!isValid ? 'DID format is invalid' : ''}
            />
          </Box>
        </Box>
        <Box
          mt={8}
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
          <Button
            type="submit"
            loading={isSaving}
            disabled={buttonDisabled}
            onClick={createUpdateContact}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Box className={classes.closeButtonWrapper}>
          <CloseButton onClose={closeModal} />
        </Box>
      </DialogActions>
    </Dialog>
  );
};
