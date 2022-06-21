import { Edit, Download } from 'react-feather';
import { useRouter } from 'next/router';
import { useTopicVersion } from '@ddhub-client-gateway-frontend/ui/api-hooks';
import { downloadJson, Queries, routerConst } from '@ddhub-client-gateway-frontend/ui/utils';
import {
  useTopicsModalsStore,
  useTopicsModalsDispatch,
  TopicsModalsActionsEnum,
} from '../../../context';
import { fields } from './ViewTopicDetails.utils';
import { useStyles } from './ViewTopicDetails.styles';
import { useSetUserDataEffect, useUserData } from '@ddhub-client-gateway-frontend/ui/login';

export const useViewTopicDetailsEffects = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const {userData} = useSetUserDataEffect();
  const {
    topicDetails: { open, topic, application },
  } = useTopicsModalsStore();
  const dispatch = useTopicsModalsDispatch();

  const topicId = router.query[Queries.TopicId as string];

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
        canUpdateSchema: !!topicId,
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
      wrapperClassName: classes.downloadIconButton,
    },
  ];

  if (userData.displayedRoutes.has(routerConst.TopicManagement)) {
    buttons.push(
      {
        name: 'edit',
        icon: <Edit className={classes.icon} />,
        onClick: openUpdateTopic,
        wrapperClassName: classes.editIconButton,
      },
    )
  }

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
