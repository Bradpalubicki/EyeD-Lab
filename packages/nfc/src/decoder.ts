/**
 * NFC profile decoder for NTAG216.
 * Decodes an 888-byte Buffer back into an NFCProfile.
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
  URL_SIZE,
  CRC32_OFFSET,
  CRC32_DATA_END,
} from './constants.js';
import type { Allergy, Condition, EmergencyContact, Medication, NFCProfile } from './types.js';
import { BloodType, MedFrequency, Severity } from './types.js';

/**
 * Read a fixed-size UTF-8 string from a buffer region, stripping null bytes and trailing whitespace.
 */
function readFixedString(buf: Buffer, offset: number, size: number): string {
  const slice = buf.subarray(offset, offset + size);
  // Find first null byte
  let end = slice.indexOf(0);
  if (end === -1) end = size;
  return slice.subarray(0, end).toString('utf-8');
}

/**
 * Check if a fixed-size buffer region is entirely zeroed.
 */
function isZeroed(buf: Buffer, offset: number, size: number): boolean {
  for (let i = offset; i < offset + size; i++) {
    if (buf[i] !== 0) return false;
  }
  return true;
}

/**
 * Decode an 888-byte NTAG216 buffer into an NFCProfile.
 *
 * @throws {RangeError} if buffer is not exactly 888 bytes
 * @throws {Error} if CRC32 checksum does not match
 * @throws {RangeError} if blood type value is out of range
 */
export function decode(data: Buffer): NFCProfile {
  if (!Buffer.isBuffer(data)) {
    throw new TypeError('data must be a Buffer');
  }

  if (data.length !== NFC_TOTAL_SIZE) {
    throw new RangeError(
      `Expected buffer of ${NFC_TOTAL_SIZE} bytes, got ${data.length}`,
    );
  }

  // --- Verify CRC32 ---
  const storedCrc = data.readUInt32LE(CRC32_OFFSET);
  const computedCrc = crc32(data.subarray(0, CRC32_DATA_END));
  if (storedCrc !== computedCrc) {
    throw new Error(
      `CRC32 checksum mismatch: stored 0x${storedCrc.toString(16).padStart(8, '0')}, computed 0x${computedCrc.toString(16).padStart(8, '0')}`,
    );
  }

  // --- Header ---
  const protocolVersion = data.readUInt8(HEADER_OFFSET);
  const flags = data.readUInt8(HEADER_OFFSET + 1);

  // --- Patient ID Hash ---
  const patientIdHash = Buffer.alloc(PATIENT_HASH_SIZE);
  data.copy(patientIdHash, 0, PATIENT_HASH_OFFSET, PATIENT_HASH_OFFSET + PATIENT_HASH_SIZE);

  // --- Blood Type ---
  const bloodTypeVal = data.readUInt8(BLOOD_TYPE_OFFSET);
  if (bloodTypeVal > BloodType.UNKNOWN) {
    throw new RangeError(`Invalid blood type value: ${bloodTypeVal}`);
  }
  const bloodType: BloodType = bloodTypeVal;

  // --- Allergies ---
  const allergies: Allergy[] = [];
  for (let i = 0; i < MAX_ALLERGIES; i++) {
    const off = ALLERGIES_OFFSET + i * ALLERGY_ENTRY_SIZE;
    if (isZeroed(data, off, ALLERGY_ENTRY_SIZE)) continue;
    const severity: Severity = data.readUInt8(off);
    const name = readFixedString(data, off + 1, ALLERGY_NAME_SIZE);
    allergies.push({ name, severity });
  }

  // --- Medications ---
  const medications: Medication[] = [];
  for (let i = 0; i < MAX_MEDICATIONS; i++) {
    const off = MEDICATIONS_OFFSET + i * MEDICATION_ENTRY_SIZE;
    if (isZeroed(data, off, MEDICATION_ENTRY_SIZE)) continue;
    const dosageMg = data.readUInt16LE(off);
    const name = readFixedString(data, off + 2, MEDICATION_NAME_SIZE);
    const frequency: MedFrequency = data.readUInt8(off + 2 + MEDICATION_NAME_SIZE);
    medications.push({ name, dosageMg, frequency });
  }

  // --- Conditions ---
  const conditions: Condition[] = [];
  for (let i = 0; i < MAX_CONDITIONS; i++) {
    const off = CONDITIONS_OFFSET + i * CONDITION_ENTRY_SIZE;
    if (isZeroed(data, off, CONDITION_ENTRY_SIZE)) continue;
    const severity: Severity = data.readUInt8(off);
    const name = readFixedString(data, off + 1, CONDITION_NAME_SIZE);
    conditions.push({ name, severity });
  }

  // --- Emergency Contacts ---
  const emergencyContacts: EmergencyContact[] = [];
  for (let i = 0; i < MAX_CONTACTS; i++) {
    const off = CONTACTS_OFFSET + i * CONTACT_ENTRY_SIZE;
    if (isZeroed(data, off, CONTACT_ENTRY_SIZE)) continue;
    const name = readFixedString(data, off, CONTACT_NAME_SIZE);
    const phone = readFixedString(data, off + CONTACT_NAME_SIZE, CONTACT_PHONE_SIZE);
    const relationship = readFixedString(
      data,
      off + CONTACT_NAME_SIZE + CONTACT_PHONE_SIZE,
      CONTACT_RELATIONSHIP_SIZE,
    );
    emergencyContacts.push({ name, phone, relationship });
  }

  // --- Emergency URL ---
  const emergencyUrl = readFixedString(data, URL_OFFSET, URL_SIZE);

  return {
    protocolVersion,
    flags,
    patientIdHash,
    bloodType,
    allergies,
    medications,
    conditions,
    emergencyContacts,
    emergencyUrl,
  };
}
