import { Grid } from '@mui/material';
import React from 'react';
import BrokerCard from '../../components/BrokerCard/BrokerCard';
import Statistics from '../../components/Statistics/Statistics';

export function Dashboard(props) {
  console.log(props);
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}><BrokerCard/></Grid>
      <Grid item xs={6}> <Statistics applicationAmount="6" channelAmount="22" topicAmount="1"/></Grid>
    </Grid>
  );
}

export default Dashboard;

