const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-nx-scopes', '@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': async (ctx) => [
      2,
      'always',
      [
        ...(await getProjects(ctx, ({ name, projectType }) => {
          return projectType == 'application' || projectType === 'library';
        })),
        'devops'
      ],
    ],
  },
};
