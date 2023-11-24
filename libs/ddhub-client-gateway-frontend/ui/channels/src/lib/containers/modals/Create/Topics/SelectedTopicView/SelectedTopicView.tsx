import { Grid, Typography, IconButton, Box, Tooltip } from '@mui/material';
import {
  Edit3,
  X as Close,
  CornerUpLeft,
  ChevronDown,
  ChevronUp,
} from 'react-feather';
import { CopyToClipboard } from '@ddhub-client-gateway-frontend/ui/core';
import { MouseEvent } from 'react';
import clsx from 'clsx';
import { useStyles } from '../SelectedTopicView/SelectedTopicView.styles';
import { Topic } from '../Topics.effects';
import { SelectedTopicsCollapse } from './ResponseTopicsCollapse/ResponseTopicsCollapse';
import { ResponseTopicDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';

export interface SelectedTopicViewProps {
  topic: Topic;
  canRemove: boolean;
  index: number;
  isSummary?: boolean;
  showTopicResponse?: boolean;
  handleOpenResponse?: (event: any) => void;
  handleOpenEdit?: (event: any) => void;
  expanded?: string | false;
  remove?: () => void;
  canCopy?: boolean;
  responseTopics?: ResponseTopicDto[];
  expandResponse?: boolean;
  setExpandResponse?: (value: boolean) => void;
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
  responseTopics,
  expandResponse,
  setExpandResponse,
}: SelectedTopicViewProps) => {
  const { classes, theme } = useStyles();

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
                        onClick={handleOpenResponse}
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
                      onClick={handleOpenEdit}
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
                      onClick={(event: MouseEvent<HTMLElement>) => {
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
                  onClick={(event: MouseEvent<HTMLElement>) => {
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
        responseTopics={responseTopics}
        expandResponse={expandResponse}
      />
    </Grid>
  );
};
