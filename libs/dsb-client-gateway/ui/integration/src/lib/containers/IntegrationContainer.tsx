import { Grid } from '@mui/material';
import React from 'react';
import { ApiBox } from '../components/ApiBox';
import { RestApi, WebSocketApi } from '@dsb-client-gateway/ui/core';
import { useIntegrationContainerEffects } from './IntegrationContainer.effects';

export const IntegrationContainer = () => {
  const { websocketApiUrl, restApiUrl } = useIntegrationContainerEffects();
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <ApiBox
          title="REST API"
          icon={<RestApi />}
          url={restApiUrl}
          subtitle="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
consectetur."
        />
      </Grid>
      <Grid item xs={6}>
        <ApiBox
          title="Web Socket API"
          icon={<WebSocketApi />}
          url={websocketApiUrl}
          subtitle="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
consectetur."
        />
      </Grid>
    </Grid>
  );
};
