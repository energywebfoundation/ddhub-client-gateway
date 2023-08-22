import {
  FormControlLabel,
  Grid,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { FormInput, FormRadio } from '@ddhub-client-gateway-frontend/ui/core';
import { ActionButton } from '../ActionButton';
import { ICreateChannel } from '../../models/create-channel.interface';
import { useDetailsEffects } from './Details.effects';
import { useStyles, CheckSwitch } from './Details.styles';

export interface DetailsProps {
  nextClick: (data) => void;
  channelValues: ICreateChannel;
  validFqcn: boolean;
}

export const Details = ({
  nextClick,
  channelValues,
  validFqcn,
}: DetailsProps) => {
  const { classes } = useStyles();
  const {
    register,
    fields,
    handleSubmit,
    isValid,
    control,
    connectionOnChange,
    showEncryption,
    encryptionOnChange,
    isEncrypt,
    isUseAnonExtChnl,
    isEnableMsgForm,
    useAnonExtChnlOnChange,
    enableMsgFormOnChange,
    showMsgForm,
    channelTypeOnChange,
  } = useDetailsEffects(channelValues);

  return (
    <form className={classes.form}>
      <Grid container direction="column" justifyContent="space-between">
        <Grid item className={classes.formContent}>
          <FormRadio
            control={control}
            field={fields.channelType}
            formControlLabelProps={{
              style: { marginRight: 33 },
              onChange: channelTypeOnChange,
            }}
          />
          <FormRadio
            control={control}
            field={fields.connectionType}
            formControlLabelProps={{
              style: { marginRight: 36 },
              onChange: connectionOnChange,
            }}
          />

          <FormInput
            field={fields.fqcn}
            register={register}
            control={control}
            variant="outlined"
            errorExists={!validFqcn}
            errorText={
              !validFqcn &&
              `Should contain only alphanumeric lowercase characters, use . as a separator.`
            }
          />

          <Divider className={classes.divider} />

          <Box className={classes.switchWrapper}>
            <Box className={classes.switchBox}>
              <FormControlLabel
                className={classes.switchLabel}
                control={
                  <CheckSwitch
                    id={fields.useAnonymousExtChannel.name}
                    checked={isUseAnonExtChnl}
                    name={fields.useAnonymousExtChannel.name}
                    onChange={useAnonExtChnlOnChange}
                    color="primary"
                  />
                }
                labelPlacement="start"
                id={fields.useAnonymousExtChannel.name}
                name={fields.useAnonymousExtChannel.name}
                label={fields.useAnonymousExtChannel.label}
                {...register(fields.useAnonymousExtChannel.name)}
              />
            </Box>
            <Typography className={classes.switchDesc}>
              {fields.useAnonymousExtChannel.description}
            </Typography>
          </Box>

          {showEncryption && (
            <Box className={classes.switchWrapper}>
              <Box className={classes.switchBox}>
                <FormControlLabel
                  className={classes.switchLabel}
                  control={
                    <CheckSwitch
                      id={fields.payloadEncryption.name}
                      checked={isEncrypt}
                      name={fields.payloadEncryption.name}
                      onChange={encryptionOnChange}
                      color="primary"
                    />
                  }
                  labelPlacement="start"
                  id={fields.payloadEncryption.name}
                  name={fields.payloadEncryption.name}
                  label={fields.payloadEncryption.label}
                  {...register(fields.payloadEncryption.name)}
                />
              </Box>
              <Typography className={classes.switchDesc}>
                {fields.payloadEncryption.description}
              </Typography>
            </Box>
          )}

          {showMsgForm && (
            <Box className={classes.switchWrapper}>
              <Box className={classes.switchBox}>
                <FormControlLabel
                  className={classes.switchLabel}
                  control={
                    <CheckSwitch
                      id={fields.enableMessageForm.name}
                      checked={isEnableMsgForm}
                      name={fields.enableMessageForm.name}
                      onChange={enableMsgFormOnChange}
                      color="primary"
                    />
                  }
                  labelPlacement="start"
                  id={fields.enableMessageForm.name}
                  name={fields.enableMessageForm.name}
                  label={fields.enableMessageForm.label}
                  {...register(fields.enableMessageForm.name)}
                />
              </Box>
              <Typography className={classes.switchDesc}>
                {fields.enableMessageForm.description}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid
          item
          alignSelf="flex-end"
          sx={{ paddingRight: '7px', paddingBottom: '27px' }}
        >
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
