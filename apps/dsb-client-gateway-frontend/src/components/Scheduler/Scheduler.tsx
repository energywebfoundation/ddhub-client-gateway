import dayjs from 'dayjs';
import { Book, RefreshCw } from 'react-feather';
import { Card, Box, Typography, Grid, Divider } from '@mui/material';
import { SchedulerItem } from './SchedulerItem';
import { useStyles } from './Scheduler.styles';
import { useScheduler } from '../../../../../libs/ddhub-client-gateway-frontend/ui/api-hooks/src/lib/scheduler/getScheduler';

export const Scheduler = () => {
  const { jobs } = useScheduler();
  const { classes, theme } = useStyles();

  return (
    <Card className={classes.card}>
      <Box>
        <Typography className={classes.cardHeader} variant="body2">
          Scheduler
        </Typography>
        <Box>
          {jobs?.map((job) => {
            return (
              <>
                <Divider />
                <SchedulerItem
                  key={job.jobName}
                  name={job.jobName}
                  date={dayjs(job.updatedDate).format('DD/MM/YYYY HH:mm:ssA')}
                  icon={Book}
                  color={theme.palette.primary.main}
                  status={job.latestStatus}
                />
              </>
            );
          })}
          <Divider />
        </Box>
      </Box>
    </Card>
  );
};
