import { FormEvent, KeyboardEvent, useState } from 'react';

export interface AnonymousRecipientSelectProps {
  setRecipientInput: (value: string) => void;
  handleSaveRecipient: () => void;
  handleUpdateRecipient?: (value: string) => void;
  inputValue?: string;
  isUpdate?: boolean;
  handleClose: () => void;
  recipientInput: string;
}

export const useAnonymousRecipientSelectEffects = (
  {
    handleSaveRecipient,
    handleUpdateRecipient,
    inputValue,
    setRecipientInput,
    isUpdate,
    handleClose,
  }: AnonymousRecipientSelectProps) => {
  const [success, setSuccess] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLImageElement>) => {
    e.stopPropagation();
  };

  const recipientInputChangeHandler = (value: string) => {
    if (success) {
      setSuccess(false);
    }

    setRecipientInput(value);
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUpdate) {
      handleUpdateRecipient(inputValue);
      handleClose();
    } else {
      handleSaveRecipient();
      setSuccess(true);
    }
  };

  return {
    handleKeyDown,
    handleSubmitForm,
    recipientInputChangeHandler,
    success,
  };
};
