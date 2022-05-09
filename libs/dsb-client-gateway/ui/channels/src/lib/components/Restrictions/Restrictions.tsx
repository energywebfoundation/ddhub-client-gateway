import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { useStyles } from './Restrictions.styles';

export interface RestrictionsProps {
  value: string[];
  type: string;
}

export const Restrictions: FC<RestrictionsProps> = ({ value, type }) => {
  const { classes } = useStyles();
  return (
    <Box>
      <Typography variant="body2" className={classes.text}>
        {value.length === 0 ? '--' : type}
      </Typography>
    </Box>
  );
};
