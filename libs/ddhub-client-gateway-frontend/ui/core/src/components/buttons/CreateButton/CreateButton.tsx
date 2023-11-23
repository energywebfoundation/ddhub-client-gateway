import { Button, Typography } from '@mui/material';
import { useStyles } from './CreateButton.styles';

export interface CreateButtonProps {
  onCreate: () => void;
  buttonText?: string;
}

export function CreateButton({ onCreate, buttonText }: CreateButtonProps) {
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
          {buttonText ?? 'Create'}
        </Typography>
      </Button>
    </div>
  );
}
