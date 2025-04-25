import { RegistryWidgetsType } from '@rjsf/utils';
import Form, { withTheme, FormProps } from '@rjsf/core';
import { Templates, Theme } from '@rjsf/mui';
import { customizeValidator } from '@rjsf/validator-ajv8';
import {
  CheckboxesWidget,
  DateTimeWidget,
  RadioWidget,
  SelectWidget,
  CheckboxWidget,
} from '../widgets';
import {
  CustomArrayFieldItemTemplate,
  CustomArrayFieldTemplate,
  TextFieldInputTemplate,
  CustomFieldTemplate,
} from '../templates';
import { useStyles } from './Form.styles';
import { DateTime } from 'luxon';
import { createRef } from 'react';
import { get, omit, cloneDeep, set, unset } from 'lodash';

const MuiForm = withTheme(Theme);

const { FieldTemplate, ArrayFieldTemplate, ArrayFieldItemTemplate } = Templates;

// recast imported templates back to original type as it doesn't like custom props
const customTemplates = {
  FieldTemplate: CustomFieldTemplate as typeof FieldTemplate,
  ArrayFieldTemplate: CustomArrayFieldTemplate as typeof ArrayFieldTemplate,
  ArrayFieldItemTemplate:
    CustomArrayFieldItemTemplate as typeof ArrayFieldItemTemplate,
  BaseInputTemplate: TextFieldInputTemplate,
};

const customWidgets: RegistryWidgetsType = {
  CheckboxWidget: CheckboxWidget,
  'local-date-time': DateTimeWidget,
  RadioWidget: RadioWidget,
  CheckboxesWidget: CheckboxesWidget,
  SelectWidget: SelectWidget,
  DateWidget: DateTimeWidget,
  DateTimeWidget: DateTimeWidget,
};

const customFormats = {
  'local-date-time': (value: string): boolean => {
    return DateTime.fromISO(value).isValid;
  },
};
export const JSONSchemaFormValidator = customizeValidator({ customFormats });

const formRef = createRef<Form>();
export const JSONSchemaForm = ({
  errors,
  updateErrors,
  changeHandler,
  ...otherProps
}: FormProps & {
  errors: any;
  updateErrors: any;
  changeHandler: any;
}) => {
  const { classes } = useStyles();
  const mutableProps = { ...otherProps };
  mutableProps.validator = otherProps.validator ?? JSONSchemaFormValidator;
  mutableProps.uiSchema = {
    ...mutableProps.uiSchema,
    'ui:submitButtonOptions': {
      norender: true,
    },
  };

  const blurHandler = (...args: string[]) => {
    const $this = formRef.current;
    if (!$this) {
      return;
    }
    const fieldPath = args[0].split('_').slice(1);
    const { formData, errorSchema: stateErrorSchema } = $this.state;
    const fieldValue = get(formData, fieldPath);
    // clear empty string values since JSON schema considers "" sufficient to pass `required` validation
    const formDataToValidate =
      fieldValue === '' ? omit(formData, fieldPath) : formData;

    const { errorSchema: validatedErrorSchema } =
      $this.validate(formDataToValidate);
    const newErrorSchema = cloneDeep(stateErrorSchema);
    const newFieldErrorSchema = get(validatedErrorSchema, fieldPath);

    if (newFieldErrorSchema) {
      set(newErrorSchema, fieldPath, newFieldErrorSchema);
    } else {
      // if there is no errorSchema for the field that was blurred, delete the key
      unset(newErrorSchema, fieldPath);
    }
    updateErrors(newErrorSchema);
  };

  return (
    <MuiForm
      ref={formRef}
      onBlur={blurHandler}
      onChange={(data, id) => {
        changeHandler(data, id);
      }}
      showErrorList={false}
      extraErrors={errors}
      extraErrorsBlockSubmit
      noValidate
      className={classes.root}
      templates={customTemplates}
      widgets={customWidgets}
      {...mutableProps}
    />
  );
};

// const transformErrors = (form?: Form) => {
//   const formData = form?.state.formData ?? {};
//   if (!formData) {
//     return (errors: RJSFValidationError[]) => errors;
//   }

//   return (errors: RJSFValidationError[]) => {
//     if (errors.length === 0) {
//       return errors;
//     }
//     const acc: RJSFValidationError[] = [];
//     return errors.reduce((errorsList, error) => {
//       const isPropDirty = error.property && error.property in formData;
//       return isPropDirty ? [...errorsList, error] : errorsList;
//     }, acc);
//   };
// };
