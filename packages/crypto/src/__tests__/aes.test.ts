import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { encrypt, decrypt } from "../aes.js";

describe("AES-256-GCM", () => {
  const key = randomBytes(32);

  it("encrypts and decrypts roundtrip", () => {
    const plaintext = Buffer.from("sensitive medical data");
    const { ciphertext, iv, authTag } = encrypt(plaintext, key);

    const decrypted = decrypt(ciphertext, iv, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });

  it("produces different IVs for each encryption", () => {
    const plaintext = Buffer.from("same data");
    const result1 = encrypt(plaintext, key);
    const result2 = encrypt(plaintext, key);

    expect(result1.iv).not.toEqual(result2.iv);
    expect(result1.ciphertext).not.toEqual(result2.ciphertext);
  });

  it("fails to decrypt with wrong key", () => {
    const plaintext = Buffer.from("secret");
    const { ciphertext, iv, authTag } = encrypt(plaintext, key);

    const wrongKey = randomBytes(32);
    expect(() => decrypt(ciphertext, iv, authTag, wrongKey)).toThrow();
  });

  it("handles empty data", () => {
    const plaintext = Buffer.alloc(0);
    const { ciphertext, iv, authTag } = encrypt(plaintext, key);

    const decrypted = decrypt(ciphertext, iv, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });

  it("handles large data", () => {
    const plaintext = randomBytes(1 * 1024 * 1024); // 1 MB
    const { ciphertext, iv, authTag } = encrypt(plaintext, key);

    const decrypted = decrypt(ciphertext, iv, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });
});
