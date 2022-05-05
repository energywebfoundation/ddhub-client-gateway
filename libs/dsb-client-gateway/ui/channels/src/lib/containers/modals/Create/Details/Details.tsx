import { Button, Grid } from '@mui/material';
import { ChevronRight } from 'react-feather';
import { FormInput, FormRadio } from '@dsb-client-gateway/ui/core';
import { useDetailsEffects } from './Details.effects';
import { useStyles } from './Details.styles';

export interface DetailsProps {
  nextClick: (data) => void;
}

export const Details = ({ nextClick }: DetailsProps) => {
  const { classes, theme } = useStyles();
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
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid}
            onClick={handleSubmit(nextClick)}
            className={classes.button}
            classes={{ endIcon: classes.buttonIcon }}
            endIcon={
              <ChevronRight size={14} color={theme.palette.common.white} />
            }
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
