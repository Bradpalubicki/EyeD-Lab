import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { encryptRecord, decryptRecord } from "../record.js";
import { deriveKEK } from "../keys.js";

describe("Record-level encryption", () => {
  it("encrypts and decrypts a record roundtrip", async () => {
    const salt = randomBytes(16);
    const kek = await deriveKEK("record-test", salt);
    const data = "Patient: John Doe, Blood Type: O+";

    const encrypted = encryptRecord(data, kek);
    const decrypted = decryptRecord(
      encrypted.encryptedData,
      encrypted.encryptedDEK,
      encrypted.iv,
      encrypted.authTag,
      kek,
    );

    expect(decrypted).toBe(data);
  });

  it("encrypts and decrypts a JSON record roundtrip", async () => {
    const salt = randomBytes(16);
    const kek = await deriveKEK("json-test", salt);
    const record = {
      patientId: "P-12345",
      diagnosis: "Hypertension",
      medications: ["Lisinopril", "Amlodipine"],
      vitals: { bp: "130/85", hr: 72 },
    };
    const data = JSON.stringify(record);

    const encrypted = encryptRecord(data, kek);
    const decrypted = decryptRecord(
      encrypted.encryptedData,
      encrypted.encryptedDEK,
      encrypted.iv,
      encrypted.authTag,
      kek,
    );

    expect(JSON.parse(decrypted)).toEqual(record);
  });

  it("produces different ciphertexts for different records", async () => {
    const salt = randomBytes(16);
    const kek = await deriveKEK("diff-test", salt);

    const encrypted1 = encryptRecord("Record A", kek);
    const encrypted2 = encryptRecord("Record B", kek);

    expect(encrypted1.encryptedData).not.toEqual(encrypted2.encryptedData);
    expect(encrypted1.iv).not.toEqual(encrypted2.iv);
  });

  it("produces different ciphertexts for the same record", async () => {
    const salt = randomBytes(16);
    const kek = await deriveKEK("same-data-test", salt);

    const encrypted1 = encryptRecord("Same data", kek);
    const encrypted2 = encryptRecord("Same data", kek);

    // Each encryption uses a new DEK and IV, so ciphertexts differ
    expect(encrypted1.encryptedData).not.toEqual(encrypted2.encryptedData);
  });
});
