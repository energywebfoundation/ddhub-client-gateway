import { Grid, Typography, IconButton, Box, Tooltip } from '@mui/material';
import {
  Edit3,
  X as Close,
  CornerUpLeft,
  ChevronDown,
  ChevronUp,
} from 'react-feather';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import React, { MouseEvent } from 'react';
import clsx from 'clsx';
import { useStyles } from '../SelectedTopicView/SelectedTopicView.styles';
import { Topic } from '../Topics.effects';
import { useSelectedTopicViewEffects } from './SelectedTopicView.effects';
import { SelectedTopicsCollapse } from './ResponseTopicsCollapse/ResponseTopicsCollapse';

export interface SelectedTopicViewProps {
  topic: Topic;
  canRemove: boolean;
  index: number;
  isSummary?: boolean;
  showTopicResponse?: boolean;
  handleOpenResponse?: () => void;
  handleOpenEdit?: () => void;
  expanded?: string | false;
  remove?: () => void;
  canCopy?: boolean;
  responseTopics?: Topic[];
}

export const SelectedTopicView = ({
  topic,
  canRemove,
  showTopicResponse = false,
  isSummary = false,
  handleOpenResponse,
  expanded,
  index,
  handleOpenEdit,
  remove,
  canCopy,
}: // responseTopics,
SelectedTopicViewProps) => {
  const { classes, theme } = useStyles();
  const { expandResponse, setExpandResponse } = useSelectedTopicViewEffects();

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={clsx({ [classes.wrapper]: isSummary })}
    >
      <Grid item width="100%">
        <Grid container justifyContent="space-between" alignItems="center">
          {topic?.appName && (
            <Grid item>
              <Box className={classes.appBox}>
                <Typography variant="body2" className={classes.appName}>
                  {topic?.appName}
                </Typography>
              </Box>
            </Grid>
          )}

          {(canRemove || showTopicResponse) && (
            <Grid item display="flex" flexDirection="row">
              {canRemove && (
                <>
                  {showTopicResponse && (
                    <Tooltip title="Response topics">
                      <IconButton
                        onMouseDown={handleOpenResponse}
                        className={clsx(classes.edit, {
                          [classes.editActive]:
                            expanded && expanded === `panel-${index}`,
                          [classes.editInactive]:
                            expanded && expanded !== `panel-${index}`,
                        })}
                      >
                        <CornerUpLeft size={16} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Edit topic">
                    <IconButton
                      onMouseDown={handleOpenEdit}
                      className={clsx(classes.edit, {
                        [classes.editActive]:
                          expanded && expanded === `panel-${index}`,
                        [classes.editInactive]:
                          expanded && expanded !== `panel-${index}`,
                      })}
                    >
                      <Edit3 size={16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Remove topic">
                    <IconButton
                      onMouseDown={(event: MouseEvent<HTMLElement>) => {
                        event.stopPropagation();
                        remove();
                      }}
                      className={classes.close}
                    >
                      <Close color={theme.palette.secondary.main} size={18} />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {showTopicResponse && (
                <IconButton
                  onMouseDown={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    setExpandResponse(!expandResponse);
                  }}
                  className={classes.accordion}
                >
                  {!expandResponse && <ChevronDown size={18} />}
                  {expandResponse && <ChevronUp size={18} />}
                </IconButton>
              )}
            </Grid>
          )}
        </Grid>
        <Grid container pt={0.75}>
          <Grid item>
            <Typography
              variant="h2"
              pl={0.625}
              pr={2}
              className={clsx(classes.name, {
                [classes.nameSecondary]: canCopy,
              })}
            >
              {topic?.topicName}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.owner}>
              {topic?.owner}
            </Typography>
          </Grid>
          {canCopy && (
            <Grid item className={classes.copy}>
              <CopyToClipboard text={topic.owner} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <SelectedTopicsCollapse
        // responseTopics={responseTopics}
        expandResponse={expandResponse}
      />
    </Grid>
  );
};
