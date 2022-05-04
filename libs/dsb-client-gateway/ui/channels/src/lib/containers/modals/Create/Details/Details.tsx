import { Button, Grid } from '@mui/material';
import { useDetailsEffects } from './Details.effects';
import { FormInput, FormRadio } from '@dsb-client-gateway/ui/core';
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
      <Grid
        container
        direction="column"
        spacing={2}
        justifyContent="space-between"
      >
        <Grid item className={classes.formContent}>
          <FormRadio
            register={register}
            control={control}
            field={fields.channelType}
          />
          <FormRadio
            register={register}
            control={control}
            field={fields.connectionType}
          />

          <FormInput
            field={fields.fqcn}
            register={register}
            control={control}
            variant="outlined"
          />
        </Grid>
        <Grid item alignSelf="flex-end" className={classes.buttonContainer}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
            onClick={handleSubmit(nextClick)}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
