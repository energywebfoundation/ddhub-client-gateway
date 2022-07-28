import { FC } from 'react';
import { Box, PaletteColor, Theme, Typography } from '@mui/material';
import { useStyles } from './Badge.styles';

export type BadgeTextType =
  | 'ONLINE'
  | 'SUCCESS'
  | 'SYNCED'
  | 'FAILURE'
  | 'WARNING'
  | 'INFO'
  | 'NONE';

export enum BadgeText {
  SUCCESS = 'SUCCESS',
  SYNCED = 'SYNCED',
  FAILURE = 'FAILURE',
  ONLINE = 'ONLINE',
  WARNING = 'WARNING',
  VALID = 'VALID',
  INVALID = 'INVALID',
  INFO = 'INFO',
}

const BadgeTextMap = new Map<BadgeText, string>([
  [BadgeText.SUCCESS, 'Synced'],
  [BadgeText.SYNCED, 'Synced'],
  [BadgeText.FAILURE, 'Failed'],
  [BadgeText.ONLINE, 'Online'],
  [BadgeText.WARNING, 'Warning'],
  [BadgeText.VALID, 'Valid'],
  [BadgeText.INVALID, 'Invalid'],
  [BadgeText.INFO, 'Info'],
]);

interface BadgeProps {
  text: BadgeText | string;
}

export const Badge: FC<BadgeProps> = ({ text }) => {
  const getStatusColor = (
    theme: Theme,
    status: BadgeText
  ): Pick<PaletteColor, 'main'> => {
    switch (status) {
      case BadgeText.ONLINE:
      case BadgeText.SUCCESS:
      case BadgeText.SYNCED:
      case BadgeText.VALID:
        return theme.palette.success;
      case BadgeText.FAILURE:
        return theme.palette.error;
      case BadgeText.WARNING:
      case BadgeText.INVALID:
        return theme.palette.warning;
      case BadgeText.INFO:
        return theme.palette.info;
      default:
        return { main: theme.palette.grey[500] };
    }
  };

  const { classes } = useStyles(getStatusColor, text as BadgeText);

  return (
    <Box className={classes.wrapper}>
      <Typography variant="body2" className={classes.text}>
        {BadgeTextMap.get(text as BadgeText)
          ? BadgeTextMap.get(text as BadgeText)
          : text}
      </Typography>
    </Box>
  );
};
