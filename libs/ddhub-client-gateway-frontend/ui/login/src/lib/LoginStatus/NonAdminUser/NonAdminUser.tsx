import { Typography, Stack, Box, darken, Button } from '@mui/material';
import { Info } from 'react-feather';
import RefreshAccountStatus from '../RefreshAccountStatus/RefreshAccountStatus';
import { makeStyles } from 'tss-react/mui';
import { useUserDataEffects } from '../../UserData.effects';

export const NonAdminUser = () => {
  const { userAuthLogout } = useUserDataEffects();
  const { classes } = useStyles();

  return (
    <Stack spacing={4} mt={2}>
      <Stack spacing={1} direction="row">
        <Info className={classes.icon} size={22} />
        <Stack>
          <Typography variant="body1">Setup Pending</Typography>
          <Typography variant="body2">
            Setup for this Client Gateway is not yet finalised. Please contact
            an administrator.
          </Typography>
          <Box mt={2}>
            <RefreshAccountStatus />
          </Box>
          <Button
            className={classes.submitBtn}
            variant="contained"
            color="primary"
            sx={{ marginTop: '20px', height: '37px' }}
            onClick={() => userAuthLogout()}
            fullWidth
          >
            <Typography variant="body2">Logout</Typography>
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NonAdminUser;

export const useStyles = makeStyles()((theme) => ({
  icon: {
    color: theme.palette.warning.main,
  },
  submitBtn: {
    textTransform: 'none',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: darken(theme.palette.primary.main, 0.2),
    },
  },
}));
