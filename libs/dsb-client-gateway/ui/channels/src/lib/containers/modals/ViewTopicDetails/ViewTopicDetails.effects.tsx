import { Download } from 'react-feather';
import { useTopicVersion } from '@dsb-client-gateway/ui/api-hooks';
import { downloadJson } from '@dsb-client-gateway/ui/utils';
import { fields } from './ViewTopicDetails.utils';
import {
 useModalDispatch,
 useModalStore,
 ModalActionsEnum
} from '../../../context';
import { useStyles } from './ViewTopicDetails.styles';

export const useViewTopicDetailsEffects = () => {
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
        data: undefined
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
      icon: <Download className={classes.icon} />,
      onClick: exportSchema,
      wrapperClassName: classes.downloadIconButton
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
