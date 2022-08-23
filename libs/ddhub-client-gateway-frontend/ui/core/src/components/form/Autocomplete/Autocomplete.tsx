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
  value?: string | undefined;
  inputValue?: string;
  popupIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  wrapperProps?: BoxProps;
  filterOptions?: (options: Array<any>, state: object) => Array<any>;
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
  filterOptions,
}) => {
  const { classes } = useStyles();
  return (
    <Box {...wrapperProps}>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <MuiAutocomplete
        disablePortal
        filterSelectedOptions
        disableClearable={!value}
        disabled={disabled}
        freeSolo={freeSolo}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        value={value}
        inputValue={inputValue}
        loading={loading}
        renderOption={renderOption}
        filterOptions={filterOptions}
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
          noOptions: classes.noOptions,
        }}
        renderInput={(params) => (
          <TextField
            autoComplete='off'
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
