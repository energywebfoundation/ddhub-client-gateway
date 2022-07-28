import { FC } from 'react';
import { Typography, Box, Grid, Stack } from '@mui/material';
import {
  ApplicationDTO,
  ChannelTopic,
  GetTopicSearchDto
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './TopicVersionDetails.styles';
import { TOPIC_VERSIONS_HEADERS } from '../../models';
import { useTopicVersionEffects } from './TopicVersionDetails.effects';
import { ApplicationInfoModal } from '../ApplicationInfoModal';

export interface TopicVersionDetailsProps {
  topicVersionDetails: {
    versions: GetTopicSearchDto[],
    topic: ChannelTopic;
    application: ApplicationDTO;
  };
  fields: {
    label: string;
    value: string;
  }[];
}

export const TopicVersionDetails: FC<TopicVersionDetailsProps> = (
  {
    fields,
    topicVersionDetails: { topic, versions, application },
  }) => {
  const { classes } = useStyles();
  const { handleRowClick } = useTopicVersionEffects();

  const getValue = (labelName: string) => {
    return topic && topic[labelName as keyof ChannelTopic];
  }

  return (
    <Grid container className={classes.content}>
      <Grid item>
        {application && <ApplicationInfoModal application={application} /> }
      </Grid>
      <Grid item className={classes.contentWrapper}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={6} key={field.value}>
              <Stack direction="column">
                <Typography className={classes.detailsInfoLabel}>{field.label}</Typography>
                <Box display="flex">
                  <Typography className={classes.detailsInfoValue}>{getValue(field.value)}</Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Typography className={classes.subtitle}>Version history</Typography>

        <GenericTable<GetTopicSearchDto>
          headers={TOPIC_VERSIONS_HEADERS}
          tableRows={versions}
          showFooter={false}
          showSearch={false}
          onRowClick={handleRowClick}
          containerProps={{ style: { boxShadow: 'none' }}}
          stripedTable={true}
          customStyle={{ tableMinWidth: 'auto' }}
        />
      </Grid>
    </Grid>
  );
};
