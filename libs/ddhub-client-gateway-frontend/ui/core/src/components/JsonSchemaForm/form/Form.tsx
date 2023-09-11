import { RJSFValidationError, RegistryWidgetsType } from '@rjsf/utils';
import Form, { withTheme, FormProps } from '@rjsf/core';
import { Templates, Theme } from '@rjsf/mui';
import {
  CheckboxesWidget,
  DateTimeWidget,
  RadioWidget,
  SelectWidget,
} from '../widgets';
import {
  CustomArrayFieldItemTemplate,
  CustomArrayFieldTemplate,
  TextFieldInputTemplate,
  FieldTemplate,
} from '../templates';
import { Ref, useRef } from 'react';
import { useStyles } from './Form.styles';

const { ArrayFieldItemTemplate } = Templates;

const customTemplates = {
  FieldTemplate: FieldTemplate,
  ArrayFieldTemplate: CustomArrayFieldTemplate,
  ArrayFieldItemTemplate:
    CustomArrayFieldItemTemplate as typeof ArrayFieldItemTemplate, // recast back to original type as it doesn't like the custom props
  BaseInputTemplate: TextFieldInputTemplate,
};

const customWidgets: RegistryWidgetsType = {
  'date-time': DateTimeWidget,
  RadioWidget: RadioWidget,
  CheckboxesWidget: CheckboxesWidget,
  SelectWidget: SelectWidget,
};

const MuiForm = withTheme(Theme);

export const JSONSchemaForm = (props: FormProps) => {
  const formRef = useRef<Form>();
  const { classes } = useStyles();
  const mutableProps = { ...props };
  mutableProps.uiSchema = {
    ...mutableProps.uiSchema,
    'ui:submitButtonOptions': {
      norender: true,
    },
  };

  return (
    <MuiForm
      className={classes.root}
      ref={formRef as Ref<Form>}
      templates={customTemplates}
      widgets={customWidgets}
      transformErrors={transformErrors(formRef.current)}
      {...mutableProps}
    />
  );
};

const transformErrors = (form?: Form) => {
  const formData = form?.state.formData ?? {};
  if (!formData) {
    return (errors: RJSFValidationError[]) => errors;
  }

  return (errors: RJSFValidationError[]) => {
    if (errors.length === 0) {
      return errors;
    }
    const acc: RJSFValidationError[] = [];
    return errors.reduce((errorsList, error) => {
      const isPropDirty = error.property && error.property in formData;
      return isPropDirty ? [...errorsList, error] : errorsList;
    }, acc);
  };
};
