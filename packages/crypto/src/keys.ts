import { hkdf, randomBytes } from "node:crypto";
import { encrypt, decrypt } from "./aes.js";

const KEK_LENGTH = 32;
const DEK_LENGTH = 32;

export interface WrappedDEK {
  wrapped: Buffer;
  iv: Buffer;
  authTag: Buffer;
}

export function deriveKEK(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    hkdf("sha256", password, salt, "", KEK_LENGTH, (err, derivedKey) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(Buffer.from(derivedKey));
    });
  });
}

export function generateDEK(): Buffer {
  return randomBytes(DEK_LENGTH);
}

export function wrapDEK(dek: Buffer, kek: Buffer): WrappedDEK {
  const { ciphertext, iv, authTag } = encrypt(dek, kek);
  return { wrapped: ciphertext, iv, authTag };
}

export function unwrapDEK(
  wrapped: Buffer,
  iv: Buffer,
  authTag: Buffer,
  kek: Buffer,
): Buffer {
  return decrypt(wrapped, iv, authTag, kek);
}
