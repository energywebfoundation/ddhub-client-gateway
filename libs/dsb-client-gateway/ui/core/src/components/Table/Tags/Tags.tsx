import { Chip } from '@mui/material';
import { useStyles } from './Tags.styles';

interface TagsProps {
  value: string[];
}

export const Tags = ({ value }: TagsProps) => {
  const { classes } = useStyles();
  return value.map((tag: string) => (
    <Chip
      key={tag}
      color="primary"
      label={tag}
      className={classes.chip}
      classes={{
        label: classes.chipLabel,
      }}
    />
  ));
};
