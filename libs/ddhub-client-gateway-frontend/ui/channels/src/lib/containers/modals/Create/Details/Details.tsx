import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { FormInput, FormRadio } from "@ddhub-client-gateway-frontend/ui/core";
import { ActionButton } from "../ActionButton";
import { ICreateChannel } from "../../models/create-channel.interface";
import { useDetailsEffects } from "./Details.effects";
import { useStyles } from "./Details.styles";

export interface DetailsProps {
  nextClick: (data) => void;
  channelValues: ICreateChannel;
}

export const Details = ({ nextClick, channelValues }: DetailsProps) => {
  const { classes } = useStyles();
  const { register, fields, handleSubmit, isValid, control } =
    useDetailsEffects(channelValues);

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
          <FormControlLabel
            control={
              <Checkbox
                id={fields.payloadEncryption.name}
                name={fields.payloadEncryption.name}
                color="primary"
              />
            }
            id={fields.payloadEncryption.name}
            name={fields.payloadEncryption.name}
            label={fields.payloadEncryption.label}
            {...register(fields.payloadEncryption.name)}
          />
        </Grid>
        <Grid item alignSelf="flex-end">
          <ActionButton
            disabled={!isValid}
            showArrowIcon
            onClick={handleSubmit(nextClick)}
          >
            Next
          </ActionButton>
        </Grid>
      </Grid>
    </form>
  );
};
