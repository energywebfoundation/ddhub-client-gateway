import { useEffect, useRef, useState } from 'react';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';
import { debounce } from 'lodash';
import {
  useContactSave,
  useUpdateContact,
} from '@ddhub-client-gateway-frontend/ui/api-hooks';
const didRegex = new RegExp(/^did:[a-z0-9]+:([a-z0-9]+:)?(0x[0-9a-fA-F]{40})$/);

export const useAddUpdateContactEffects = () => {
  const [aliasInput, setAliasInput] = useState('');
  const [didInput, setDidInput] = useState('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const dispatch = useModalDispatch();
  const Swal = useCustomAlert();
  const { createContactHandler, isLoading } = useContactSave();
  const { updateContactHandler, isLoading: isLoadingUpdate } =
    useUpdateContact();

  const {
    addContact: { open },
    updateContact: { open: openUpdate, data },
  } = useModalStore();

  const debouncedInput = useRef(
    debounce((value) => {
      if (value) {
        setIsValid(didRegex.test(value));
      } else {
        setIsValid(true);
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (data && openUpdate) {
      setDidInput(data.did);
      setAliasInput(data.alias);
    }

    if (open) {
      clear();
    }
    return () => {
      debouncedInput.cancel();
    };
  }, [debouncedInput, data]);

  const closeModal = () => {
    if (openUpdate) {
      dispatch({
        type: ModalActionsEnum.SHOW_UPDATE_CONTACT,
        payload: {
          open: false,
          data: undefined,
        },
      });
    } else {
      dispatch({
        type: ModalActionsEnum.SHOW_ADD_CONTACT,
        payload: {
          open: false,
        },
      });
    }
  };

  const clear = () => {
    setAliasInput('');
    setDidInput('');
    setIsDirty(false);
    setIsValid(true);
  };

  const showModal = () => {
    if (openUpdate) {
      dispatch({
        type: ModalActionsEnum.SHOW_UPDATE_CONTACT,
        payload: {
          open: true,
          data: {
            did: didInput,
            alias: aliasInput,
          },
        },
      });
    } else {
      dispatch({
        type: ModalActionsEnum.SHOW_ADD_CONTACT,
        payload: {
          open: true,
        },
      });
    }
  };

  const openCancelModal = async () => {
    closeModal();
    const result = await Swal.warning({
      text: `you will close ${openUpdate ? 'Update' : 'Add'} DID form`,
    });

    if (result.isConfirmed) {
      clear();
      closeModal();
    } else {
      showModal();
    }
  };

  const didInputChangeHandler = (value: string) => {
    setDidInput(value);
    debouncedInput(value);
  };

  const aliasInputChangeHandler = (value: string) => {
    if (!isDirty) {
      setIsDirty(true);
    }
    setAliasInput(value);
  };

  const onSuccess = () => {
    clear();
    closeModal();
    Swal.success({
      text: `You have successfully ${
        openUpdate ? 'updated the' : 'created'
      } contact.`,
    });
  };

  const createUpdateContact = () => {
    const data = {
      did: didInput,
      alias: aliasInput,
    };

    if (openUpdate) {
      updateContactHandler(data, onSuccess);
    } else {
      createContactHandler(data, onSuccess);
    }
  };

  const buttonDisabled = !aliasInput || !didInput;

  return {
    open,
    openUpdate,
    closeModal,
    openCancelModal,
    createUpdateContact,
    buttonDisabled,
    clear,
    isSaving: isLoading || isLoadingUpdate,
    didInput,
    aliasInput,
    didInputChangeHandler,
    isValid,
    aliasInputChangeHandler,
    isDirty,
  };
};
