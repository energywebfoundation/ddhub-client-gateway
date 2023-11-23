import { FC } from 'react';
import { Box, Typography, Collapse, Chip } from '@mui/material';
import { useStyles } from './Restrictions.styles';
import { useRestrictionsEffects } from './Restrictions.effects';

export interface RestrictionsProps {
  value: string[];
  type: string;
}

export const Restrictions: FC<RestrictionsProps> = ({ value, type }) => {
  const { classes } = useStyles();
  const { isOpen, handleOpening } = useRestrictionsEffects();

  return (
    <Box>
      {isOpen ? (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Typography variant="body2" className={classes.text}>
            {value.join(', ')}
          </Typography>
        </Collapse>
      ) : (
        <Typography
          variant="body2"
          className={classes.text}
          sx={{ display: 'inline', marginRight: '8px' }}
        >
          {value?.length ? value.slice(0, 3).join(', ') : '--'}
        </Typography>
      )}

      {!isOpen && value?.length > 3 && (
        <Chip
          label={`+${value.length - 3}`}
          onClick={handleOpening}
          className={classes.chip}
          classes={{ label: classes.chipLabel }}
        />
      )}
    </Box>
  );
};
