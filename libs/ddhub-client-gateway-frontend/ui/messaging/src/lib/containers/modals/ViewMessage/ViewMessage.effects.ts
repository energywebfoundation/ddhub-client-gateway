import {
  useModalStore,
  useModalDispatch,
  ModalActionsEnum,
} from '../../../context';

export const useViewMessageEffects = () => {
  const dispatch = useModalDispatch();
  const {
    viewMessage: { open, data },
  } = useModalStore();

  const openViewMessageModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_VIEW_MESSAGE,
      payload: {
        open: true,
        data: [
          {
            initiatingMessageId: null,
            clientGatewayMessageId: 'ad57cb3e-b542-40d0-9b53-117f9de06b9f',
            topicId: '64e5b895986aee0cfb658c25',
            topicVersion: '4.0.0',
            transactionId: null,
            signature:
              '0xf02aa55228961637a42c0d0a05486368f6385825d26eeca6a8a99e6d5937899520e07c23990f6d4dbd7e7fe879ac3e965019c8034697f2ac84bfd4e93fd229751c',
            payloadEncryption: false,
            timestampNanos: '2023-09-13 16:32:38.512',
            isFile: false,
            totalRecipients: '28',
            totalSent: '27',
            totalFailed: '1',
            createdDate: '2023-09-13',
            updatedDate: '2023-09-13',
            initiatingTransactionId: null,
            senderDid:
              'did:ethr:volta:0x552761011ea5b332605Bc1Cc2020A4a4f8C738CD',
            payload:
              '{"firstName":"Chuck","checkboxes":[{"name":"New York","lon":74,"lat":40},{"name":"Amsterdam","lon":5,"lat":52}],"options":["Option 1","Option 2"],"moreOptions":["B","C"],"multiSelect":[{"name":"Hong Kong","lon":114,"lat":22},{"name":"Amsterdam","lon":5,"lat":52}],"transactionId":"1234","lastName":"Norris","location":{"name":"Hong Kong","lon":114,"lat":22},"locationRadio":{"name":"Hong Kong","lon":114,"lat":22},"age":21}',
          },
        ],
      },
    });
  };

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_VIEW_MESSAGE,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  return {
    openViewMessageModal,
    closeModal,
  };
};
