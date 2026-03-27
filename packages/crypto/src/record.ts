import { encrypt, decrypt } from "./aes.js";
import { generateDEK, wrapDEK, unwrapDEK, type WrappedDEK } from "./keys.js";

export interface EncryptedRecord {
  encryptedData: Buffer;
  encryptedDEK: WrappedDEK;
  iv: Buffer;
  authTag: Buffer;
}

export function encryptRecord(data: string, kek: Buffer): EncryptedRecord {
  const dek = generateDEK();
  const encryptedDEK = wrapDEK(dek, kek);

  const { ciphertext, iv, authTag } = encrypt(Buffer.from(data, "utf-8"), dek);

  return {
    encryptedData: ciphertext,
    encryptedDEK,
    iv,
    authTag,
  };
}

export function decryptRecord(
  encryptedData: Buffer,
  encryptedDEK: WrappedDEK,
  iv: Buffer,
  authTag: Buffer,
  kek: Buffer,
): string {
  const dek = unwrapDEK(
    encryptedDEK.wrapped,
    encryptedDEK.iv,
    encryptedDEK.authTag,
    kek,
  );

  const plaintext = decrypt(encryptedData, iv, authTag, dek);
  return plaintext.toString("utf-8");
}
