import { Download } from 'react-feather';
import { useTopicVersion } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { downloadJson } from '@ddhub-client-gateway-frontend/ui/utils';
import { fields } from './ChannelTopicDetails.utils';
import {
  useModalDispatch,
  useModalStore,
  ModalActionsEnum,
} from '../../../context';
import { useStyles } from './ChannelTopicDetails.styles';

export const useChannelTopicDetailsEffects = () => {
  const { classes } = useStyles();
  const {
    topicDetails: { open, data },
  } = useModalStore();
  const dispatch = useModalDispatch();

  const { topic: topicWithSchema, isLoading } = useTopicVersion(
    data?.topic?.id,
    data?.topic?.version
  );

  const closeModal = () => {
    dispatch({
      type: ModalActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: false,
        data: undefined,
      },
    });
  };

  const exportSchema = () => {
    downloadJson(
      topicWithSchema.schema,
      `Schema_${topicWithSchema.name}_${topicWithSchema.version}.json`
    );
  };

  const buttons = [
    {
      name: 'download',
      icon: <Download className={classes.icon} />,
      onClick: exportSchema,
      wrapperClassName: classes.downloadIconButton,
    },
  ];

  const details = {
    application: data?.application,
    topic: topicWithSchema,
  };

  return {
    open,
    closeModal,
    isLoading,
    details,
    buttons,
    fields,
  };
};
