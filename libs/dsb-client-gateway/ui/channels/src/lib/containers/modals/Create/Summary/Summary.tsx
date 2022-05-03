import { Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { useSummaryEffects } from './Summary.effects';
import { RestrictionBox } from '../Restrictions/RestrictionBox/RestrictionBox';
import { useStyles } from './Summary.styles';
import { SelectedTopicList } from '../Topics/SelectedTopicList/SelectedTopicList';
import { ICreateChannel } from '../../models/create-channel.interface';
import { RestrictionType } from '../Restrictions/models/restriction-type.enum';

export interface SummaryProps {
  nextClick: () => void;
  channelValues: ICreateChannel;
}

export const Summary = ({ nextClick, channelValues }: SummaryProps) => {
  const { countRestrictions } = useSummaryEffects();
  const { classes } = useStyles();
  return (
    <Grid
      container
      direction="column"
      spacing={2}
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap' }}
    >
      <Grid item>
        <Typography variant={'h4'}>{channelValues.channelType}</Typography>
        <Stack direction="row">
          <Typography className={classes.detailsTitle}>Type: </Typography>
          <Typography className={classes.description}>
            {channelValues?.connectionType}
          </Typography>
        </Stack>
        <Stack direction="row">
          <Typography className={classes.detailsTitle}>Namespace:</Typography>
          <Typography className={classes.description}>
            {channelValues?.fqcn}
          </Typography>
        </Stack>
        <Divider className={classes.divider} />
        <Typography variant={'body2'}>
          {countRestrictions(channelValues?.conditions)} Restrictions
        </Typography>
        <RestrictionBox
          type={RestrictionType.DID}
          list={channelValues.conditions.dids}
          canRemove={false}
          canCopy={true}
        />
        <RestrictionBox
          type={RestrictionType.Role}
          list={channelValues.conditions.roles}
          canRemove={false}
          canCopy={true}
        />
        <Divider className={classes.divider} />
        <Typography variant={'body2'}>Topics</Typography>
        <SelectedTopicList
          topics={channelValues.conditions.topics}
          canRemove={false}
          canCopy={true}
        />
      </Grid>
      <Grid item alignSelf="flex-end">
        <Button type="submit" variant="contained" onClick={nextClick}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};
