import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { FormInput } from '@ddhub-client-gateway-frontend/ui/core';
import { useLoginFormEffects } from './LoginForm.effects';
import { useStyles } from '../Login.styles';
import {
  CreateIdentityDto,
  LoginRequestDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface LoginFormProps {
  authEnabled: boolean;
  submitHandler:
    | ((data: CreateIdentityDto) => void)
    | ((data: LoginRequestDto) => void);
  isLoading: boolean;
}

export function LoginForm(props: LoginFormProps) {
  const { isLoading } = props;
  const loginForm = useLoginFormEffects(props);
  const { theme, classes } = useStyles();

  return isLoading ? (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress size={17} sx={{ color: theme.palette.common.white }} />
    </Box>
  ) : (
    <form style={{ minWidth: 342 }} onSubmit={loginForm.onSubmit}>
      {loginForm.fields.map((field) => (
        <Box key={field.name} className={classes.inputWrapper}>
          <FormInput
            variant="outlined"
            field={field}
            register={loginForm.register}
            errorText={loginForm.errors[field.name]?.message}
          />
        </Box>
      ))}
      <Button
        className={classes.submitBtn}
        variant="contained"
        color="primary"
        sx={{ marginTop: '26px' }}
        onClick={loginForm.onSubmit}
        disabled={loginForm.buttonDisabled}
        fullWidth
      >
        <Typography className={classes.submitBtnText} variant="body2">
          {loginForm.buttonText}
        </Typography>
      </Button>
    </form>
  );
}

export default LoginForm;
