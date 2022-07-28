import { FC } from 'react';
import { Icon } from 'react-feather';
import { Typography, Box, Divider, Skeleton } from '@mui/material';
import { useStyles } from './SchedulerItem.styles';
import { capitalizeFirstLetter } from '@ddhub-client-gateway-frontend/ui/utils';
import {
  Badge,
  BadgeText,
  BadgeTextType,
} from '@ddhub-client-gateway-frontend/ui/core';

export interface SchedulerItemProps {
  name: string;
  date: string;
  icon: Icon;
  status: BadgeTextType;
  isLoading: boolean;
}

export const SchedulerItem: FC<SchedulerItemProps> = ({
  icon: Icon,
  name,
  date,
  status,
  isLoading,
}) => {
  const { classes } = useStyles();

  return (
    <>
      <Divider />
      <Box display="flex" p={1.2}>
        <Box className={classes.iconWrapper}>
          <Icon size={20} />
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
            {isLoading ? (
              <Box mt={'7px'}>
                <Skeleton variant="text" width={100} height={20} />
              </Box>
            ) : (
              <Badge text={BadgeText[status]} />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};
