import { useStyles } from './AnonymousRecipientSelect.styles';
import { Box, Button, FormHelperText, Grid, InputLabel, Typography } from '@mui/material';
import { TextField } from '@ddhub-client-gateway-frontend/ui/core';
import { AnonymousRecipientSelectProps, useAnonymousRecipientSelectEffects } from './AnonymousRecipientSelect.effects';

export const AnonymousRecipientSelect = (
  {
    setRecipientInput,
    handleClose,
    handleSaveRecipient,
    handleUpdateRecipient,
    recipientInput,
    inputValue,
    isUpdate = false,
  }: AnonymousRecipientSelectProps) => {
  const { classes } = useStyles();
  const {
    handleKeyDown,
    handleSubmitForm,
    recipientInputChangeHandler,
    success,
  } = useAnonymousRecipientSelectEffects({
    setRecipientInput,
    handleSaveRecipient,
    handleUpdateRecipient,
    isUpdate,
    inputValue,
    handleClose,
    recipientInput,
  });

  return (
    <form className={classes.form} onSubmit={handleSubmitForm}>
      <Grid container direction="column" justifyContent="space-between" onKeyDown={handleKeyDown}>
        <Grid
          item
          flexGrow="1"
        >
          <InputLabel className={classes.label}>Association key</InputLabel>

          <TextField
            autoComplete='off'
            fullWidth
            variant={'outlined'}
            value={recipientInput}
            placeholder='e.g. 02600166e8'
            inputProps={{ maxLength: 255 }}
            onChange={(event) => {
              recipientInputChangeHandler(event.target.value);
            }}
          />

          { success && (
            <FormHelperText className={classes.helperText}>
              Added anonymous recipient
            </FormHelperText>
          )}

          <Grid item alignSelf="flex-end" width="100%" sx={{ paddingTop: '23px', paddingRight: '7px' }}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button variant="outlined" className={classes.cancelButton} onClick={handleClose}>
                <Typography className={classes.buttonText} variant="body2">
                  Close
                </Typography>
              </Button>
              <Button variant="contained" className={classes.saveButton} type="submit" disabled={!recipientInput}>
                <Typography className={classes.buttonTextSave} variant="body2">
                  { isUpdate ? 'Update' : 'Add' }
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
