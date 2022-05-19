import { GetChannelResponseDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { DataMessagingDownload } from '@ddhub-client-gateway-frontend/ui/messaging';
import { routerConst } from '@ddhub-client-gateway-frontend/ui/utils';

export default function LargeFileDownload() {
  return (
    <DataMessagingDownload
      channelUrl={routerConst.LargeFileDownloadChannel}
      channelType={GetChannelResponseDtoType.download}
    />
  );
}
