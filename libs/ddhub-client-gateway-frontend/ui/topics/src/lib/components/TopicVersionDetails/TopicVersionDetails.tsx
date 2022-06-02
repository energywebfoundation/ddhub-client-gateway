import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import {
  ApplicationDTO,
  ChannelTopic,
  GetTopicSearchDto
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Image, GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './TopicVersionDetails.styles';
import { TOPIC_VERSIONS_HEADERS } from '../../models';

interface TopicVersionDetailsProps {
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

  const getValue = (labelName: string) => {
    return topic && topic[labelName as keyof ChannelTopic];
  }

  return (
    <Box sx={{ padding: 0 }}>
      {application && (
        <Box className={classes.appWrapper}>
          <Image src={application.logoUrl} className={classes.appImage} />
          <Typography className={classes.appName}>
            {application.appName}
          </Typography>
          <Typography className={classes.namespace}>
            {application.namespace}
          </Typography>
        </Box>
      )}

      <Box className={classes.details}>
        <Typography className={classes.title}>Details</Typography>

        {fields.map((field) => (
          <Box className={classes.detailsInfo} display="flex" mb={1.2} key={field.value}>
            <Typography className={classes.detailsInfoLabel}>{field.label}</Typography>
            <Typography className={classes.detailsInfoValue}>{getValue(field.value)}</Typography>
          </Box>
        ))}

        <Typography className={classes.subtitle}>Version history</Typography>

        <GenericTable<GetTopicSearchDto>
          headers={TOPIC_VERSIONS_HEADERS}
          tableRows={versions}
          showFooter={false}
          showSearch={false}
          customStyle={{ tableMinWidth: 'auto' }}
        />
      </Box>
    </Box>
  );
};
