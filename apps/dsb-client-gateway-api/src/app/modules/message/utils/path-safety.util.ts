import { isAbsolute, relative, resolve } from 'path';

export const isPathWithinBase = (
  candidatePath: string,
  baseDir: string,
): boolean => {
  const resolvedBase = resolve(baseDir);
  const resolvedCandidate = resolve(candidatePath);
  const pathRelativeToBase = relative(resolvedBase, resolvedCandidate);

  return (
    pathRelativeToBase === '' ||
    (!pathRelativeToBase.startsWith('..') && !isAbsolute(pathRelativeToBase))
  );
};

export const resolvePathWithinBase = (
  baseDir: string,
  ...pathSegments: string[]
): string | null => {
  const resolvedPath = resolve(baseDir, ...pathSegments);

  if (!isPathWithinBase(resolvedPath, baseDir)) {
    return null;
  }

  return resolvedPath;
};
