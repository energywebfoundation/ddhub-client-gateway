import { GenericTable, TTableComponentAction } from '@dsb-client-gateway/ui/core';
import { Stack } from '@mui/material';
import { useVersionHistoryEffects } from './VersionHistory.effects';
import { VERSION_HISTORY_HEADERS } from './models/version-history-header';
import { TopicInfo } from './components/TopicInfo/TopicInfo';

export function VersionHistoryContainer() {
  const {applicationNamespace, topicHistory, topicId, actions} = useVersionHistoryEffects();

  return <Stack spacing={2} direction="row">
    <TopicInfo applicationNamespace={applicationNamespace} topicId={topicId}/>
    <div style={{flex: 3}}>
      <GenericTable headers={VERSION_HISTORY_HEADERS} tableRows={topicHistory} showSearch={false} actions={actions}/>
    </div>
  </Stack>;
}
