import React, { FC, MouseEvent } from 'react';
import {
  Typography,
  Box,
  Stack,
  TablePagination,
  IconButton,
} from '@mui/material';
import { ChannelTopic } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import {
  CopyToClipboard,
  TablePaginationActions,
} from '@ddhub-client-gateway-frontend/ui/core';
import { useTopicsEffects } from './Topics.effects';
import { useStyles } from './Topics.styles';
import { ChevronDown, ChevronUp } from 'react-feather';
import { SelectedTopicsCollapse } from '../../Create/Topics/SelectedTopicView/ResponseTopicsCollapse/ResponseTopicsCollapse';

interface TopicsProps {
  topics: ChannelTopic[];
  responseTopics?: any;
  showResponseTopics?: boolean;
}

export const Topics: FC<TopicsProps> = ({
  topics,
  responseTopics = {},
  showResponseTopics = false,
}) => {
  const { classes } = useStyles();
  const {
    openTopicDetails,
    page,
    handleChangePage,
    expandResponse,
    setExpandResponse,
  } = useTopicsEffects();
  const rowsPerPage = 50;
  const startIdx = page !== 0 ? rowsPerPage * page : 0;
  let endIdx = startIdx + rowsPerPage;
  let topicsCount = `${topics.length} Topic`;

  if (topics.length > 1) {
    topicsCount += 's';
  }

  if (topics.length < endIdx) {
    endIdx = topics.length;
  }

  const rows = topics.slice(startIdx, endIdx).map((topic, index) => (
    <Box
      key={topic.topicId}
      className={classes.topic}
      onClick={() => openTopicDetails(topic)}
    >
      <Box display="flex" justifyContent="space-between">
        <Stack>
          <Typography className={classes.topicLabel} variant="body2">
            {topic.topicName}
          </Typography>
          <Typography className={classes.topicValue} variant="body2">
            {topic.owner}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <CopyToClipboard
            text={topic.owner}
            wrapperProps={{ display: 'flex', marginLeft: '10px' }}
          />
          {showResponseTopics && (
            <IconButton
              onMouseDown={(event: MouseEvent<HTMLElement>) => {
                event.stopPropagation();

                setExpandResponse({
                  ...expandResponse,
                  [topic.topicId]: !expandResponse[topic.topicId],
                });
              }}
              className={classes.accordion}
            >
              {!expandResponse[topic.topicId] && <ChevronDown size={18} />}
              {expandResponse[topic.topicId] && <ChevronUp size={18} />}
            </IconButton>
          )}
        </Stack>
      </Box>

      {/* {showResponseTopics && (
        <SelectedTopicsCollapse
          responseTopics={responseTopics[topic.topicId]}
          expandResponse={expandResponse[topic.topicId]}
        />
      )} */}
    </Box>
  ));

  const noTopic = (
    <Box>
      <Stack>
        <Typography className={classes.label} variant="body2">
          -
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <>
      <Typography className={classes.label} variant="body2">
        {topicsCount}
      </Typography>
      <Box className={classes.topicsList}>{topics.length ? rows : noTopic}</Box>

      {topics.length > 50 && (
        <Box display="flex">
          <TablePagination
            style={{ width: '100%' }}
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
      )}
    </>
  );
};
