import { Typography } from '@mui/material';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { useStyles } from './Header.styles';
import { useGatewayConfig } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export function Header() {
  const { classes } = useStyles();
  const {
    config: { did },
  } = useGatewayConfig();

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
    </div>
  );
}

export default Header;
