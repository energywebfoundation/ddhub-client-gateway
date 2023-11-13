import { IconButton, Typography } from '@mui/material';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { useStyles } from './Header.styles';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { useContext } from 'react';
import { UserContext } from '@ddhub-client-gateway-frontend/ui/login';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { LogOut } from 'react-feather';

export function Header() {
  const Swal = useCustomAlert();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('Header must be rendered within a UserContext provider');
  }

  const { classes } = useStyles();
  const {
    config: { did, authEnabled },
  } = useGatewayConfig();

  const openLogoutModal = async () => {
    const result = await Swal.warning({
      title: 'Are you sure you want to logout?',
      text: 'You will be redirected to the login page',
    });

    if (result.isConfirmed) {
      userContext.setUserAuth(null);
      userContext.resetAuthData();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="body2" className={classes.did}>
          {didFormatMinifier(did)}
        </Typography>
        <Typography variant="body2" className={classes.client}>
          Client gateway
        </Typography>
      </div>
      <div className={classes.avatar}>
        <img
          src="/icons/online-status.svg"
          alt="online status icon"
          className={classes.status}
        />
      </div>
      {authEnabled && userContext.authenticated && (
        <div className={classes.logoutButton}>
          <IconButton onClick={() => openLogoutModal()}>
            <LogOut className={classes.logoutButtonIcon} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default Header;
