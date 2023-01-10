import React, { memo } from 'react';
import {
  InputAdornment,
  TextField,
  Typography,
  Box,
  InputLabel,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSearchEffects } from './Search.effects';
import { useStyles } from './Search.styles';

export interface SearchProps {
  filter: string;
  setFilter?: (value: string) => void;
  onSearchInput?: (value: string) => void;
  debounceTime?: number;
  tableRows?: any[];
}

export const Search = memo((props: SearchProps) => {
  const { classes } = useStyles();
  const { field, handleReset, onFilterChange, inputProps, value } =
    useSearchEffects(props);

  return (
    <Box className={classes.wrapper}>
      <InputLabel>
        <Typography variant="body2" className={classes.label}>
          Search
        </Typography>
      </InputLabel>
      <TextField
        autoComplete='off'
        fullWidth
        type="text"
        margin="normal"
        variant="outlined"
        name={inputProps.name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onFilterChange(event.target.value);
          inputProps.onChange(event);
        }}
        inputRef={inputProps.ref}
        inputProps={{
          ...field.inputProps,
        }}
        classes={{
          root: classes.root,
        }}
        InputProps={{
          endAdornment: value && (
            <InputAdornment position="end">
              <Close className={classes.close} onClick={handleReset} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
});

Search.displayName = 'Search';
