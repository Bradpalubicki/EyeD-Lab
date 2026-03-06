import { describe, expect, it } from "vitest";
import { validateResource } from "../validate.js";

describe("validateResource", () => {
  it("accepts a valid Patient", () => {
    const result = validateResource({
      resourceType: "Patient",
      name: [{ family: "Smith", given: ["John"] }],
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects missing resourceType", () => {
    const result = validateResource({ name: [{ family: "Smith" }] });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("resourceType is required");
  });

  it("rejects invalid resourceType", () => {
    const result = validateResource({ resourceType: "FakeResource" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/unknown resourceType/);
  });

  it("rejects a non-object value", () => {
    const result = validateResource("not an object");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("resource must be an object");
  });

  it("rejects null", () => {
    const result = validateResource(null);
    expect(result.valid).toBe(false);
  });

  it("accepts AllergyIntolerance with required fields", () => {
    const result = validateResource({
      resourceType: "AllergyIntolerance",
      patient: { reference: "Patient/1" },
      code: { text: "Peanuts" },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects AllergyIntolerance without patient", () => {
    const result = validateResource({
      resourceType: "AllergyIntolerance",
      code: { text: "Peanuts" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("patient must be a valid Reference");
  });

  it("rejects Condition without subject", () => {
    const result = validateResource({
      resourceType: "Condition",
      code: { text: "Hypertension" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("subject must be a valid Reference");
  });

  it("rejects MedicationStatement without status", () => {
    const result = validateResource({
      resourceType: "MedicationStatement",
      subject: { reference: "Patient/1" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("status is required");
  });

  it("accepts a valid Observation", () => {
    const result = validateResource({
      resourceType: "Observation",
      status: "final",
      code: { text: "Blood Pressure" },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects Observation without code", () => {
    const result = validateResource({
      resourceType: "Observation",
      status: "final",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("code must be a valid CodeableConcept");
  });

  it("rejects Procedure without status", () => {
    const result = validateResource({
      resourceType: "Procedure",
      subject: { reference: "Patient/1" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("status is required");
  });

  it("accepts a valid Immunization", () => {
    const result = validateResource({
      resourceType: "Immunization",
      status: "completed",
      vaccineCode: { text: "COVID-19 Vaccine" },
      patient: { reference: "Patient/1" },
    });
    expect(result.valid).toBe(true);
  });

  it("rejects Immunization without vaccineCode", () => {
    const result = validateResource({
      resourceType: "Immunization",
      status: "completed",
      patient: { reference: "Patient/1" },
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("vaccineCode must be a valid CodeableConcept");
  });

  it("rejects DocumentReference without content", () => {
    const result = validateResource({
      resourceType: "DocumentReference",
      status: "current",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("content must be a non-empty array");
  });

  it("accepts a valid DiagnosticReport", () => {
    const result = validateResource({
      resourceType: "DiagnosticReport",
      status: "final",
      code: { text: "CBC" },
    });
    expect(result.valid).toBe(true);
  });

  it("collects multiple errors", () => {
    const result = validateResource({
      resourceType: "MedicationStatement",
      // missing both status and subject
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
