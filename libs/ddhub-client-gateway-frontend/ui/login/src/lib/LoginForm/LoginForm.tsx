import { Button, Typography, Box } from '@mui/material';
import { FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import { useLoginFormEffects } from './LoginForm.effects';
import { useStyles } from '../Login.styles';

export interface LoginFormProps {
  onPrivateKeySubmit: (privateKey: string) => void;
}

export function LoginForm(props: LoginFormProps) {
  const { register, onSubmit, errorMessage, field, buttonDisabled } =
    useLoginFormEffects(props);
  const { classes } = useStyles();

  return (
    <form style={{ minWidth: 342 }}>
      <Box className={classes.inputWrapper}>
        <FormInput
          variant="outlined"
          field={field}
          register={register}
          errorText={errorMessage}
        />
      </Box>
      <Button
        className={classes.submitBtn}
        variant="contained"
        color="primary"
        sx={{ marginTop: '26px' }}
        onClick={onSubmit}
        disabled={buttonDisabled}
        fullWidth
      >
        <Typography className={classes.submitBtnText} variant="body2">
          Import
        </Typography>
      </Button>
    </form>
  );
}

export default LoginForm;
