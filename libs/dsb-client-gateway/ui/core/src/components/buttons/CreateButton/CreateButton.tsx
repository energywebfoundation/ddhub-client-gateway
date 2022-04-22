import { Button, Typography } from '@mui/material';
import { useStyles } from './CreateButton.styles';

export interface CreateButtonProps {
  onCreate: () => void;
}

export function CreateButton({ onCreate }: CreateButtonProps) {
  const { classes } = useStyles();
  return (
    <div className={classes.createTopicButtonWrapper}>
      <Button
        className={classes.createTopicButton}
        variant="contained"
        color="primary"
        onClick={onCreate}
      >
        <Typography variant="body2" className={classes.createTopicButtonText}>
          Create
        </Typography>
      </Button>
    </div>
  );
}
