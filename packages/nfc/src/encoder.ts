/**
 * NFC profile encoder for NTAG216.
 * Encodes an NFCProfile into exactly 888 bytes.
 */

import { crc32 } from './crc32.js';
import {
  NFC_TOTAL_SIZE,
  HEADER_OFFSET,
  PATIENT_HASH_OFFSET,
  PATIENT_HASH_SIZE,
  BLOOD_TYPE_OFFSET,
  ALLERGIES_OFFSET,
  ALLERGY_ENTRY_SIZE,
  ALLERGY_NAME_SIZE,
  MAX_ALLERGIES,
  MEDICATIONS_OFFSET,
  MEDICATION_ENTRY_SIZE,
  MEDICATION_NAME_SIZE,
  MAX_MEDICATIONS,
  CONDITIONS_OFFSET,
  CONDITION_ENTRY_SIZE,
  CONDITION_NAME_SIZE,
  MAX_CONDITIONS,
  CONTACTS_OFFSET,
  CONTACT_ENTRY_SIZE,
  CONTACT_NAME_SIZE,
  CONTACT_PHONE_SIZE,
  CONTACT_RELATIONSHIP_SIZE,
  MAX_CONTACTS,
  URL_OFFSET,
  MAX_URL_LENGTH,
  CRC32_OFFSET,
  CRC32_DATA_END,
} from './constants.js';
import type { NFCProfile } from './types.js';
import { BloodType, Severity, MedFrequency } from './types.js';

/**
 * Write a UTF-8 string into a fixed-size region of the buffer, truncating if needed.
 * Remaining bytes are left as zero (buffer is pre-zeroed).
 */
function writeFixedString(buf: Buffer, offset: number, maxLen: number, str: string): void {
  const encoded = Buffer.from(str, 'utf-8');
  const len = Math.min(encoded.length, maxLen);
  encoded.copy(buf, offset, 0, len);
}

/**
 * Validate enum value is within a known range.
 */
function validateEnum(value: number, name: string, maxValue: number): void {
  if (!Number.isInteger(value) || value < 0 || value > maxValue) {
    throw new RangeError(`${name} must be an integer between 0 and ${maxValue}, got ${value}`);
  }
}

/**
 * Encode an NFCProfile into an 888-byte Buffer for writing to NTAG216.
 *
 * Layout:
 *   See constants.ts for full offset table.
 *
 * @throws {RangeError} if any field exceeds its constraints
 * @throws {TypeError} if patientIdHash is not exactly 32 bytes
 */
export function encode(profile: NFCProfile): Buffer {
  // --- Validate constraints ---

  if (!Buffer.isBuffer(profile.patientIdHash) || profile.patientIdHash.length !== PATIENT_HASH_SIZE) {
    throw new TypeError(
      `patientIdHash must be a Buffer of exactly ${PATIENT_HASH_SIZE} bytes, got ${
        Buffer.isBuffer(profile.patientIdHash) ? profile.patientIdHash.length : typeof profile.patientIdHash
      }`,
    );
  }

  validateEnum(profile.protocolVersion, 'protocolVersion', 255);
  validateEnum(profile.flags, 'flags', 255);
  validateEnum(profile.bloodType, 'bloodType', BloodType.UNKNOWN);

  if (profile.allergies.length > MAX_ALLERGIES) {
    throw new RangeError(`allergies: max ${MAX_ALLERGIES} entries, got ${profile.allergies.length}`);
  }

  if (profile.medications.length > MAX_MEDICATIONS) {
    throw new RangeError(`medications: max ${MAX_MEDICATIONS} entries, got ${profile.medications.length}`);
  }

  if (profile.conditions.length > MAX_CONDITIONS) {
    throw new RangeError(`conditions: max ${MAX_CONDITIONS} entries, got ${profile.conditions.length}`);
  }

  if (profile.emergencyContacts.length > MAX_CONTACTS) {
    throw new RangeError(
      `emergencyContacts: max ${MAX_CONTACTS} entries, got ${profile.emergencyContacts.length}`,
    );
  }

  const urlBytes = Buffer.from(profile.emergencyUrl, 'utf-8');
  if (urlBytes.length > MAX_URL_LENGTH) {
    throw new RangeError(
      `emergencyUrl: max ${MAX_URL_LENGTH} UTF-8 bytes, got ${urlBytes.length}`,
    );
  }

  // Validate nested enums
  for (const [i, allergy] of profile.allergies.entries()) {
    validateEnum(allergy.severity, `allergies[${i}].severity`, Severity.LIFE_THREATENING);
  }
  for (const [i, med] of profile.medications.entries()) {
    validateEnum(med.frequency, `medications[${i}].frequency`, MedFrequency.OTHER);
    if (!Number.isInteger(med.dosageMg) || med.dosageMg < 0 || med.dosageMg > 65535) {
      throw new RangeError(
        `medications[${i}].dosageMg must be an integer 0-65535, got ${med.dosageMg}`,
      );
    }
  }
  for (const [i, cond] of profile.conditions.entries()) {
    validateEnum(cond.severity, `conditions[${i}].severity`, Severity.LIFE_THREATENING);
  }

  // --- Allocate zeroed buffer ---
  const buf = Buffer.alloc(NFC_TOTAL_SIZE, 0);

  // --- Header (4 bytes) ---
  buf.writeUInt8(profile.protocolVersion, HEADER_OFFSET);
  buf.writeUInt8(profile.flags, HEADER_OFFSET + 1);
  // bytes 2-3 reserved (already zero)

  // --- Patient ID Hash (32 bytes) ---
  profile.patientIdHash.copy(buf, PATIENT_HASH_OFFSET);

  // --- Blood Type (1 byte) ---
  buf.writeUInt8(profile.bloodType, BLOOD_TYPE_OFFSET);

  // --- Allergies (64 bytes = 8 * 8B) ---
  for (let i = 0; i < profile.allergies.length; i++) {
    const a = profile.allergies[i]!;
    const off = ALLERGIES_OFFSET + i * ALLERGY_ENTRY_SIZE;
    buf.writeUInt8(a.severity, off);
    writeFixedString(buf, off + 1, ALLERGY_NAME_SIZE, a.name);
  }

  // --- Medications (128 bytes = 10 * 12B + 8B padding) ---
  // Each entry: 2B dosage (uint16 LE) + 9B name + 1B frequency = 12B
  for (let i = 0; i < profile.medications.length; i++) {
    const m = profile.medications[i]!;
    const off = MEDICATIONS_OFFSET + i * MEDICATION_ENTRY_SIZE;
    buf.writeUInt16LE(m.dosageMg, off);
    writeFixedString(buf, off + 2, MEDICATION_NAME_SIZE, m.name);
    buf.writeUInt8(m.frequency, off + 2 + MEDICATION_NAME_SIZE);
  }

  // --- Conditions (64 bytes = 8 * 8B) ---
  for (let i = 0; i < profile.conditions.length; i++) {
    const c = profile.conditions[i]!;
    const off = CONDITIONS_OFFSET + i * CONDITION_ENTRY_SIZE;
    buf.writeUInt8(c.severity, off);
    writeFixedString(buf, off + 1, CONDITION_NAME_SIZE, c.name);
  }

  // --- Emergency Contacts (256 bytes = 3 * 85B + 1B padding) ---
  // Each entry: 30B name + 20B phone + 15B relationship + 20B reserved = 85B
  for (let i = 0; i < profile.emergencyContacts.length; i++) {
    const ec = profile.emergencyContacts[i]!;
    const off = CONTACTS_OFFSET + i * CONTACT_ENTRY_SIZE;
    writeFixedString(buf, off, CONTACT_NAME_SIZE, ec.name);
    writeFixedString(buf, off + CONTACT_NAME_SIZE, CONTACT_PHONE_SIZE, ec.phone);
    writeFixedString(buf, off + CONTACT_NAME_SIZE + CONTACT_PHONE_SIZE, CONTACT_RELATIONSHIP_SIZE, ec.relationship);
    // 20B reserved (already zero)
  }

  // --- Emergency URL (128 bytes, null-terminated) ---
  urlBytes.copy(buf, URL_OFFSET, 0, urlBytes.length);
  // Null terminator and rest already zero

  // --- Signature (64 bytes) ---
  // Zeroed for now (Phase 2 will add real ECDSA signing)

  // --- CRC32 (4 bytes) ---
  const checksum = crc32(buf.subarray(0, CRC32_DATA_END));
  buf.writeUInt32LE(checksum, CRC32_OFFSET);

  // --- Reserved (143 bytes) ---
  // Already zero

  return buf;
}
