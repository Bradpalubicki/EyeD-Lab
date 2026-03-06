import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import authRoutes from "./routes/auth.js";
import sessionsRoutes from "./routes/sessions.js";
import recordsRoutes from "./routes/records.js";
import emergencyRoutes from "./routes/emergency.js";
import auditRoutes from "./routes/audit.js";
import nfcRoutes from "./routes/nfc.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  // --- Plugins ---

  await app.register(cors, {
    origin: true,
  });

  await app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "EyeD API",
        description:
          "Patient-owned medical records platform API. Provides session-based record sharing, emergency access, NFC band compilation, and audit logging.",
        version: "0.1.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Local development",
        },
      ],
      tags: [
        { name: "auth", description: "Authentication and registration" },
        { name: "sessions", description: "Record sharing sessions" },
        { name: "records", description: "Medical records (FHIR)" },
        { name: "emergency", description: "Emergency access" },
        { name: "audit", description: "Access audit log" },
        { name: "nfc", description: "NFC band operations" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  // --- Routes ---

  await app.register(authRoutes);
  await app.register(sessionsRoutes);
  await app.register(recordsRoutes);
  await app.register(emergencyRoutes);
  await app.register(auditRoutes);
  await app.register(nfcRoutes);

  // Health / root
  app.get("/", async () => {
    return {
      service: "eyed-api-gateway",
      version: "0.1.0",
      status: "ok",
    };
  });

  return app;
}

// --- Start server when run directly ---

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("server.ts") ||
    process.argv[1].endsWith("server.js"));

if (isDirectRun) {
  const port = Number(process.env.PORT) || 3001;

  buildApp()
    .then((app) =>
      app.listen({ port, host: "0.0.0.0" }).then(() => {
        app.log.info(`EyeD API Gateway listening on port ${port}`);
        app.log.info(
          `Swagger docs available at http://localhost:${port}/documentation`,
        );
      }),
    )
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
}
