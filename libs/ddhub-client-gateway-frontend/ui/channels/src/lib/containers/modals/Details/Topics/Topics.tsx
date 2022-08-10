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
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTopicsEffects();

  const rows = [];
  const startIdx = page !== 0 ? rowsPerPage * page : 0;
  const endIdx = startIdx + rowsPerPage;

  for (let i = startIdx; i < endIdx; i++) {
    const topic = topics[i];
    if (!topic) {
      break;
    }
    rows.push(<Box
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
  }

  return (
    <>
      <Typography className={classes.label} variant="body2">
        Topics
      </Typography>
      <Box className={classes.topicsList}>
        {rows}
        { topics.length > 50 &&
          <Box display="flex">
            <TablePagination
              style={{width: '100%'}}
              rowsPerPageOptions={[50, 100]}
              count={topics.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              onRowsPerPageChange={handleChangeRowsPerPage}
              classes={{
                spacer: classes.spacer,
                displayedRows: classes.displayedRows,
                toolbar: classes.toolbar,
                root: classes.paginationRoot,
              }}
            />
          </Box>
        }
      </Box>
    </>
  );
};
