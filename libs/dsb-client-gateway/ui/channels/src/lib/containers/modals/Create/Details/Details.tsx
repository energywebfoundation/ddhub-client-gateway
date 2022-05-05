import { Grid } from '@mui/material';
import { FormInput, FormRadio } from '@dsb-client-gateway/ui/core';
import { SubmitButton } from '../SubmitButton';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

export interface DetailsProps {
  nextClick: (data) => void;
}

export const Details = ({ nextClick }: DetailsProps) => {
  const { classes } = useStyles();
  const { register, fields, handleSubmit, isValid, control } =
    useDetailsEffects();

  return (
    <form className={classes.form}>
      <Grid container direction="column" justifyContent="space-between">
        <Grid item className={classes.formContent}>
          <FormRadio
            control={control}
            field={fields.channelType}
            formControlLabelProps={{
              style: { marginRight: 33 },
            }}
          />
          <FormRadio
            control={control}
            field={fields.connectionType}
            formControlLabelProps={{
              style: { marginRight: 36 },
            }}
          />

          <FormInput
            field={fields.fqcn}
            register={register}
            control={control}
            variant="outlined"
          />
        </Grid>
        <Grid item alignSelf="flex-end">
          <SubmitButton disabled={!isValid} onClick={handleSubmit(nextClick)}>
            Next
          </SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
};
