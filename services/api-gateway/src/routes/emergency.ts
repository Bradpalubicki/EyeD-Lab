import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface EmergencyRequestBody {
  providerId: string;
  patientIdentifier: string;
  reason: string;
  location?: string;
}

interface EmergencyRequestResponse {
  requestId: string;
  status: "pending" | "approved" | "denied";
  expiresAt: string;
  accessLevel: string;
}

interface EmergencyBandParams {
  bandId: string;
}

interface EmergencyProfile {
  bandId: string;
  patientName: string;
  bloodType: string;
  allergies: string[];
  conditions: string[];
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  medications: string[];
  dnr: boolean;
  lastUpdated: string;
}

// --- Schemas ---

const emergencyRequestSchema = {
  body: {
    type: "object" as const,
    required: ["providerId", "patientIdentifier", "reason"],
    properties: {
      providerId: { type: "string" as const },
      patientIdentifier: { type: "string" as const },
      reason: { type: "string" as const },
      location: { type: "string" as const },
    },
  },
  response: {
    201: {
      type: "object" as const,
      properties: {
        requestId: { type: "string" as const },
        status: {
          type: "string" as const,
          enum: ["pending", "approved", "denied"],
        },
        expiresAt: { type: "string" as const, format: "date-time" },
        accessLevel: { type: "string" as const },
      },
    },
  },
};

const emergencyBandSchema = {
  params: {
    type: "object" as const,
    required: ["bandId"],
    properties: {
      bandId: { type: "string" as const },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        bandId: { type: "string" as const },
        patientName: { type: "string" as const },
        bloodType: { type: "string" as const },
        allergies: {
          type: "array" as const,
          items: { type: "string" as const },
        },
        conditions: {
          type: "array" as const,
          items: { type: "string" as const },
        },
        emergencyContacts: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: {
              name: { type: "string" as const },
              phone: { type: "string" as const },
              relationship: { type: "string" as const },
            },
          },
        },
        medications: {
          type: "array" as const,
          items: { type: "string" as const },
        },
        dnr: { type: "boolean" as const },
        lastUpdated: { type: "string" as const, format: "date-time" },
      },
    },
  },
};

// --- Plugin ---

const emergencyRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  fastify.post<{
    Body: EmergencyRequestBody;
    Reply: EmergencyRequestResponse;
  }>(
    "/v1/emergency/request",
    { schema: emergencyRequestSchema },
    async (_request, reply) => {
      const response: EmergencyRequestResponse = {
        requestId: "emr_mock_" + Date.now(),
        status: "approved",
        expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
        accessLevel: "emergency-read",
      };

      return reply.status(201).send(response);
    },
  );

  fastify.get<{ Params: EmergencyBandParams; Reply: EmergencyProfile }>(
    "/v1/emergency/:bandId",
    { schema: emergencyBandSchema },
    async (_request, _reply) => {
      const profile: EmergencyProfile = {
        bandId: _request.params.bandId,
        patientName: "Jane Doe",
        bloodType: "O+",
        allergies: ["Penicillin", "Sulfa drugs"],
        conditions: ["Type 2 Diabetes", "Hypertension"],
        emergencyContacts: [
          {
            name: "John Doe",
            phone: "+1-555-0100",
            relationship: "Spouse",
          },
        ],
        medications: ["Metformin 500mg", "Lisinopril 10mg"],
        dnr: false,
        lastUpdated: new Date().toISOString(),
      };

      return profile;
    },
  );
};

export default emergencyRoutes;
