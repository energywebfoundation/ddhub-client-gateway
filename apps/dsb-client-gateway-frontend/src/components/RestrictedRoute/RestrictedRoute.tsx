import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useStyles } from './RestrictedRoute.styles';
import { WarningAmber } from '@mui/icons-material';

export const RestrictedRoute = () => {
  const { classes } = useStyles();
  const router = useRouter();
  return (
    <>
      <div className={classes.heading}>
        <WarningAmber className={classes.icon} fontSize="large" />
        <h1>Access Denied</h1>
      </div>
      <p>You don&apos;t have sufficient permissions to access this page.</p>
      <Button
        variant="outlined"
        className={classes.button}
        onClick={() => router.push('/dashboard')}
      >
        <Typography className={classes.buttonText} variant="body2">
          Go to Dashboard
        </Typography>
      </Button>
    </>
  );
};
