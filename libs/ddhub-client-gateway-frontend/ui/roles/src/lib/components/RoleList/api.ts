import { useQuery } from 'react-query';
import { RoleStatus, ExpirationStatus } from './RoleList.types';

const fakeRolesData = [
  {
    requestDate: '2023-11-15T09:23:45Z',
    role: 'admin',
    namespace: 'admin.namespace',
    status: RoleStatus.active,
    expirationStatus: ExpirationStatus.expired,
    expirationDate: '2024-11-15T09:23:45Z',
  },
  {
    requestDate: '2023-10-22T14:32:18Z',
    role: 'user',
    namespace: 'user.namespace',
    status: RoleStatus.pending,
    expirationStatus: null,
    expirationDate: '2024-01-22T14:32:18Z',
  },
  {
    requestDate: '2023-09-05T11:15:30Z',
    role: 'dev',
    namespace: 'reader.namespace',
    status: RoleStatus.requested,
    expirationStatus: ExpirationStatus.expired,
    expirationDate: '2023-12-05T11:15:30Z',
  },
  {
    requestDate: '2023-12-01T08:45:12Z',
    role: 'max',
    namespace: 'max.roles.max.apps.aemo.iam.ew',
    status: RoleStatus.synced,
    expirationStatus: ExpirationStatus.expired,
    expirationDate: '2025-12-01T08:45:12Z',
  },
  {
    requestDate: '2023-08-17T16:20:55Z',
    role: 'admin',
    namespace: 'guest.namespace',
    status: RoleStatus.synced,
    expirationStatus: 'expired',
    expirationDate: '2023-11-17T16:20:55Z',
  },
];

export const useGetMyRoles = () => {
  return useQuery({
    queryKey: ['myRolesList'],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fakeRolesData);
        }, 2000);
      }) as Promise<typeof fakeRolesData>;
    },
  });
};
