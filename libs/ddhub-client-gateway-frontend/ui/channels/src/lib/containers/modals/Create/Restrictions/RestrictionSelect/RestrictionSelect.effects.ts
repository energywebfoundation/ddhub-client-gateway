import { KeyboardEvent, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { RestrictionType } from '../models/restriction-type.enum';
import { RestrictionSelectProps } from './RestrictionSelect';

export interface RestrictionSelectEffectsProps {
  setType: (value: RestrictionType) => void;
  clear: () => void;
  selectedType?: RestrictionType;
  handleSaveRestriction: () => void;
  handleUpdateRestriction?: (value: string) => void;
  inputValue?: string;
}

export const useRestrictionSelectEffects = (
  {
    setType,
    clear,
    selectedType,
    handleSaveRestriction,
    handleUpdateRestriction,
    inputValue,
  }: RestrictionSelectEffectsProps) => {
  const fields = {
    restrictionType: {
      name: 'restrictionType',
      label: 'Select',
      formInputsWrapperProps: {
        marginBottom: '20px',
      },
      options: [
        { label: RestrictionType.DID, value: RestrictionType.DID, subLabel: 'did:ethr:volta:0x09Df...46993' },
        { label: RestrictionType.Role, value: RestrictionType.Role, subLabel: 'user.roles.namespace.ewc' },
      ],
    },
  };

  const { control, watch } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { restrictionType: selectedType ?? RestrictionType.DID },
  });

  const selectedRestrictionType = watch('restrictionType');

  useEffect(() => {
    const subscription = watch((value) => {
      setType(value['restrictionType']);
      clear();
    });
    return () => subscription.unsubscribe();
  }, [watch, selectedType]);

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    if (e.key.toLowerCase() === 's') {
      e.stopPropagation();
    }
  };

  const handleSubmitForm = () => {
    if (selectedType) {
      handleUpdateRestriction(inputValue);
    } else {
      handleSaveRestriction();
    }
  };

  return {
    setType,
    handleKeyDown,
    control,
    fields,
    selectedRestrictionType,
    handleSubmitForm,
  };
};
