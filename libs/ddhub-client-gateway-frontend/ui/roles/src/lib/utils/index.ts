export const getOrganizationNamespace = (
  namespace: string
): [string, string] => {
  const [mainOrg, subOrg] = namespace
    .split('.apps.')[1]
    .split('.')
    .slice(0, -2)
    .reverse();
  return [mainOrg, subOrg];
};

export const getApplicationNamespace = (namespace: string): string => {
  return namespace.split('.apps.')[0].split('.').at(-1) ?? '';
};
