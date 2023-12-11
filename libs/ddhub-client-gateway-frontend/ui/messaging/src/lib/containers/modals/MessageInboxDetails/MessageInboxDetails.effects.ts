import { useState, useEffect } from 'react';
import { capitalize, isObject } from 'lodash';
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
    inboxDetails: { open, ackMessage, openReplyModal, data: inboxDetails },
  } = useModalStore();

  useEffect(() => {
    setParsedDetails([]);

    if (!inboxDetails) return;

    const parsed = parsePayload(inboxDetails?.payload);
    setParsedPayload(parsed);

    if (Array.isArray(parsed)) {
      const parsedArray: any[] = [];

      parsed.forEach((item: any) => {
        const parsedItem = parsePayloadItems(item);
        parsedArray.push(parsedItem);
      });

      setParsedDetails(parsedArray);
    } else {
      setParsedDetails([parsePayloadItems(parsed)]);
    }
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

  const parsePayloadItems = (parsed: any) => {
    const parsedArrayItem: any[] = [];

    Object.entries(parsed).forEach(([name, value]) => {
      const validValue = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
      const valueArray = isObject(value) ? value : [];
      const formattedKey = camelToFlat(name);

      parsedArrayItem.push({
        label: capitalize(formattedKey),
        value: validValue ? value.toString() : '',
        valueArray,
        isEntryView: true,
      });
    });

    return parsedArrayItem;
  };

  const camelToFlat = (camel: string) => {
    const camelCase = camel.replace(/([a-z])([A-Z])/g, '$1 $2');

    return camelCase;
  };

  return {
    open,
    closeModal,
    ackMessage,
    openReplyModal,
    inboxDetails,
    parsedPayload,
    parsedDetails,
  };
};
