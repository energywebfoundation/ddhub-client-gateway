import { FC } from 'react';
import { CircularProgress, Typography, Box, IconButton } from '@mui/material';
import {
  ApplicationDTO,
  PostTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { Image, EditorView } from '@dsb-client-gateway/ui/core';
import { useStyles } from './TopicDetails.styles';
import { TopicDetail } from './TopicDetail';

interface TopicDetailsProps {
  isLoading: boolean;
  details: {
    topic: PostTopicDto;
    application: ApplicationDTO;
  };
  fields: {
    label: string;
    value: string;
  }[];
  buttons: {
    name: string,
    icon: React.ReactElement;
    onClick: () => void;
    wrapperClassName?: string;
  }[];
}

export const TopicDetails: FC<TopicDetailsProps> = ({
  isLoading,
  details: { application, topic },
  fields,
  buttons,
}) => {
  const { classes } = useStyles();
  return (
    <Box>
      {isLoading ? (
        <Box className={classes.progress}>
          <CircularProgress />
        </Box>
      ) : (
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
            {buttons.map((button) => {
              return (
                <IconButton
                  key={button.name}
                  className={button.wrapperClassName}
                  onClick={button.onClick}
                >
                  {button.icon}
                </IconButton>
              );
            })}
            <Box className={classes.detailsInfo}>
              {fields.map((field) => (
                <TopicDetail key={field.value} topic={topic} field={field} />
              ))}
              <Box>
                <Typography
                  style={{ marginBottom: 7 }}
                  className={classes.detailsInfoLabel}
                >
                  Schema Definition
                </Typography>
                <EditorView value={topic.schema} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
