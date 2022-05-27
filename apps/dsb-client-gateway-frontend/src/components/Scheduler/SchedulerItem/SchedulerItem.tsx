import { FC } from 'react';
import { Icon } from 'react-feather';
import { Typography, Box, alpha } from '@mui/material';
import { useStyles } from './SchedulerItem.styles';

export interface SchedulerItemProps {
  name: string;
  date: string;
  color: string;
  icon: Icon;
}

export const SchedulerItem: FC<SchedulerItemProps> = ({
  icon: SchedulerIcon,
  name,
  date,
  color,
}) => {
  const { classes } = useStyles();
  return (
    <Box display="flex">
      <Box className={classes.iconWrappper}>
        <Box
          sx={{ backgroundColor: alpha(color, 0.12) }}
          className={classes.iconWrapper}
        >
          <SchedulerIcon size={20} style={{ stroke: color }} />
        </Box>
      </Box>
      <Box>
        <Box display="flex" flexDirection="column" mb={2.8}>
          <Typography className={classes.label} variant="body2">
            Scheduler name
          </Typography>
          <Typography className={classes.name} variant="body2">
            {name}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography className={classes.label} variant="body2">
            Date last run
          </Typography>
          <Typography className={classes.date} variant="body2">
            {date}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
