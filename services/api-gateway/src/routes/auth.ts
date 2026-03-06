import type { FastifyInstance, FastifyPluginAsync } from "fastify";

// --- Types ---

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    role: "patient" | "provider";
  };
}

interface ProviderRegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  npiNumber: string;
  specialty: string;
  organization: string;
}

interface ProviderRegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  npiNumber: string;
  verified: boolean;
  createdAt: string;
}

// --- Schemas ---

const registerSchema = {
  body: {
    type: "object" as const,
    required: ["email", "password", "firstName", "lastName", "dateOfBirth"],
    properties: {
      email: { type: "string" as const, format: "email" },
      password: { type: "string" as const, minLength: 8 },
      firstName: { type: "string" as const },
      lastName: { type: "string" as const },
      dateOfBirth: { type: "string" as const, format: "date" },
    },
  },
  response: {
    201: {
      type: "object" as const,
      properties: {
        id: { type: "string" as const },
        email: { type: "string" as const },
        firstName: { type: "string" as const },
        lastName: { type: "string" as const },
        createdAt: { type: "string" as const, format: "date-time" },
      },
    },
  },
};

const loginSchema = {
  body: {
    type: "object" as const,
    required: ["email", "password"],
    properties: {
      email: { type: "string" as const, format: "email" },
      password: { type: "string" as const },
    },
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        token: { type: "string" as const },
        expiresAt: { type: "string" as const, format: "date-time" },
        user: {
          type: "object" as const,
          properties: {
            id: { type: "string" as const },
            email: { type: "string" as const },
            role: { type: "string" as const, enum: ["patient", "provider"] },
          },
        },
      },
    },
  },
};

const providerRegisterSchema = {
  body: {
    type: "object" as const,
    required: [
      "email",
      "password",
      "firstName",
      "lastName",
      "npiNumber",
      "specialty",
      "organization",
    ],
    properties: {
      email: { type: "string" as const, format: "email" },
      password: { type: "string" as const, minLength: 8 },
      firstName: { type: "string" as const },
      lastName: { type: "string" as const },
      npiNumber: { type: "string" as const },
      specialty: { type: "string" as const },
      organization: { type: "string" as const },
    },
  },
  response: {
    201: {
      type: "object" as const,
      properties: {
        id: { type: "string" as const },
        email: { type: "string" as const },
        firstName: { type: "string" as const },
        lastName: { type: "string" as const },
        npiNumber: { type: "string" as const },
        verified: { type: "boolean" as const },
        createdAt: { type: "string" as const, format: "date-time" },
      },
    },
  },
};

// --- Plugin ---

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Patient registration
  fastify.post<{ Body: RegisterBody; Reply: RegisterResponse }>(
    "/v1/auth/register",
    { schema: registerSchema },
    async (request, reply) => {
      const response: RegisterResponse = {
        id: "pat_mock_" + Date.now(),
        email: request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        createdAt: new Date().toISOString(),
      };

      return reply.status(201).send(response);
    },
  );

  // Patient login
  fastify.post<{ Body: LoginBody; Reply: LoginResponse }>(
    "/v1/auth/login",
    { schema: loginSchema },
    async (request, _reply) => {
      return {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXRfbW9ja18wMDEiLCJyb2xlIjoicGF0aWVudCJ9.stub",
        expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
        user: {
          id: "pat_mock_001",
          email: request.body.email,
          role: "patient" as const,
        },
      };
    },
  );

  // Provider registration
  fastify.post<{
    Body: ProviderRegisterBody;
    Reply: ProviderRegisterResponse;
  }>(
    "/v1/auth/provider/register",
    { schema: providerRegisterSchema },
    async (request, reply) => {
      const response: ProviderRegisterResponse = {
        id: "prov_mock_" + Date.now(),
        email: request.body.email,
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        npiNumber: request.body.npiNumber,
        verified: false,
        createdAt: new Date().toISOString(),
      };

      return reply.status(201).send(response);
    },
  );

  // Provider login
  fastify.post<{ Body: LoginBody; Reply: LoginResponse }>(
    "/v1/auth/provider/login",
    { schema: loginSchema },
    async (request, _reply) => {
      return {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwcm92X21vY2tfMDAxIiwicm9sZSI6InByb3ZpZGVyIn0.stub",
        expiresAt: new Date(Date.now() + 8 * 60 * 60_000).toISOString(),
        user: {
          id: "prov_mock_001",
          email: request.body.email,
          role: "provider" as const,
        },
      };
    },
  );
};

export default authRoutes;
