import { FC } from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { PostTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useStyles } from './TopicDetails.styles';

interface TopicDetailProps {
  topic: PostTopicDto;
  field: { label: string; value: string };
}

export const TopicDetail: FC<TopicDetailProps> = ({ topic, field }) => {
  const { classes } = useStyles();

  const value = topic[field.value as keyof PostTopicDto];
  const tags = value as PostTopicDto['tags'];
  return (
    <Box display="flex">
      <Stack direction="column">
        <Typography className={classes.detailsInfoLabel}>
          {field.label}
        </Typography>
        {field.value === 'tags' ? (
          <Box display="flex" flexWrap="wrap">
            {tags?.map((tag) => (
              <Box key={tag} className={classes.tag}>
                {tag}
              </Box>
            ))}
          </Box>
        ) : (
          <Box display="flex">
            <Typography className={classes.detailsInfoValue}>{value}</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
