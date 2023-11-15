import { Box, Chip, Collapse, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { useStyles } from './ResponseTopicsCollapse.styles';
import { ResponseTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

interface SelectedTopicsCollapseProps {
  expandResponse: boolean;
  responseTopics: ResponseTopicDto[];
}

export const SelectedTopicsCollapse = ({
  expandResponse,
}: // responseTopics,
SelectedTopicsCollapseProps) => {
  const { classes } = useStyles();

  return (
    <Collapse in={expandResponse}>
      <Grid item width="100%" ml="2px" mt="8px">
        <Typography className={classes.chipLabel} pb={1}>
          Response topics
        </Typography>

        <Stack direction="row" spacing="6px">
          {/* {(!responseTopics || !responseTopics.length) && (
            <Box className={classes.noRecord}>
              <Typography className={classes.noRecordLabel}>
                No response topic added
              </Typography>
            </Box>
          )}
          {responseTopics &&
            responseTopics.map((item, index) => (
              <Chip
                key={index}
                color="primary"
                label={item.topicName}
                className={classes.chip}
                classes={{
                  label: classes.chipLabel,
                }}
              />
            ))} */}
        </Stack>
      </Grid>
    </Collapse>
  );
};
