import { FC, ChangeEvent, ReactNode } from 'react';
import { ChevronDown } from 'react-feather';
import {
  Box,
  BoxProps,
  TextField,
  InputLabel,
  Autocomplete as MuiAutocomplete,
} from '@mui/material';
import { useStyles } from './Autocomplete.styles';

interface AutocompleteProps {
  options: any[];
  onChange?: (event: React.SyntheticEvent, value: any) => void;
  onTextChange?: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  onInputChange?: (event: React.SyntheticEvent, value: string) => void;
  renderOption?: (props: any, option: any) => ReactNode;
  label?: string;
  inputValue?: string;
  popupIcon?: ReactNode;
  loading?: boolean;
  placeholder?: string;
  wrapperProps?: BoxProps;
}

export const Autocomplete: FC<AutocompleteProps> = ({
  label,
  onChange,
  onInputChange,
  onTextChange,
  placeholder,
  options,
  popupIcon,
  inputValue,
  renderOption,
  loading,
  wrapperProps
}) => {
  const { classes } = useStyles();
  return (
    <Box {...wrapperProps}>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <MuiAutocomplete
        disablePortal
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        popupIcon={popupIcon ?? <ChevronDown size={20} />}
        inputValue={inputValue}
        loading={loading}
        renderOption={renderOption}
        classes={{
          popupIndicator: classes.popupIcon,
          clearIndicator: classes.clearIndicator,
          option: classes.menuItem,
          listbox: classes.listBox,
          paper: classes.paper
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            classes={{ root: classes.autocomplete }}
            onChange={onTextChange}
          />
        )}
      />
    </Box>
  );
};
