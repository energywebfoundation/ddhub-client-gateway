import { Box, BoxProps, Typography } from '@mui/material';
import { useStyles } from './RestrictionBox.styles';
import { RestrictionList } from '../RestrictionList/RestrictionList';
import { RestrictionType } from '../models/restriction-type.enum';

export interface RestrictionBoxProps {
  type: RestrictionType;
  list: string[];
  remove?: (value: string) => void;
  canRemove?: boolean;
  canCopy?: boolean;
  wrapperProps?: BoxProps;
}

export const RestrictionBox = ({
  type,
  list,
  remove,
  canRemove = true,
  canCopy = false,
  wrapperProps,
}: RestrictionBoxProps) => {
  const { classes } = useStyles();
  return (
    <Box component="div" className={classes.root} {...wrapperProps}>
      <Typography className={classes.label}>{type}</Typography>
      <RestrictionList
        list={list}
        remove={remove}
        canRemove={canRemove}
        canCopy={canCopy}
      />
    </Box>
  );
};
