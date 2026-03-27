import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/crypto',
  'packages/fhir',
  'packages/nfc',
  'packages/sdk',
  'services/api-gateway',
  'services/decryption-gateway',
  'services/fhir-service',
  'services/notification-service',
]);
