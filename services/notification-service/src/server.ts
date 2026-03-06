/**
 * EyeD Notification Service
 *
 * Channels:
 * - Push: Expo Push / FCM / APNs — record access alerts, session expiry
 * - SMS: Twilio — emergency contact notifications, OTP fallback
 * - Email: SendGrid — access reports, account alerts
 * - Webhook: Custom — provider integrations
 */

import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { status: 'ok', service: 'notification-service' };
});

// Phase 1: Notification endpoints
app.post('/v1/notify/push', async (_request, reply) => {
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

app.post('/v1/notify/sms', async (_request, reply) => {
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

app.post('/v1/notify/email', async (_request, reply) => {
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

app.post('/v1/notify/emergency-cascade', async (_request, reply) => {
  // Emergency contact notification cascade
  reply.status(501).send({ error: 'Not implemented — Phase 1' });
});

const PORT = parseInt(process.env.PORT || '3004', 10);

app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Notification service listening on port ${PORT}`);
});

export default app;
