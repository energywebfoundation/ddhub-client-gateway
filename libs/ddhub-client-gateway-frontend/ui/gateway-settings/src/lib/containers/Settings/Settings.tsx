import { FC } from 'react';
import { Grid } from '@mui/material';
import { OutboundCertificate } from '../OutboundCertificate';
import { GatewayIdentity } from '../GatewayIdentity';

export const Settings: FC = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <GatewayIdentity />
      </Grid>
      <Grid item xs={6}>
        <OutboundCertificate />
      </Grid>
    </Grid>
  );
};
