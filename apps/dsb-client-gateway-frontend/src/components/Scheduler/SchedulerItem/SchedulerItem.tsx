import { FC } from 'react';
import { Icon } from 'react-feather';
import { Typography, Box, alpha, Divider } from '@mui/material';
import { useStyles } from './SchedulerItem.styles';
import Status, { StatusTypeEnum } from '../../Status/Status';
import { capitalizeFirstLetter } from '@ddhub-client-gateway-frontend/ui/utils';

export interface SchedulerItemProps {
  name: string;
  date: string;
  color: string;
  icon: Icon;
  status: string;
}

export const SchedulerItem: FC<SchedulerItemProps> = ({
  icon: SchedulerIcon,
  name,
  date,
  color,
  status,
}) => {
  const { classes } = useStyles();
  return (
    <>
      <Divider />
      <Box display="flex" mb={1.2} mt={1.2}>
        <Box className={classes.iconWrappper}>
          <SchedulerIcon size={20} />
        </Box>
        <Box display="flex" justifyContent="space-between" flex={1}>
          <Box display="flex" flexDirection="column">
            <Typography className={classes.name} variant="body2">
              {capitalizeFirstLetter(name.split('_').join(' ').toLowerCase())}
            </Typography>
            <Typography className={classes.date} variant="body2">
              {date}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignSelf="center">
            <Status text={status} type={status as StatusTypeEnum}></Status>
          </Box>
        </Box>
      </Box>
    </>
  );
};
