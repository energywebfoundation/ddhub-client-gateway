const getOrganizationPart = (namespace: string): string => {
  if (!namespace) {
    return '';
  }

  return namespace.includes('.apps.')
    ? (namespace.split('.apps.')[1] ?? '')
    : namespace;
};

export const getOrganizationNamespace = (
  namespace: string
): [string, string] => {
  const orgPart = getOrganizationPart(namespace);

  if (!orgPart) {
    return ['', ''];
  }

  const [mainOrg, subOrg] = orgPart.split('.').slice(0, -2).reverse();
  return [mainOrg ?? '', subOrg ?? ''];
};

export const getApplicationNamespace = (namespace: string): string => {
  if (!namespace.includes('.apps.')) {
    return '';
  }

  return namespace.split('.apps.')[0].split('.').at(-1) ?? '';
};
