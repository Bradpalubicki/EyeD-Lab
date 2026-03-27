import eyedConfig from '@eyed/eslint-config';

export default [
  ...eyedConfig,
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.expo/**',
      '**/coverage/**',
      'packages/contracts/**',
      'packages/zk-circuits/**',
    ],
  },
];
