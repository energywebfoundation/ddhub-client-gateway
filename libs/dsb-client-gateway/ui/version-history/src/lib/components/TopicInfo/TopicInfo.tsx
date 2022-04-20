import { CardContent, Paper, Typography } from '@mui/material';
import { useStyles } from './TopicInfo.styles';

export interface TopicInfoProps {
  applicationNamespace: string;
  topicId: string;
}

export function TopicInfo({applicationNamespace, topicId}: TopicInfoProps) {
  const {classes} = useStyles();
  return <Paper className={classes.root}>
    <CardContent>
      <div className={classes.row}>
        <Typography className={classes.title} variant="h4">Application namespace</Typography>
        <Typography className={classes.subTitle}>{applicationNamespace}</Typography>
      </div>
      <div className={classes.row}>
        <Typography className={classes.title} variant="h4">Topic Id</Typography>
        <Typography className={classes.subTitle} variant="body1">{topicId}</Typography>
      </div>
    </CardContent>

  </Paper>;
}
