import { Card, Box, CardContent, CardHeader, Grid } from '@mui/material';
import React from 'react';
import StatisticItem from './StatisticItem/StatisticItem';

export interface StatisticsProps {
  applicationAmount: string;
  topicAmount: string;
  channelAmount: string;
}

export function Statistics(props: StatisticsProps) {
  return (
    <Card>
      <Box>
        <CardHeader
          title="Statistics"
        />
        <CardContent>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item>
              <StatisticItem title="Applications" number={props.applicationAmount} color="#7367F0"/>
            </Grid>
            <Grid item>
              <StatisticItem title="Topics" number={props.topicAmount} color="#00CFE8"/>
            </Grid>
            <Grid item>
              <StatisticItem title="Channels" number={props.channelAmount} color="#EA5455"/>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Card>
  );
}

export default Statistics;
