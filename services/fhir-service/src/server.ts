/**
 * EyeD FHIR Translation Service
 *
 * Converts between EyeD internal JSON format and FHIR R4 resources.
 * - Import from hospital EMR (FHIR endpoint → EyeD encrypted storage)
 * - Export to hospital EMR (EyeD → FHIR response)
 * - Supports SMART on FHIR app launch protocol (Phase 2)
 */

import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { status: 'ok', service: 'fhir-service' };
});

// Phase 1: FHIR translation endpoints
app.post('/v1/fhir/import', async (_request, reply) => {
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

app.post('/v1/fhir/export', async (_request, reply) => {
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

app.get('/v1/fhir/metadata', async () => {
  return {
    resourceType: 'CapabilityStatement',
    status: 'draft',
    fhirVersion: '4.0.1',
    format: ['json'],
    rest: [
      {
        mode: 'server',
        resource: [
          { type: 'Patient' },
          { type: 'AllergyIntolerance' },
          { type: 'Condition' },
          { type: 'MedicationStatement' },
          { type: 'Observation' },
          { type: 'Procedure' },
          { type: 'Immunization' },
          { type: 'DocumentReference' },
          { type: 'DiagnosticReport' },
        ],
      },
    ],
  };
});

const PORT = parseInt(process.env.PORT || '3003', 10);

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`FHIR service listening on port ${PORT}`);
});

export default app;
