import { SelectRoles } from '../../../../components';
import { SelectNamespaceStep } from '../../../../components/SelectNamespace/SelectNamespace';

export const Search = ({
  namespace,
  setNamespace,
  options,
  searchKey,
  setSearchKey,
  toggleRole,
  roles,
  myRoles,
  role,
}: {
  namespace: string;
  setNamespace: (namespace: string) => void;
  options: {
    name: string;
    namespace: string;
    appName: string;
    logoUrl: string;
  }[];
  searchKey: string;
  setSearchKey: (searchKey: string) => void;
  toggleRole: (role: string) => void;
  roles: {
    role: string;
    namespace: string;
  }[];
  myRoles: {
    role: string;
    namespace: string;
    status: string;
  }[];
  role: string;
}) => {
  return (
    <div>
      <SelectNamespaceStep
        namespace={namespace}
        setNamespace={setNamespace}
        options={options}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <SelectRoles
        namespace={namespace}
        role={role}
        toggleRole={toggleRole}
        roles={roles}
        myRoles={myRoles?.filter((r) => r.status === 'SYNCED')}
      />
    </div>
  );
};
