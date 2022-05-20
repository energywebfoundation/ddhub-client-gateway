import { FC } from "react";
import { Box } from "@mui/material";
import { GetChannelResponseDtoType } from '@dsb-client-gateway/dsb-client-gateway-api-client';
import { GenericTable, TableHeader } from "@ddhub-client-gateway-frontend/ui/core";
import { useDataMessagingDownloadEffects } from "./DataMessagingDownload.effects";

export interface DataMessagingDownloadProps {
  channelType: GetChannelResponseDtoType;
  channelUrl: string;
}

const headers: TableHeader[] = [
  {accessor: 'fqcn', Header: 'CHANNELS'}
]


export const DataMessagingDownload: FC<DataMessagingDownloadProps> = (props) => {
  const {channels, isLoading, navigate} = useDataMessagingDownloadEffects(props);
  return <Box>
    <GenericTable headers={headers} tableRows={channels} loading={isLoading} onRowClick={navigate} />
  </Box>
}
