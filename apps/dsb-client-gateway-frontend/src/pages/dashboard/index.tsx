import { Grid } from '@mui/material';
import React from 'react';
import BrokerCard from '../../components/BrokerCard/BrokerCard';
import { Scheduler } from '../../components/Scheduler';

export function Dashboard() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6} minWidth={546}>
        <BrokerCard />
      </Grid>
      <Grid item xs={12} lg={6} minWidth={546}>
        <Scheduler />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
