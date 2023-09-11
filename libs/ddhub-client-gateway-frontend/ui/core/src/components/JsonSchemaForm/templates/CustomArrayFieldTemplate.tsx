import {
  ArrayFieldTemplateItemType,
  ArrayFieldTemplateProps,
} from '@rjsf/utils';
import { useStyles } from '../../form/FormInput/FormInput.styles';
import { Box, InputLabel, TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { capitalizeFirstLetter } from '@ddhub-client-gateway-frontend/ui/utils';
import { CustomArrayFieldItemTemplate } from './CustomArrayFieldItemTemplate';

export const CustomArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { classes } = useStyles();
  const [value, setValue] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [items, setItems] = useState<ArrayFieldTemplateItemType[]>(props.items);

  useEffect(() => {
    if (props.items !== items) {
      setItems(
        props.items.map((item, i) => ({ ...item, classes, value: values[i] }))
      );
    }
  }, [props.items]);

  useEffect(() => {
    if (props.formData !== values && props.formData.every((v: string) => !!v)) {
      setValues(props.formData);
    }
  }, [props.formData]);

  const { title } = props;
  const textFieldProps: TextFieldProps = {
    classes: {
      root: classes.root,
    },
    label: '',
    value,
    disabled: !props.canAdd,
    placeholder: 'Enter a value',
    onKeyDown: (e) => {
      if (e.key === 'Enter' && !!value) {
        e.preventDefault();
        props.onAddClick();
        setValues([...values, value]);
        setValue('');
      }
    },
    onChange: (e) => {
      setValue(e.target.value);
    },
  };

  return (
    <Box>
      {title && (
        <InputLabel className={classes.label}>
          {capitalizeFirstLetter(title)}
        </InputLabel>
      )}
      <TextField {...textFieldProps} />
      <Box pl={1} pt={2}>
        {items.map((element, index) => {
          return (
            <Box key={element.key}>
              <CustomArrayFieldItemTemplate
                {...element}
                classes={classes}
                value={
                  element.children.props.formData
                    ? element.children.props.formData
                    : values[index]
                }
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
