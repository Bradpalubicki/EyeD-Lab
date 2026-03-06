import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../server.js";

describe("API Gateway", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("responds to GET / with 200 and service info", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body).toEqual({
      service: "eyed-api-gateway",
      version: "0.1.0",
      status: "ok",
    });
  });

  it("serves Swagger docs at /documentation", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/documentation/json",
    });

    expect(response.statusCode).toBe(200);

    const spec = response.json();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.info.title).toBe("EyeD API");
    expect(spec.info.version).toBe("0.1.0");
  });

  it("POST /v1/sessions returns 201 with session data", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/sessions",
      payload: {
        patientId: "pat_test_001",
        providerId: "prov_test_001",
        recordTypes: ["medications", "allergies"],
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();
    expect(body.sessionId).toBeDefined();
    expect(body.qrData).toBeDefined();
    expect(body.pin).toBeDefined();
    expect(body.expiresAt).toBeDefined();
  });

  it("POST /v1/auth/login returns mock JWT", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: {
        email: "test@example.com",
        password: "securepassword",
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.token).toBeDefined();
    expect(body.user.role).toBe("patient");
  });

  it("GET /v1/records/:sessionId returns FHIR bundle", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/records/ses_test_001",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.resourceType).toBe("Bundle");
    expect(body.type).toBe("searchset");
    expect(body.entry).toBeInstanceOf(Array);
    expect(body.entry.length).toBeGreaterThan(0);
  });

  it("DELETE /v1/sessions/:sessionId returns 204", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/v1/sessions/ses_test_001",
    });

    expect(response.statusCode).toBe(204);
  });

  it("GET /v1/audit/:userId returns audit entries", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/v1/audit/pat_test_001",
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.entries).toBeInstanceOf(Array);
    expect(body.total).toBeGreaterThan(0);
  });
});
