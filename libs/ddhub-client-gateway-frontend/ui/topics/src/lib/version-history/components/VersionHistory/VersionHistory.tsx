import { GenericTable } from '@ddhub-client-gateway-frontend/ui/core';
import { Stack } from '@mui/material';
import { GetTopicSearchDto } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { useVersionHistoryEffects } from '../../VersionHistory.effects';
import { VERSION_HISTORY_HEADERS } from '../../models/version-history-header';
import { TopicInfo } from '../TopicInfo/TopicInfo';

export function VersionHistory() {
  const {
    applicationNamespace,
    topicHistory,
    topicId,
    actions,
    topicHistoryLoaded,
  } = useVersionHistoryEffects();

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
          showSearch={false}
          actions={actions}
          loading={!topicHistoryLoaded}
        />
      </div>
    </Stack>
  );
}
