import { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CopyToClipboard } from '@dsb-client-gateway/ui/core';
import { useStyles } from './Topics.styles';

interface TopicsProps {
  topics: ChannelTopic[];
}

export const Topics: FC<TopicsProps> = ({ topics }) => {
  const { classes } = useStyles();

  return (
    <>
      <Typography className={classes.label} variant="body2">
        Topics
      </Typography>
      <Box className={classes.topicsList}>
        {topics?.map((topic) => {
          return (
            <Box
              key={topic.topicId}
              display="flex"
              flexDirection="column"
              mb={0.4}
            >
              <Typography className={classes.topicLabel} variant="body2">
                {topic.topicName}
              </Typography>
              <Box display="flex">
                <Typography className={classes.topicValue} variant="body2">
                  {topic.owner}
                </Typography>
                <CopyToClipboard
                  text={topic.owner}
                  wrapperProps={{ display: 'flex', marginLeft: '10px' }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
