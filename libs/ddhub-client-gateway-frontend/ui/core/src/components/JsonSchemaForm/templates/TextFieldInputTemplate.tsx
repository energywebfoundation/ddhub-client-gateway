import { BaseInputTemplateProps } from '@rjsf/utils';
import { Templates } from '@rjsf/mui';
import { Box, InputLabel } from '@mui/material';
import { useStyles } from '../../form/FormInput/FormInput.styles';

const { BaseInputTemplate } = Templates;

export const TextFieldInputTemplate = (props: BaseInputTemplateProps) => {
  const { classes } = useStyles();

  if (!BaseInputTemplate) {
    return <></>;
  }

  const { label } = props;
  const customProps = {
    label: '',
    placeholder: label,
    autoComplete: 'off',
    classes: {
      root: classes.root,
    },
  };

  return (
    <Box>
      {label && <InputLabel className={classes.label}>{label}</InputLabel>}
      <BaseInputTemplate {...props} {...customProps} />
    </Box>
  );
};
