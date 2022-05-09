import { FC } from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { useStyles } from '../FormInput/FormInput.styles';

export const TextField: FC<TextFieldProps> = (props) => {
  const { classes } = useStyles();
  return <MuiTextField fullWidth classes={{ root: classes.root }} {...props} />;
};
