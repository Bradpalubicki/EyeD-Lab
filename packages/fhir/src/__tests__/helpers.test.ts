import { describe, expect, it } from "vitest";
import { createPatient, createAllergyIntolerance, createCondition, createMedicationStatement } from "../helpers.js";
import { validateResource } from "../validate.js";

describe("createPatient", () => {
  it("sets resourceType to Patient", () => {
    const patient = createPatient({ given: ["John"], family: "Smith" });
    expect(patient.resourceType).toBe("Patient");
  });

  it("sets name correctly", () => {
    const patient = createPatient({ given: ["Jane", "Marie"], family: "Doe" });
    expect(patient.name?.[0]?.family).toBe("Doe");
    expect(patient.name?.[0]?.given).toEqual(["Jane", "Marie"]);
  });

  it("defaults active to true", () => {
    const patient = createPatient({ given: ["John"], family: "Smith" });
    expect(patient.active).toBe(true);
  });

  it("includes optional demographics", () => {
    const patient = createPatient({
      given: ["John"],
      family: "Smith",
      birthDate: "1990-01-15",
      gender: "male",
      phone: "555-0100",
      email: "john@example.com",
    });
    expect(patient.birthDate).toBe("1990-01-15");
    expect(patient.gender).toBe("male");
    expect(patient.telecom).toHaveLength(2);
    expect(patient.telecom?.[0]?.system).toBe("phone");
    expect(patient.telecom?.[1]?.system).toBe("email");
  });

  it("passes validation", () => {
    const patient = createPatient({ given: ["John"], family: "Smith" });
    const result = validateResource(patient);
    expect(result.valid).toBe(true);
  });
});

describe("createAllergyIntolerance", () => {
  it("sets resourceType to AllergyIntolerance", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Penicillin",
    });
    expect(allergy.resourceType).toBe("AllergyIntolerance");
  });

  it("sets patient reference", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Peanuts",
    });
    expect(allergy.patient.reference).toBe("Patient/1");
  });

  it("sets substance as code", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Latex",
      substanceCode: "111088007",
      substanceSystem: "http://snomed.info/sct",
    });
    expect(allergy.code?.text).toBe("Latex");
    expect(allergy.code?.coding?.[0]?.code).toBe("111088007");
  });

  it("includes reaction when provided", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Penicillin",
      reaction: { manifestation: "Hives", severity: "moderate" },
    });
    expect(allergy.reaction).toHaveLength(1);
    expect(allergy.reaction?.[0]?.manifestation[0]?.text).toBe("Hives");
    expect(allergy.reaction?.[0]?.severity).toBe("moderate");
  });

  it("defaults clinicalStatus to active", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Dust",
    });
    expect(allergy.clinicalStatus?.coding?.[0]?.code).toBe("active");
  });

  it("passes validation", () => {
    const allergy = createAllergyIntolerance({
      patientRef: "Patient/1",
      substance: "Penicillin",
    });
    const result = validateResource(allergy);
    expect(result.valid).toBe(true);
  });
});

describe("createCondition", () => {
  it("sets resourceType to Condition", () => {
    const condition = createCondition({
      subjectRef: "Patient/1",
      condition: "Hypertension",
    });
    expect(condition.resourceType).toBe("Condition");
  });

  it("sets subject reference", () => {
    const condition = createCondition({
      subjectRef: "Patient/42",
      condition: "Diabetes Type 2",
    });
    expect(condition.subject.reference).toBe("Patient/42");
  });

  it("defaults clinicalStatus to active", () => {
    const condition = createCondition({
      subjectRef: "Patient/1",
      condition: "Asthma",
    });
    expect(condition.clinicalStatus?.coding?.[0]?.code).toBe("active");
  });

  it("accepts custom clinicalStatus", () => {
    const condition = createCondition({
      subjectRef: "Patient/1",
      condition: "Fracture",
      clinicalStatus: "resolved",
    });
    expect(condition.clinicalStatus?.coding?.[0]?.code).toBe("resolved");
  });

  it("passes validation", () => {
    const condition = createCondition({
      subjectRef: "Patient/1",
      condition: "Hypertension",
    });
    const result = validateResource(condition);
    expect(result.valid).toBe(true);
  });
});

describe("createMedicationStatement", () => {
  it("sets resourceType to MedicationStatement", () => {
    const med = createMedicationStatement({
      subjectRef: "Patient/1",
      medication: "Lisinopril 10mg",
    });
    expect(med.resourceType).toBe("MedicationStatement");
  });

  it("defaults status to active", () => {
    const med = createMedicationStatement({
      subjectRef: "Patient/1",
      medication: "Metformin",
    });
    expect(med.status).toBe("active");
  });

  it("includes dosage when provided", () => {
    const med = createMedicationStatement({
      subjectRef: "Patient/1",
      medication: "Aspirin",
      dosageText: "81mg daily",
    });
    expect(med.dosage?.[0]?.text).toBe("81mg daily");
  });

  it("sets prescriber as informationSource", () => {
    const med = createMedicationStatement({
      subjectRef: "Patient/1",
      medication: "Atorvastatin",
      prescriberRef: "Practitioner/5",
    });
    expect(med.informationSource?.reference).toBe("Practitioner/5");
  });

  it("passes validation", () => {
    const med = createMedicationStatement({
      subjectRef: "Patient/1",
      medication: "Lisinopril 10mg",
    });
    const result = validateResource(med);
    expect(result.valid).toBe(true);
  });
});
