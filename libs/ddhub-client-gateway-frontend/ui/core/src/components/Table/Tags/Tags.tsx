import { Box, Chip, Collapse } from '@mui/material';
import { useStyles } from './Tags.styles';
import { useTagsEffects } from './Tags.effects';
import clsx from 'clsx';

interface TagsProps {
  value: string[];
}

export const Tags = ({ value }: TagsProps) => {
  const { classes } = useStyles();
  const { isOpen, handleOpening } = useTagsEffects();

  return (
    <Box>
      {isOpen ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {value.map((tag: string) => (
            <Chip
              key={tag}
              color="primary"
              label={tag}
              className={classes.chip}
              classes={{
                label: classes.chipLabel,
              }}
            />
          ))}
        </Collapse>

      ) : (
        <>
          {value.slice(0, 8).map((tag: string) => (
            <Chip
              key={tag}
              color="primary"
              label={tag}
              className={classes.chip}
              classes={{
                label: classes.chipLabel,
              }}
            />
          ))}
        </>
      )}

      {!isOpen && value?.length > 8 && (
        <Chip
          label={`+${value.length - 8}`}
          onClick={handleOpening}
          className={classes.chipMore}
          classes={{ label: clsx(classes.chipLabel, classes.chipLabelWhite) }}
        />
      )}
    </Box>
  );
};
