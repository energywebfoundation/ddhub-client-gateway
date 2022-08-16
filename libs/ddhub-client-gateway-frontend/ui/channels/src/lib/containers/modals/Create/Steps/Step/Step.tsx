import clsx from 'clsx';
import { Avatar, Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Step.styles';

export interface StepProps {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  clickHandler?: () => void;
  showCursor?: boolean;
}

export const Step = ({
  active,
  icon,
  subtitle,
  title,
  clickHandler,
  showCursor,
}: StepProps) => {
  const { classes } = useStyles();

  return (
    <Stack direction="row" className={clsx(classes.root, {[classes.clickableDiv]: showCursor})} onClick={clickHandler}>
      <Avatar
        variant="rounded"
        className={clsx(classes.icon, { [classes.activeIcon]: active })}
      >
        {icon}
      </Avatar>
      <Container className={classes.container}>
        <Typography
          className={clsx(classes.title, { [classes.activeTitle]: active })}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography className={classes.subtitle} variant="body2">
          {subtitle}
        </Typography>
      </Container>
    </Stack>
  );
};
