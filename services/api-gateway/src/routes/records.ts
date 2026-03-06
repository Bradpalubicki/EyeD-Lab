import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface GetRecordsParams {
  sessionId: string;
}

interface FhirBundle {
  resourceType: "Bundle";
  type: "searchset";
  total: number;
  entry: FhirBundleEntry[];
}

interface FhirBundleEntry {
  resource: {
    resourceType: string;
    id: string;
    [key: string]: unknown;
  };
}

interface AddRecordBody {
  patientId: string;
  resourceType: string;
  data: Record<string, unknown>;
}

interface AddRecordResponse {
  id: string;
  resourceType: string;
  createdAt: string;
}

// --- Schemas ---

const getRecordsSchema = {
  params: {
    type: "object" as const,
    required: ["sessionId"],
    properties: {
      sessionId: { type: "string" as const },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        resourceType: { type: "string" as const, enum: ["Bundle"] },
        type: { type: "string" as const, enum: ["searchset"] },
        total: { type: "number" as const },
        entry: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: {
              resource: {
                type: "object" as const,
                properties: {
                  resourceType: { type: "string" as const },
                  id: { type: "string" as const },
                },
              },
            },
          },
        },
      },
    },
  },
};

const addRecordSchema = {
  body: {
    type: "object" as const,
    required: ["patientId", "resourceType", "data"],
    properties: {
      patientId: { type: "string" as const },
      resourceType: { type: "string" as const },
      data: { type: "object" as const },
    },
  },
  response: {
    201: {
      type: "object" as const,
      properties: {
        id: { type: "string" as const },
        resourceType: { type: "string" as const },
        createdAt: { type: "string" as const, format: "date-time" },
      },
    },
  },
};

// --- Plugin ---

const recordsRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
) => {
  fastify.get<{ Params: GetRecordsParams; Reply: FhirBundle }>(
    "/v1/records/:sessionId",
    { schema: getRecordsSchema },
    async (_request, _reply) => {
      const bundle: FhirBundle = {
        resourceType: "Bundle",
        type: "searchset",
        total: 2,
        entry: [
          {
            resource: {
              resourceType: "MedicationStatement",
              id: "med_mock_001",
              status: "active",
              medicationCodeableConcept: {
                text: "Lisinopril 10mg",
              },
            },
          },
          {
            resource: {
              resourceType: "AllergyIntolerance",
              id: "allergy_mock_001",
              clinicalStatus: { text: "active" },
              code: { text: "Penicillin" },
            },
          },
        ],
      };

      return bundle;
    },
  );

  fastify.post<{ Body: AddRecordBody; Reply: AddRecordResponse }>(
    "/v1/records",
    { schema: addRecordSchema },
    async (_request, reply) => {
      const response: AddRecordResponse = {
        id: "rec_mock_" + Date.now(),
        resourceType: _request.body.resourceType,
        createdAt: new Date().toISOString(),
      };

      return reply.status(201).send(response);
    },
  );
};

export default recordsRoutes;
