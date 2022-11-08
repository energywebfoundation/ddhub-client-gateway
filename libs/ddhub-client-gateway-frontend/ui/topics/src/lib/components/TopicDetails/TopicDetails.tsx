import { FC } from 'react';
import { CircularProgress, Typography, Box, IconButton, Grid } from '@mui/material';
import {
  ApplicationDTO,
  PostTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { EditorView } from '@ddhub-client-gateway-frontend/ui/core';
import { useStyles } from './TopicDetails.styles';
import { TopicDetail } from './TopicDetail';
import { ApplicationInfoModal } from '../ApplicationInfoModal';

interface TopicDetailsProps {
  isLoading: boolean;
  showActionButtons?: boolean;
  details: {
    topic: PostTopicDto;
    application: ApplicationDTO;
  };
  fields: {
    label: string;
    value: string;
  }[];
  buttons: {
    name: string;
    icon: React.ReactElement;
    onClick: () => void;
    wrapperClassName?: string;
  }[];
}

export const TopicDetails: FC<TopicDetailsProps> = ({
  isLoading,
  showActionButtons = true,
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
        <Grid container className={classes.content} flexDirection={"row"}>
          <Grid item xs={4} paddingRight={4}>
            { showActionButtons &&
              <Box className={classes.details}>
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
              </Box>
            }
            {application && <ApplicationInfoModal application={application} />}
          </Grid>
          <Grid item className={classes.contentWrapper} xs={8}>
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid item xs={6} className={classes.gridItem} key={field.value}>
                  <TopicDetail topic={topic} field={field} />
                </Grid>
              ))}
            </Grid>
            <Box>
              <Typography
                style={{ marginBottom: 7, marginTop: 12 }}
                className={classes.detailsInfoLabel}
              >
                Schema Definition
              </Typography>
              <EditorView value={topic.schema} height={360} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
