const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-nx-scopes', '@commitlint/config-conventional'],
  plugins: ['scope-empty-exceptions'],
  rules: {
    'scope-empty': [2, 'never', ['ci', 'input', 'chore', 'fix']],
    'scope-enum': async (ctx) => [
      2,
      'always',
      [
        ...(await getProjects(ctx, ({ name, projectType }) => {
          return projectType == 'application' || projectType === 'library';
        })),
        'devops',
      ],
    ],
    "header-max-length": [1, "always", 120],
  },
};
