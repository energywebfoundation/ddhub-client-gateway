import { useQuery } from 'react-query';

const fakeNamespacesData = [
  {
    name: 'max.apps.aemo.iam.ew',
    namespace: 'max.apps.aemo.iam.ew',
    appName: 'max',
    logoUrl: 'https://example.com/logo.png',
  },
  {
    name: 'next.apps.aemo.iam.ew.admin',
    namespace: 'next.apps.aemo.iam.ew.admin',
    appName: 'next',
    logoUrl: 'https://example.com/logo.png',
  },
  {
    name: 'edge.apps.aemo.iam.ew.admin',
    namespace: 'edge.apps.aemo.iam.ew.admin',
    appName: 'edge',
    logoUrl: 'https://example.com/logo.png',
  },
  {
    name: 'max2.apps.aemo.iam.ew',
    namespace: 'max2.apps.aemo.iam.ew',
    appName: 'max2',
    logoUrl: 'https://example.com/logo.png',
  },
];

const fakeRolesData: Record<
  | 'max.apps.aemo.iam.ew'
  | 'next.apps.aemo.iam.ew.admin'
  | 'edge.apps.aemo.iam.ew.admin'
  | 'max2.apps.aemo.iam.ew',
  { role: string; namespace: string }[]
> = {
  'max.apps.aemo.iam.ew': [
    {
      role: 'max',
      namespace: 'max.roles.max.apps.aemo.iam.ew',
    },
    {
      role: 'max2',
      namespace: 'max2.roles.max.apps.aemo.iam.ew',
    },
  ],
  'next.apps.aemo.iam.ew.admin': [
    {
      role: 'next',
      namespace: 'next.roles.next.apps.aemo.iam.ew',
    },
    {
      role: 'max2',
      namespace: 'max2.roles.next.apps.aemo.iam.ew',
    },
  ],
  'edge.apps.aemo.iam.ew.admin': [
    {
      role: 'edge',
      namespace: 'edge.roles.edge.apps.aemo.iam.ew',
    },
    {
      role: 'edge2',
      namespace: 'edge2.roles.edge.apps.aemo.iam.ew',
    },
  ],
  'max2.apps.aemo.iam.ew': [
    {
      role: 'max2',
      namespace: 'max2.roles.max2.apps.aemo.iam.ew',
    },
    {
      role: 'max3',
      namespace: 'max3.roles.max2.apps.aemo.iam.ewś',
    },
  ],
};

export const useSearchNamespaces = (searchKey: string | undefined) => {
  return useQuery({
    queryKey: ['namespaces', searchKey],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fakeNamespacesData);
        }, 2000);
      }) as Promise<typeof fakeNamespacesData>;
    },
  });
};

export const useGetRolesForNamespace = (namespace: string) => {
  return useQuery({
    queryKey: ['roles', namespace],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fakeRolesData[namespace as keyof typeof fakeRolesData]);
        }, 2000);
      }) as Promise<typeof fakeRolesData[keyof typeof fakeRolesData]>;
    },
  });
};
