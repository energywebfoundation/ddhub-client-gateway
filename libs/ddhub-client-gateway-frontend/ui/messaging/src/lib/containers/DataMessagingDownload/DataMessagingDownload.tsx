import { FC } from "react";
import { Box } from "@mui/material";
import { GenericTable, TableHeader } from "@ddhub-client-gateway-frontend/ui/core";
import { useDataMessagingDownloadEffects } from "./DataMessagingDownload.effects";

export interface DataMessagingDownloadProps {
  isLarge?: boolean;
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
