import { FC } from 'react';
import { Typography, Box, Stack, TablePagination } from '@mui/material';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { CopyToClipboard, TablePaginationActions } from '@ddhub-client-gateway-frontend/ui/core';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';

interface TopicsProps {
  topics: ChannelTopic[];
}

export const Topics: FC<TopicsProps> = ({ topics }) => {
  const { classes } = useStyles();
  const {
    openTopicDetails,
    page,
    handleChangePage,
  } = useTopicsEffects();
  const rowsPerPage = 50;
  const startIdx = page !== 0 ? rowsPerPage * page : 0;
  let endIdx = startIdx + rowsPerPage;

  if (topics.length < endIdx) {
    endIdx = topics.length;
  }

  const rows = topics.slice(startIdx, endIdx).map(topic => <Box
    key={topic.topicId}
    className={classes.topic}
    onClick={() => openTopicDetails(topic)}>
    <Box>
      <Stack>
        <Typography className={classes.topicLabel} variant="body2">
          {topic.topicName}
        </Typography>
        <Typography className={classes.topicValue} variant="body2">
          {topic.owner}
        </Typography>
      </Stack>
    </Box>
    <CopyToClipboard
      text={topic.owner}
      wrapperProps={{ display: 'flex', marginLeft: '10px' }}
    />
  </Box>);

  const noTopic = (
    <Box>
      <Stack>
        <Typography className={classes.topicLabel} variant="body2">
          No topic
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <>
      <Typography className={classes.label} variant="body2">
        Topics
      </Typography>
      <Box className={classes.topicsList}>
        {topics.length ? rows : noTopic}
      </Box>
      { topics.length > 50 &&
        <Box display="flex">
          <TablePagination
            style={{width: '100%'}}
            rowsPerPageOptions={[]}
            labelDisplayedRows={() => ''}
            count={topics.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
            classes={{
              spacer: classes.spacer,
              displayedRows: classes.displayedRows,
              toolbar: classes.toolbar,
              root: classes.paginationRoot,
            }}
          />
        </Box>
      }
    </>
  );
};
