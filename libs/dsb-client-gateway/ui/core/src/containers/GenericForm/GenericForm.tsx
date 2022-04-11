import { memo, FC } from 'react';
import { isEmpty } from 'lodash';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { FormSelect, FormInput } from '../../components/form';
import { useGenericFormEffects } from './GenericForm.effects';
import { GenericFormProps } from './GenericForm.types';

export const GenericForm: FC<GenericFormProps> = memo(
  ({
    fields,
    submitHandler,
    validationSchema,
    initialValues,
    buttonText,
    hideSubmitButton = false,
    formTitle,
    formTitleVariant,
    buttonFullWidth = false,
    buttonProps,
    buttonWrapperProps,
    secondaryButtons,
    formClass,
    inputsVariant,
    formInputsProps,
    validationMode = 'onBlur',
    loading = false,
    formDisabled = false,
    children,
  }) => {
    const {
      control,
      register,
      onSubmit,
      errors,
      submitButtonDisabled
    } = useGenericFormEffects({
      validationSchema,
      submitHandler,
      initialValues,
      validationMode
    });

    return (
      <form onSubmit={onSubmit} className={formClass}>
        {formTitle && (
          <Box>
            <Typography variant={formTitleVariant ?? 'h4'}>
              {formTitle}
            </Typography>
          </Box>
        )}
        {fields.map(
          (field) =>
            (field.select && (
              <FormSelect
                key={field.label}
                field={field}
                control={control}
                errorExists={!isEmpty((errors as any)[field.name])}
                errorText={(errors as any)[field.name]?.message ?? ''}
                variant={inputsVariant}
                disabled={formDisabled}
                register={register}
              />
            )) || (
              <FormInput
                key={field.label}
                field={field}
                disabled={formDisabled}
                register={register}
                errorExists={!isEmpty((errors as any)[field.name])}
                errorText={(errors as any)[field.name]?.message ?? ''}
                variant={inputsVariant}
                {...formInputsProps}
              />
            )
        )}
        {children}
        <Box
          hidden={hideSubmitButton}
          my={2}
          display="flex"
          justifyContent="flex-end"
          {...buttonWrapperProps}
        >
          {secondaryButtons &&
            secondaryButtons.map((button) => (
              <Button key={`secondary-button-${button.label}`} {...button}>
                {button.label}
              </Button>
            ))}
          <Button
            fullWidth={buttonFullWidth}
            color="primary"
            name="submit"
            size="large"
            variant="contained"
            disabled={submitButtonDisabled || loading}
            type="submit"
            {...buttonProps}
          >
            {buttonText}
            {loading && (
              <Box ml={2}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Button>
        </Box>
      </form>
    );
  }
);
