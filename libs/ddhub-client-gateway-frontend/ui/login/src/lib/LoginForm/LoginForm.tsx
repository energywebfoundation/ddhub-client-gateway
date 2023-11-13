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
  userIsAuthenticated: boolean;
  privateKeySubmitHandler: (data: CreateIdentityDto) => void;
  userLoginSubmitHandler: (data: LoginRequestDto) => void;
  isLoading: boolean;
}

export function LoginForm(props: LoginFormProps) {
  const { isLoading } = props;
  const { theme, classes } = useStyles();
  const loginForm = useLoginFormEffects(props);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loginForm.onSubmit();
    }
  };

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
    <form
      style={{ minWidth: 342 }}
      onKeyDown={handleKeyDown}
      onSubmit={loginForm.onSubmit}
    >
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
