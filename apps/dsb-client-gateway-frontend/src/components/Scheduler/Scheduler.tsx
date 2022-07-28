import dayjs from 'dayjs';
import { Card, Box, Typography, Divider } from '@mui/material';
import { SchedulerItem } from './SchedulerItem';
import { useStyles } from './Scheduler.styles';
import { useScheduler } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { schedulerIconMap } from './schedulerIconMap';
import { BadgeTextType } from '@ddhub-client-gateway-frontend/ui/core';

export const Scheduler = () => {
  const { jobs, isLoading } = useScheduler();
  const { classes } = useStyles();

  return (
    <Card className={classes.card}>
      <Box>
        <Box p={2}>
          <Typography variant="body1">Scheduler</Typography>
        </Box>
        <Box mb={3}>
          {jobs?.map((job) => {
            return (
              <SchedulerItem
                key={job.jobName}
                name={job.jobName}
                date={dayjs(job.updatedDate).format('DD/MM/YYYY HH:mm:ssA')}
                icon={
                  schedulerIconMap.get(job.jobName) ||
                  schedulerIconMap.get('DEFAULT_SCHEDULER')
                }
                status={job.latestStatus as BadgeTextType}
                isLoading={isLoading}
              />
            );
          })}
          <Divider />
        </Box>
      </Box>
    </Card>
  );
};
