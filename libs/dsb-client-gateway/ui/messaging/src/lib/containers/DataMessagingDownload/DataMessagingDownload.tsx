import { FC } from "react";
import { Box } from "@mui/material";
import { GenericTable, TableHeader } from "@dsb-client-gateway/ui/core";
import { useDataMessagingDownloadEffects } from "./DataMessagingDownload.effects";

const headers: TableHeader[] = [
  {accessor: 'fqcn', Header: 'CHANNELS'}
]


export const DataMessagingDownload: FC = () => {
  const {channels, isLoading, navigate} = useDataMessagingDownloadEffects();
  return <Box>
    <GenericTable headers={headers} tableRows={channels} loading={isLoading} onRowClick={navigate} />
  </Box>
}
