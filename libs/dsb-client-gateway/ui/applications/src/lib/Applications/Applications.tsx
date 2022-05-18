import { useApplications } from "@dsb-client-gateway/ui/api-hooks";
import { GenericTable } from "@dsb-client-gateway/ui/core";
import { APPLICATIONS_HEADERS } from "../models/applications-header";
import { ApplicationDTO } from "@dsb-client-gateway/dsb-client-gateway-api-client";

export interface ApplicationsProps {
  role?: string;
  topicUrl?: string;
}

export function Applications({role, topicUrl}: ApplicationsProps) {
  const { applications, applicationsFetched, handleRowClick } = useApplications(role, topicUrl);

  return (
    <section style={{ marginTop: 16 }}>
      <GenericTable<ApplicationDTO>
        headers={APPLICATIONS_HEADERS}
        tableRows={applications}
        onRowClick={handleRowClick}
        loading={!applicationsFetched}
        showFooter={false}
      />
    </section>
  );
}
