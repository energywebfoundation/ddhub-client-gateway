import { useStyles } from './RestrictionSelect.styles';
import { Box, Button, Grid, InputLabel, Typography } from '@mui/material';
import { FormRadioBox } from '@ddhub-client-gateway-frontend/ui/core';
import {
  RestrictionSelectEffectsProps,
  useRestrictionSelectEffects,
} from './RestrictionSelect.effects';
import { RestrictionType } from '../models/restriction-type.enum';
import {
  DIDSource,
  RestrictionFieldNames,
} from '../effects/didRestriction.effects';

export interface RestrictionSelectProps extends RestrictionSelectEffectsProps {
  handleClose: () => void;
  roleInput: string;
  isRoleValid: boolean;
  didInput: string;
  isDIDValid: boolean;
  children: React.ReactNode;
  didRestrictionValues: (value: string) => any;
}

export const RestrictionSelect = ({
  setType,
  clear,
  handleClose,
  handleSaveRestriction,
  handleUpdateRestriction,
  roleInput,
  isRoleValid,
  didInput,
  isDIDValid,
  children,
  selectedType,
  didRestrictionValues,
  inputValue,
}: RestrictionSelectProps) => {
  const { classes } = useStyles();
  const {
    handleKeyDown,
    control,
    fields,
    selectedRestrictionType,
    handleSubmitForm,
  } = useRestrictionSelectEffects({
    setType,
    clear,
    selectedType,
    handleSaveRestriction,
    handleUpdateRestriction,
    inputValue,
  });

  return (
    <form className={classes.form}>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        onKeyDown={handleKeyDown}
      >
        <Grid item className={classes.formContent}>
          <FormRadioBox
            control={control}
            field={fields.restrictionType}
            formControlLabelProps={{
              style: { marginRight: 33 },
            }}
          />
        </Grid>
        <Grid item flexGrow="1">
          {selectedRestrictionType && (
            <>
              {selectedRestrictionType === RestrictionType.Role && (
                <InputLabel className={classes.label}>
                  {selectedRestrictionType}
                </InputLabel>
              )}
              {children}
            </>
          )}

          <Grid
            item
            alignSelf="flex-end"
            width="100%"
            sx={{ paddingTop: '23px', paddingRight: '7px' }}
          >
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="outlined"
                className={classes.cancelButton}
                onClick={handleClose}
              >
                <Typography className={classes.buttonText} variant="body2">
                  Cancel
                </Typography>
              </Button>
              <Button
                variant="contained"
                className={classes.saveButton}
                type="submit"
                onClick={handleSubmitForm}
                disabled={
                  (didRestrictionValues(RestrictionFieldNames.DID_SOURCE) ===
                    DIDSource.MANUAL_INPUT &&
                    !isDIDValid) ||
                  !isRoleValid ||
                  (!didInput &&
                    !roleInput &&
                    !didRestrictionValues(
                      RestrictionFieldNames.ADDRESS_BOOK,
                    )) ||
                  (didRestrictionValues(RestrictionFieldNames.DID_SOURCE) ===
                    DIDSource.ADDRESS_BOOK &&
                    !didRestrictionValues(RestrictionFieldNames.ADDRESS_BOOK))
                }
              >
                <Typography className={classes.buttonTextSave} variant="body2">
                  {selectedType ? 'Update' : 'Save'}
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
