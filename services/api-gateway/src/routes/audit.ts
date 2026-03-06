import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface AuditParams {
  userId: string;
}

interface AuditQuerystring {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  actorType: "patient" | "provider" | "system";
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
}

interface AuditLogResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
}

// --- Schemas ---

const getAuditLogSchema = {
  params: {
    type: "object" as const,
    required: ["userId"],
    properties: {
      userId: { type: "string" as const },
    },
  },
  querystring: {
    type: "object" as const,
    properties: {
      page: { type: "number" as const, default: 1 },
      limit: { type: "number" as const, default: 20 },
      startDate: { type: "string" as const, format: "date-time" },
      endDate: { type: "string" as const, format: "date-time" },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        entries: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: {
              id: { type: "string" as const },
              timestamp: { type: "string" as const, format: "date-time" },
              action: { type: "string" as const },
              actorId: { type: "string" as const },
              actorType: {
                type: "string" as const,
                enum: ["patient", "provider", "system"],
              },
              resourceType: { type: "string" as const },
              resourceId: { type: "string" as const },
              details: { type: "string" as const },
              ipAddress: { type: "string" as const },
            },
          },
        },
        total: { type: "number" as const },
        page: { type: "number" as const },
        limit: { type: "number" as const },
      },
    },
  },
};

// --- Plugin ---

const auditRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get<{
    Params: AuditParams;
    Querystring: AuditQuerystring;
    Reply: AuditLogResponse;
  }>("/v1/audit/:userId", { schema: getAuditLogSchema }, async (request) => {
    const { page = 1, limit = 20 } = request.query;

    const entries: AuditEntry[] = [
      {
        id: "aud_mock_001",
        timestamp: new Date(Date.now() - 3_600_000).toISOString(),
        action: "record.viewed",
        actorId: "prov_mock_dr_smith",
        actorType: "provider",
        resourceType: "MedicationStatement",
        resourceId: "med_mock_001",
        details: "Provider viewed medication records via session ses_mock_abc123",
        ipAddress: "192.168.1.100",
      },
      {
        id: "aud_mock_002",
        timestamp: new Date(Date.now() - 7_200_000).toISOString(),
        action: "session.created",
        actorId: request.params.userId,
        actorType: "patient",
        resourceType: "Session",
        resourceId: "ses_mock_abc123",
        details: "Patient created sharing session with Dr. Smith",
        ipAddress: "10.0.0.50",
      },
      {
        id: "aud_mock_003",
        timestamp: new Date(Date.now() - 86_400_000).toISOString(),
        action: "emergency.accessed",
        actorId: "prov_mock_er_jones",
        actorType: "provider",
        resourceType: "EmergencyProfile",
        resourceId: "band_mock_nfc001",
        details: "Emergency access to patient profile via NFC band",
        ipAddress: "172.16.0.25",
      },
    ];

    return {
      entries,
      total: entries.length,
      page,
      limit,
    };
  });
};

export default auditRoutes;
