import { useState, useEffect } from 'react';
import { capitalize } from 'lodash';
import {
  ModalActionsEnum,
  useModalDispatch,
  useModalStore,
} from '../../../context';
import { parsePayload } from '../../../utils';

export const useMessageInboxDetailsEffects = () => {
  const dispatch = useModalDispatch();
  const [parsedDetails, setParsedDetails] = useState([]);
  const [parsedPayload, setParsedPayload] = useState({});

  const {
    inboxDetails: { open, data: inboxDetails },
  } = useModalStore();

  useEffect(() => {
    setParsedDetails([]);

    if (!inboxDetails) return;

    const parsed = parsePayload(inboxDetails?.payload);
    setParsedPayload(parsed);

    const parsedArray: any[] = [];
    Object.entries(parsed).forEach(([name, value]) => {
      const validValue = typeof value === 'string' || typeof value === 'number';

      if (validValue) {
        const formattedKey = camelToFlat(name);

        parsedArray.push({
          label: capitalize(formattedKey),
          value: value.toString(),
          isEntryView: true,
        });
      }
    });

    setParsedDetails(parsedArray);
  }, [inboxDetails]);

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_MESSAGE_INBOX_DETAILS,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const camelToFlat = (camel: string) => {
    const camelCase = camel.replace(/([a-z])([A-Z])/g, '$1 $2');

    return camelCase;
  };

  return {
    open,
    closeModal,
    inboxDetails,
    parsedPayload,
    parsedDetails,
  };
};
