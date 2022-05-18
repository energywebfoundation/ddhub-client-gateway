import { Edit, Download } from 'react-feather';
import { useTopicVersion } from '@dsb-client-gateway/ui/api-hooks';
import { downloadJson } from '@dsb-client-gateway/ui/utils';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';
import { fields } from './ViewTopicDetails.utils';
import { useStyles } from './ViewTopicDetails.styles';

export const useViewTopicDetailsEffects = () => {
  const { classes } = useStyles();
  const {
    topicDetails: { open, topic, application },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const { topic: topicWithSchema, isLoading } = useTopicVersion(
    topic?.id,
    topic?.version
  );

  const closeModal = () => {
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_TOPIC_DETAILS,
      payload: {
        open: false,
        topic: null,
        application: null,
        canUpdateSchema: false,
      },
    });
  };

  const openUpdateTopic = () => {
    closeModal();
    dispatch({
      type: TopicsModalsActionsEnum.SHOW_UPDATE_TOPIC,
      payload: {
        open: true,
        canUpdateSchema: true,
        application,
        topic,
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
      wrapperClassName: classes.downloadIconButton
    },
    {
      name: 'edit',
      icon: <Edit className={classes.icon} />,
      onClick: openUpdateTopic,
      wrapperClassName: classes.editIconButton
    },
  ];

  const details = {
    application,
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
