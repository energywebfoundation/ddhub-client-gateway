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
  freeSolo?: boolean;
  className?: string;
  label?: string;
  value?: string;
  inputValue?: string;
  popupIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  wrapperProps?: BoxProps;
}

export const Autocomplete: FC<AutocompleteProps> = ({
  className,
  freeSolo,
  label,
  onChange,
  onInputChange,
  onTextChange,
  placeholder,
  options,
  popupIcon,
  value,
  inputValue,
  renderOption,
  loading,
  disabled,
  wrapperProps,
}) => {
  const { classes } = useStyles();
  return (
    <Box {...wrapperProps}>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <MuiAutocomplete
        disablePortal
        disabled={disabled}
        freeSolo={freeSolo}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        value={value}
        inputValue={inputValue}
        loading={loading}
        renderOption={renderOption}
        popupIcon={
          popupIcon ?? <ChevronDown className={classes.popupIcon} size={20} />
        }
        className={className}
        classes={{
          popupIndicator: classes.popupIcon,
          clearIndicator: classes.clearIndicator,
          option: classes.menuItem,
          listbox: classes.listBox,
          paper: classes.paper,
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
