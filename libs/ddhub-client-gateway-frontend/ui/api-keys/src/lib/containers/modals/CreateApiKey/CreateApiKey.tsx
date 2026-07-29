import { FC } from 'react';
import { DateTime } from 'luxon';

import {
  DialogContent,
  DialogActions,
  Box,
  DialogTitle,
  InputLabel,
  Typography,
} from '@mui/material';
import {
  Button,
  CloseButton,
  CopyToClipboard,
  Dialog,
  DialogSubTitle,
  TextField,
  DatePicker,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useCreateApiKeyEffects } from './CreateApiKey.effects';
import { useStyles } from './CreateApiKey.styles';

export const CreateApiKey: FC = () => {
  const { classes } = useStyles();
  const {
    closeModal,
    open,
    openUpdate,
    openCancelModal,
    createApiKey,
    isSaving,
    buttonDisabled,
    expiryDate,
    expiryDateChangeHandler,
    labelInput,
    labelInputChangeHandler,
    isDirty,
    isDateDirty,
    apiKey,
  } = useCreateApiKeyEffects();

  return (
    <Dialog
      open={open || openUpdate}
      onClose={closeModal}
      paperClassName={classes.paper}
    >
      <DialogTitle className={classes.title}>
        {openUpdate ? 'Update' : 'New'} API Key
      </DialogTitle>
      <DialogSubTitle>
        {openUpdate ? 'Update your API key information.' : 'Fill out the form below to generate a new API key.'}
      </DialogSubTitle>
      { !openUpdate && (
        <DialogSubTitle>
            Provide a label to identify the key and specify the expiration date.
        </DialogSubTitle>
      )}

      <DialogContent sx={{ padding: 0 }}>
        <Box mt={5.7}>
          <Box pb={4}>
            <InputLabel className={classes.label}>Label</InputLabel>
            <TextField
              autoComplete="off"
              fullWidth
              variant={'outlined'}
              value={labelInput}
              placeholder="Label"
              inputProps={{
                minLength: 5,
                maxLength: 256
              }}
              onChange={(event) => {
                labelInputChangeHandler(event.target.value);
              }}
              error={isDirty && (!labelInput || labelInput.length < 5)}
              helperText={
                isDirty && !labelInput 
                  ? 'Label is required' 
                  : isDirty && labelInput.length < 5 
                    ? 'Label min length of 5 characters'
                    : ''
              }
            />
          </Box>
        </Box>
        <Box pb={4}>
          <InputLabel className={classes.label}>Expiry Date</InputLabel>
          <DatePicker
            inputDate={expiryDate}
            onChange={expiryDateChangeHandler}
            isDirty={isDateDirty}
            error={isDateDirty && !expiryDate ? 'Expiry date is required' : ''}
            minDate={DateTime.now().plus({ days: 1 })}
          />
        </Box>
        { openUpdate && (
          <Box>
            <InputLabel className={classes.label}>API Key</InputLabel>
            <Box display="flex" alignItems="center" bgcolor="#31374B" py={1} px={1.5} borderRadius={1} justifyContent={'space-between'}>
              <Typography variant="body2">{apiKey}</Typography>
              <CopyToClipboard text={apiKey} />
            </Box>
          </Box>
        )}
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
            type="submit"
            loading={isSaving}
            disabled={buttonDisabled}
            onClick={createApiKey}
          >
            {openUpdate ? 'Update' : 'Generate API Key'}
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