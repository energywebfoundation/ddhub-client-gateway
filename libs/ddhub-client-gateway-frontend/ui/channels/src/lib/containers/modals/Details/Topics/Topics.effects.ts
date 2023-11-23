import React, { useState } from 'react';
import {
  ChannelTopic,
  GetTopicSearchDto,
  ResponseTopicDto,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { ModalActionsEnum, useModalDispatch } from '../../../../context';
import { useApplications } from '@ddhub-client-gateway-frontend/ui/api-hooks';

export const useTopicsEffects = (responseTopics: ResponseTopicDto[]) => {
  const dispatch = useModalDispatch();
  const { applicationsByNamespace } = useApplications('user');
  const [page, setPage] = useState(0);
  const [expandResponse, setExpandResponse] = useState<{
    [index: string]: boolean;
  }>({});

  const hideModal = () => {
    dispatch({
      type: ModalActionsEnum.HIDE_DETAILS,
      payload: true,
    });
  };

  const openTopicDetails = (data: ChannelTopic) => {
    hideModal();

    const application = applicationsByNamespace[data.owner];

    dispatch({
      type: ModalActionsEnum.SHOW_TOPIC_VERSION_DETAILS,
      payload: {
        open: true,
        data: {
          topic: data,
          application,
          versions: [] as GetTopicSearchDto[],
        },
      },
    });
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const getSelectedResponseTopics = (selectedTopicId: string) => {
    const selectedResponseTopics = responseTopics.filter(
      (topic) => topic.responseTopicId === selectedTopicId,
    );

    return selectedResponseTopics;
  };

  return {
    openTopicDetails,
    page,
    handleChangePage,
    expandResponse,
    setExpandResponse,
    getSelectedResponseTopics,
  };
};
