import { Box, Grid, Typography } from '@mui/material';
import { Topic } from '../Topics.effects';
import { HTMLAttributes } from 'react';
import { useStyles } from './TopicItem.styles';
import { Tags } from '@ddhub-client-gateway-frontend/ui/core';

export interface TopicItemProps {
  option: Topic;
  listProps: HTMLAttributes<HTMLLIElement>;
}

export const TopicItem = ({ listProps, option }: TopicItemProps) => {
  const { classes } = useStyles();
  return (
    <Box component="li" {...listProps}>
      <Grid container justifyContent="space-between" wrap="nowrap">
        <Grid item sx={{ width: '100%', maxWidth: 150 }}>
          <Typography noWrap className={classes.name}>
            {option.name}
          </Typography>
          <Typography className={classes.version}>
            Version: {option?.version}
          </Typography>
        </Grid>
        <Grid item justifySelf="flex-end">
          <Grid container justifyContent="flex-end" className={classes.tags}>
            <Tags value={option.tags as string[]} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
