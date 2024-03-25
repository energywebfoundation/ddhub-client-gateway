import dayjs from 'dayjs';
import { Card, Box, Typography, Divider } from '@mui/material';
import { SchedulerItem } from './SchedulerItem';
import { useStyles } from './Scheduler.styles';
import { useScheduler } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { schedulerIconMap } from './schedulerIconMap';

export const Scheduler = () => {
  const { jobs } = useScheduler();
  const { classes } = useStyles();

  return (
    <Card className={classes.card}>
      <Box>
        <Typography className={classes.cardHeader} variant="body2">
          Scheduler
        </Typography>
        <Box>
          {(!jobs || jobs?.length === 0) && (
            <Typography variant="body2">No jobs found.</Typography>
          )}
          {jobs?.length && (
            <>
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
                    status={job.latestStatus}
                  />
                );
              })}
              <Divider />
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
};
