import { Avatar, Container, Stack, Typography } from '@mui/material';
import { useStyles } from './Step.styles';

export interface StepProps {
  active: boolean;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  clickHandler?: () => void;
}

const concatClasses = (classes: string[]): string => {
  return classes.join(' ');
};

export const Step = ({
  active,
  icon,
  subtitle,
  title,
  clickHandler,
}: StepProps) => {
  const { classes } = useStyles();
  const isActiveTitle = active
    ? concatClasses([classes.title, classes.activeTitle])
    : classes.title;
  const isActiveAvatar = active
    ? concatClasses([classes.icon, classes.activeIcon])
    : classes.icon;
  return (
    <Stack direction="row" className={classes.root}>
      <Avatar
        variant="rounded"
        className={isActiveAvatar}
        onClick={clickHandler}
      >
        {icon}
      </Avatar>
      <Container sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Typography className={isActiveTitle} variant="h6">
          {title}
        </Typography>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      </Container>
    </Stack>
  );
};
