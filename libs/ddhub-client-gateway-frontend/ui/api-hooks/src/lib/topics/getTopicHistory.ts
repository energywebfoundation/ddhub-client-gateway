import { keyBy } from 'lodash';
import { useState } from 'react';
import {
  GetTopicSearchDto,
  useTopicsControllerGetTopicsHistoryById,
  TopicsControllerGetTopicsHistoryByIdParams,
  PaginatedResponse,
} from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useCustomAlert } from '@ddhub-client-gateway-frontend/ui/core';

interface useTopicVersionHistoryProps
  extends TopicsControllerGetTopicsHistoryByIdParams {
  id: string;
}

export const useTopicVersionHistory = ({
  id,
  page = 1,
  limit = 0,
}: useTopicVersionHistoryProps) => {
  const Swal = useCustomAlert();
  const [params, setParams] = useState({ page, limit });

  const { data, isLoading, isSuccess, isError, refetch } =
    useTopicsControllerGetTopicsHistoryById(
      id,
      { page: params.page, limit: params.limit },
      {
        query: {
          enabled: !!id,
          onError: (err: any) => {
            console.error(err);
            Swal.httpError(err);
          },
        },
      },
    );
  const paginated = data ?? ({} as PaginatedResponse);
  const topicHistory: GetTopicSearchDto[] = paginated?.records ?? [];
  const topicHistoryByVersion = keyBy(topicHistory, 'version');
  const topicHistoryLoaded = isSuccess && data !== undefined && !isError;

  const getTopicHistory = async ({
    page = 1,
    limit = 10,
  }: TopicsControllerGetTopicsHistoryByIdParams) => {
    setParams({ page, limit });
  };

  const pagination = {
    limit: paginated?.limit,
    count: paginated?.count,
    page: paginated?.page,
  };

  return {
    topicHistory,
    topicHistoryByVersion,
    isLoading,
    topicHistoryLoaded,
    getTopicHistory,
    pagination,
    refetch,
  };
};
