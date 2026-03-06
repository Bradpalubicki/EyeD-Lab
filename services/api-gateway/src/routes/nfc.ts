import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface NfcCompileBody {
  patientId: string;
  includeAllergies: boolean;
  includeConditions: boolean;
  includeMedications: boolean;
  includeEmergencyContacts: boolean;
  includeBloodType: boolean;
}

interface NfcCompileResponse {
  bandId: string;
  payload: string;
  payloadSizeBytes: number;
  maxCapacityBytes: number;
  compiledAt: string;
  fieldsIncluded: string[];
}

// --- Schemas ---

const nfcCompileSchema = {
  body: {
    type: "object" as const,
    required: ["patientId"],
    properties: {
      patientId: { type: "string" as const },
      includeAllergies: { type: "boolean" as const, default: true },
      includeConditions: { type: "boolean" as const, default: true },
      includeMedications: { type: "boolean" as const, default: true },
      includeEmergencyContacts: { type: "boolean" as const, default: true },
      includeBloodType: { type: "boolean" as const, default: true },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        bandId: { type: "string" as const },
        payload: { type: "string" as const },
        payloadSizeBytes: { type: "number" as const },
        maxCapacityBytes: { type: "number" as const },
        compiledAt: { type: "string" as const, format: "date-time" },
        fieldsIncluded: {
          type: "array" as const,
          items: { type: "string" as const },
        },
      },
    },
  },
};

// --- Plugin ---

const nfcRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: NfcCompileBody; Reply: NfcCompileResponse }>(
    "/v1/nfc/compile",
    { schema: nfcCompileSchema },
    async (request, _reply) => {
      const fields: string[] = [];
      if (request.body.includeAllergies !== false) fields.push("allergies");
      if (request.body.includeConditions !== false) fields.push("conditions");
      if (request.body.includeMedications !== false)
        fields.push("medications");
      if (request.body.includeEmergencyContacts !== false)
        fields.push("emergencyContacts");
      if (request.body.includeBloodType !== false) fields.push("bloodType");

      const mockPayload = Buffer.from(
        JSON.stringify({
          v: 1,
          pid: request.body.patientId,
          bt: "O+",
          alg: ["Penicillin"],
          cnd: ["Diabetes"],
          med: ["Metformin"],
          ec: [{ n: "John Doe", p: "+1-555-0100" }],
        }),
      ).toString("base64");

      return {
        bandId: "band_mock_" + Date.now(),
        payload: mockPayload,
        payloadSizeBytes: Buffer.byteLength(mockPayload, "base64"),
        maxCapacityBytes: 868,
        compiledAt: new Date().toISOString(),
        fieldsIncluded: fields,
      };
    },
  );
};

export default nfcRoutes;
