import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { deriveKEK, generateDEK, wrapDEK, unwrapDEK } from "../keys.js";

describe("Key management", () => {
  describe("deriveKEK", () => {
    it("is deterministic for same password and salt", async () => {
      const salt = randomBytes(16);
      const kek1 = await deriveKEK("patient-password", salt);
      const kek2 = await deriveKEK("patient-password", salt);

      expect(kek1).toEqual(kek2);
    });

    it("produces different KEKs for different passwords", async () => {
      const salt = randomBytes(16);
      const kek1 = await deriveKEK("password-one", salt);
      const kek2 = await deriveKEK("password-two", salt);

      expect(kek1).not.toEqual(kek2);
    });
  });

  describe("generateDEK", () => {
    it("produces 32-byte keys", () => {
      const dek = generateDEK();
      expect(dek.length).toBe(32);
    });

    it("produces unique keys", () => {
      const dek1 = generateDEK();
      const dek2 = generateDEK();
      expect(dek1).not.toEqual(dek2);
    });
  });

  describe("wrapDEK / unwrapDEK", () => {
    it("wraps and unwraps DEK roundtrip", async () => {
      const salt = randomBytes(16);
      const kek = await deriveKEK("wrap-test", salt);
      const dek = generateDEK();

      const { wrapped, iv, authTag } = wrapDEK(dek, kek);
      const unwrapped = unwrapDEK(wrapped, iv, authTag, kek);

      expect(unwrapped).toEqual(dek);
    });

    it("fails to unwrap with wrong KEK", async () => {
      const salt1 = randomBytes(16);
      const salt2 = randomBytes(16);
      const kek1 = await deriveKEK("correct-password", salt1);
      const kek2 = await deriveKEK("wrong-password", salt2);
      const dek = generateDEK();

      const { wrapped, iv, authTag } = wrapDEK(dek, kek1);
      expect(() => unwrapDEK(wrapped, iv, authTag, kek2)).toThrow();
    });
  });
});
