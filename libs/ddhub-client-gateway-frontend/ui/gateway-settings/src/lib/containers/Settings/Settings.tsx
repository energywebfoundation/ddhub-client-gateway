import { FC } from 'react';
import { Grid } from '@mui/material';
import { OutboundCertificate } from '../OutboundCertificate';
import { GatewayIdentity } from '../GatewayIdentity';
import { IdentityRoles } from '../IdentityRoles';

export const Settings: FC = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6} minWidth={580}>
        <GatewayIdentity />
      </Grid>
      <Grid item xs={12} lg={6} minWidth={580}>
        <OutboundCertificate />
      </Grid>
      <Grid item xs={12} lg={6} minWidth={580}>
        <IdentityRoles />
      </Grid>
    </Grid>
  );
};
