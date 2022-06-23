import { Divider, Grid, Stack, Typography, Box } from '@mui/material';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { didFormatMinifier } from '@ddhub-client-gateway-frontend/ui/utils';
import { RestrictionsViewBox } from '../../../../components';
import { SelectedTopicList } from '../Topics/SelectedTopicList/SelectedTopicList';
import { ICreateChannel } from '../../models/create-channel.interface';
import { RestrictionType } from '../Restrictions/models/restriction-type.enum';
import { ActionButtons } from '../ActionButtons';
import { TActionButtonsProps } from '../ActionButtons/ActionButtons';
import { useSummaryEffects } from './Summary.effects';
import { useStyles } from './Summary.styles';
import { Check } from 'react-feather';

export interface SummaryProps {
  channelValues: ICreateChannel;
  actionButtonsProps: TActionButtonsProps;
}

export const Summary = ({
  channelValues,
  actionButtonsProps,
}: SummaryProps) => {
  const { countRestrictions } = useSummaryEffects();
  const { classes } = useStyles();
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap', marginTop: '-20px' }}
    >
      <Grid item>
        <Typography variant={'h4'} className={classes.mainLabel}>
          {channelValues.channelType}
        </Typography>
        <Stack direction="row" mt={2.8}>
          <Typography className={classes.detailsTitle} variant="body2">
            Type:{' '}
          </Typography>
          <Typography className={classes.description} variant="body2">
            {channelValues?.connectionType}
          </Typography>
        </Stack>
        <Stack direction="row" mt={1}>
          <Typography className={classes.detailsTitle} variant="body2">
            Namespace:
          </Typography>
          <Box display="flex">
            <Typography className={classes.description} variant="body2">
              {channelValues?.fqcn}
            </Typography>
            <CopyToClipboard
              text={channelValues?.fqcn}
              wrapperProps={{ marginLeft: '8px' }}
            />
          </Box>
        </Stack>
        <Stack direction="row" mt={1}>
          <Typography className={classes.detailsTitle} variant="body2">
            Payload encryption:
          </Typography>
          <Box display="flex">
            <Typography className={classes.encryptionValue} variant="body2">
              {channelValues?.payloadEncryption ? <Check className={classes.iconCheck} /> : '-'}
            </Typography>
          </Box>
        </Stack>
        <Divider className={classes.divider} />
        <Typography variant={'body2'} className={classes.label}>
          {countRestrictions(channelValues?.conditions)} Restrictions
        </Typography>
        <Box display="flex">
          <RestrictionsViewBox
            label={RestrictionType.DID}
            list={channelValues.conditions.dids}
            formatter={(value: string) => didFormatMinifier(value, 5, 3)}
            wrapperProps={{ mr: 0.75 }}
          />
          <RestrictionsViewBox
            label={RestrictionType.Role}
            list={channelValues.conditions.roles}
            wrapperProps={{ ml: 0.75 }}
          />
        </Box>
        <Divider className={classes.divider} />
        <Typography variant={'body2'} className={classes.label}>
          Topics
        </Typography>
        <SelectedTopicList
          topics={channelValues.conditions.topics}
          canRemove={false}
          canCopy={true}
        />
      </Grid>
      <Grid item alignSelf="flex-end" width="100%">
        <ActionButtons {...actionButtonsProps} />
      </Grid>
    </Grid>
  );
};
