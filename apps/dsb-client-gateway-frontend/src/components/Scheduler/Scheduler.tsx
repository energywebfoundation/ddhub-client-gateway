import dayjs from 'dayjs';
import { Book, RefreshCw } from 'react-feather';
import { Card, Box, Typography, Grid } from '@mui/material';
import { SchedulerItem } from './SchedulerItem';
import { useStyles } from './Scheduler.styles';

export const Scheduler = () => {
  const { classes, theme } = useStyles();

  return (
    <Card className={classes.card}>
      <Box>
        <Typography className={classes.cardHeader} variant="body2">
          Scheduler
        </Typography>
        <Box>
          <Grid container justifyContent="space-between">
            <Grid item xs={6}>
              <SchedulerItem
                name="Reference data cache"
                date={dayjs('2022-08-21T12:40:20').format(
                  'DD/MM/YYYY HH:mm:ssA'
                )}
                icon={Book}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={6}>
              <SchedulerItem
                name="DID document sync"
                date={dayjs('2022-08-21T12:40:20').format(
                  'DD/MM/YYYY HH:mm:ssA'
                )}
                icon={RefreshCw}
                color={theme.palette.info.light}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};
