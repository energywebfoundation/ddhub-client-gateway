import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { Stack } from '@mui/material';
import { GetTopicSearchDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useTopicVersionHistoryEffects } from './TopicVersionHistory.effects';
import { VERSION_HISTORY_HEADERS } from '../../models/version-history-header';
import { TopicInfo } from '@ddhub-client-gateway-frontend/ui/topics';

export function TopicVersionHistory() {
  const {
    applicationNamespace,
    topicHistory,
    topicId,
    loading,
    openTopicDetails,
  } = useTopicVersionHistoryEffects();

  return (
    <Stack spacing={2} direction="row">
      <TopicInfo
        applicationNamespace={applicationNamespace}
        topicId={topicId}
      />
      <div style={{ flex: 3 }}>
        <GenericTable<GetTopicSearchDto>
          headers={VERSION_HISTORY_HEADERS}
          tableRows={topicHistory}
          onRowClick={openTopicDetails}
          showSearch={false}
          loading={loading}
        />
      </div>
    </Stack>
  );
}
