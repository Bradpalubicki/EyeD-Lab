import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface CreateSessionBody {
  patientId: string;
  providerId: string;
  recordTypes: string[];
  expiresInMinutes?: number;
}

interface CreateSessionResponse {
  sessionId: string;
  qrData: string;
  pin: string;
  expiresAt: string;
}

interface ValidateSessionBody {
  qrData: string;
  pin: string;
}

interface ValidateSessionResponse {
  valid: boolean;
  sessionId: string | null;
  patientId: string | null;
  authorizedRecordTypes: string[];
}

interface RevokeSessionParams {
  sessionId: string;
}

// --- Schemas ---

const createSessionSchema = {
  body: {
    type: "object" as const,
    required: ["patientId", "providerId", "recordTypes"],
    properties: {
      patientId: { type: "string" as const },
      providerId: { type: "string" as const },
      recordTypes: {
        type: "array" as const,
        items: { type: "string" as const },
      },
      expiresInMinutes: { type: "number" as const },
    },
  },
  response: {
    201: {
      type: "object" as const,
      properties: {
        sessionId: { type: "string" as const },
        qrData: { type: "string" as const },
        pin: { type: "string" as const },
        expiresAt: { type: "string" as const, format: "date-time" },
      },
    },
  },
};

const validateSessionSchema = {
  body: {
    type: "object" as const,
    required: ["qrData", "pin"],
    properties: {
      qrData: { type: "string" as const },
      pin: { type: "string" as const },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        valid: { type: "boolean" as const },
        sessionId: { type: ["string", "null"] as const },
        patientId: { type: ["string", "null"] as const },
        authorizedRecordTypes: {
          type: "array" as const,
          items: { type: "string" as const },
        },
      },
    },
  },
};

const revokeSessionSchema = {
  params: {
    type: "object" as const,
    required: ["sessionId"],
    properties: {
      sessionId: { type: "string" as const },
    },
  },
  response: {
    204: {
      type: "null" as const,
      description: "Session revoked successfully",
    },
  },
};

// --- Plugin ---

const sessionsRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  fastify.post<{ Body: CreateSessionBody; Reply: CreateSessionResponse }>(
    "/v1/sessions",
    { schema: createSessionSchema },
    async (_request, reply) => {
      const expiresAt = new Date(
        Date.now() + (_request.body.expiresInMinutes ?? 30) * 60_000,
      ).toISOString();

      const response: CreateSessionResponse = {
        sessionId: "ses_mock_abc123",
        qrData: "eyJzZXNzaW9uSWQiOiJzZXNfbW9ja19hYmMxMjMifQ==",
        pin: "847291",
        expiresAt,
      };

      return reply.status(201).send(response);
    },
  );

  fastify.post<{ Body: ValidateSessionBody; Reply: ValidateSessionResponse }>(
    "/v1/sessions/validate",
    { schema: validateSessionSchema },
    async (_request, _reply) => {
      return {
        valid: true,
        sessionId: "ses_mock_abc123",
        patientId: "pat_mock_xyz789",
        authorizedRecordTypes: ["medications", "allergies", "conditions"],
      };
    },
  );

  fastify.delete<{ Params: RevokeSessionParams }>(
    "/v1/sessions/:sessionId",
    { schema: revokeSessionSchema },
    async (_request, reply) => {
      return reply.status(204).send();
    },
  );
};

export default sessionsRoutes;
