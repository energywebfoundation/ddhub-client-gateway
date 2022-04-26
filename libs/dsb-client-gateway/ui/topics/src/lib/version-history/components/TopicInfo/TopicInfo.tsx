import { CardContent, Paper, Typography, Box } from '@mui/material';
import { CopyToClipboard } from '@dsb-client-gateway/ui/core';
import { useStyles } from './TopicInfo.styles';

export interface TopicInfoProps {
  applicationNamespace: string;
  topicId: string;
}

export function TopicInfo({ applicationNamespace, topicId }: TopicInfoProps) {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root}>
      <CardContent className={classes.card}>
        <div className={classes.row}>
          <Typography className={classes.title} variant="h4">
            Application namespace
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography className={classes.subTitle} noWrap>
              {applicationNamespace}
            </Typography>
            <CopyToClipboard text={applicationNamespace} />
          </Box>
        </div>
        <div>
          <Typography className={classes.title} variant="h4">
            Topic ID
          </Typography>
          <Typography className={classes.subTitle} variant="body2">
            {topicId}
          </Typography>
        </div>
      </CardContent>
    </Paper>
  );
}
