import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import { useAsyncDebounce } from 'react-table';
import { Close } from '@mui/icons-material';
import { theme } from '@dsb-client-gateway/ui/utils';

export interface SearchProps {
  filter: string;
  setFilter: (value: string) => void;
  debounceTime?: number;
}

export function Search({filter, setFilter, debounceTime = 300}: SearchProps) {
  const [value, setValue] = React.useState(filter);
  const onChange = useAsyncDebounce((value: string) => {
    setFilter(value || '');
  }, debounceTime);

  const handleClick = () => {
    setValue('');
    onChange('');
  }

  return (
    <div style={{display: 'flex', margin: '16px 0', alignItems: 'center'}}>
      <label>Search</label>
      <TextField
        margin='dense'
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder='Search'
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {value ? <Close style={{color: theme.palette.common.white, cursor: 'pointer'}} onClick={handleClick} /> : null}
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}

