import { Grid } from '@mui/material';
import React from 'react';
import { ApiBox } from '../components/ApiBox';
import {
  IeeeApi,
  RestApi,
  WebSocketApi,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useIntegrationContainerEffects } from './IntegrationContainer.effects';

export const IntegrationContainer = () => {
  const { websocketApiUrl, restApiUrl } = useIntegrationContainerEffects();
  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <ApiBox
          title="REST API"
          icon={<RestApi />}
          url={restApiUrl}
          subtitle="Web APIs conforming to the REST architectural style of Open API standards."
          isNextLink={false}
        />
      </Grid>
      <Grid item xs={6}>
        <ApiBox
          title="Web Socket API"
          icon={<WebSocketApi />}
          url={websocketApiUrl}
          subtitle="Enables two-way interactive communication session (publish/subscribe) between senders and receivers."
          isNextLink={true}
        />
      </Grid>
      <Grid item xs={6}>
        <ApiBox
          title="IEEE 2030.5"
          icon={<IeeeApi />}
          url={websocketApiUrl}
          subtitle="A standard for communications between the smart grid and consumers."
          isNextLink={false}
          customLabel="Coming soon"
        />
      </Grid>
    </Grid>
  );
};
