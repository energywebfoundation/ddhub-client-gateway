import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import {
  CopyToClipboard,
  Tabs,
  TabsProps,
} from '@ddhub-client-gateway-frontend/ui/core';
import { ICreateChannel } from '../../models/create-channel.interface';
import { RestrictionType } from '../Restrictions/models/restriction-type.enum';
import { ActionButtons } from '../ActionButtons';
import { TActionButtonsProps } from '../ActionButtons/ActionButtons';
import { useSummaryEffects } from './Summary.effects';
import { useStyles } from './Summary.styles';
import { Check, X } from 'react-feather';
import React from 'react';
import { RestrictionListView } from '../Restrictions/RestrictionListView/RestrictionListView';
import { clone } from 'lodash';
import { ConnectionType } from '../Details/models/connection-type.enum';
import { ChannelType } from '../../../../models';
import { Topic } from '../Topics/Topics.effects';
import { SelectedTopicView } from '../Topics/SelectedTopicView/SelectedTopicView';

export interface SummaryProps {
  channelValues: ICreateChannel;
  actionButtonsProps: TActionButtonsProps;
}

export const Summary = ({
  channelValues,
  actionButtonsProps,
}: SummaryProps) => {
  const { classes } = useStyles();
  const { countRestrictions } = useSummaryEffects();
  const restrictionCount = countRestrictions(channelValues?.conditions);
  const restrictionRoles = clone(channelValues.conditions.roles);

  const tabProps: TabsProps[] = [
    {
      label: 'Restrictions',
      childrenProp: (
        <Box className={classes.tabRoot}>
          {!restrictionCount && (
            <Box className={classes.noRecord}>
              <Typography className={classes.noRecordLabel}>
                No restriction added
              </Typography>
            </Box>
          )}

          {restrictionRoles.sort().map((el, index) => (
            <RestrictionListView
              wrapperProps={{
                className: classes.restrictionBox,
              }}
              key={index}
              item={el}
              type={RestrictionType.Role}
              index={index}
            />
          ))}

          {channelValues.conditions.dids?.map((el, index) => (
            <RestrictionListView
              wrapperProps={{
                className: classes.restrictionBox,
              }}
              key={index}
              item={el}
              type={RestrictionType.DID}
              index={index}
            />
          ))}
        </Box>
      ),
    },
    {
      label: 'Topics',
      childrenProp: (
        <Box className={classes.tabRoot}>
          {!channelValues.conditions.topics.length && (
            <Box className={classes.noRecord}>
              <Typography className={classes.noRecordLabel}>
                No topic added
              </Typography>
            </Box>
          )}

          {channelValues.conditions.topics?.map((el: Topic, index) => (
            <SelectedTopicView
              topic={el}
              canRemove={false}
              isSummary={true}
              index={index}
              showTopicResponse={
                channelValues.type === 'pub' && channelValues.enableMessageForm
              }
              responseTopics={channelValues.conditions.responseTopics[el.id]}
            />
          ))}
        </Box>
      ),
    },
  ];

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      className={'no-wrap'}
      sx={{ height: '100%', flexWrap: 'nowrap', marginTop: '-10px' }}
    >
      <Grid item sx={{ paddingRight: '36px' }}>
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
            Use anonymous external channel:
          </Typography>
          <Box display="flex">
            <Typography className={classes.encryptionValue} variant="body2">
              {channelValues?.useAnonymousExtChannel ? (
                <Check className={classes.iconCheck} />
              ) : (
                <X className={classes.iconX} />
              )}
            </Typography>
          </Box>
        </Stack>

        {channelValues?.connectionType === ConnectionType.Publish && (
          <Stack direction="row" mt={1}>
            <Typography className={classes.detailsTitle} variant="body2">
              Payload encryption:
            </Typography>
            <Box display="flex">
              <Typography className={classes.encryptionValue} variant="body2">
                {channelValues?.payloadEncryption ? (
                  <Check className={classes.iconCheck} />
                ) : (
                  <X className={classes.iconX} />
                )}
              </Typography>
            </Box>
          </Stack>
        )}

        {channelValues?.channelType === ChannelType.Messaging && (
          <Stack direction="row" mt={1}>
            <Typography className={classes.detailsTitle} variant="body2">
              Enable Message Form:
            </Typography>
            <Box display="flex">
              <Typography className={classes.encryptionValue} variant="body2">
                {channelValues?.enableMessageForm ? (
                  <Check className={classes.iconCheck} />
                ) : (
                  <X className={classes.iconX} />
                )}
              </Typography>
            </Box>
          </Stack>
        )}

        <Divider className={classes.divider} />
        <Tabs
          tabProps={tabProps}
          wrapperProps={{
            className: classes.tabBox,
          }}
        />
      </Grid>
      <Grid
        item
        alignSelf="flex-end"
        width="100%"
        sx={{ padding: '22px 7px 27px 0px' }}
      >
        <ActionButtons {...actionButtonsProps} />
      </Grid>
    </Grid>
  );
};
