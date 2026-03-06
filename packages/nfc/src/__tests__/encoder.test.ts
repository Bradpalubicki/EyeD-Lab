import { describe, it, expect } from 'vitest';
import { encode } from '../encoder.js';
import { BloodType, MedFrequency, Severity } from '../types.js';
import type { NFCProfile } from '../types.js';
import { NFC_TOTAL_SIZE, CRC32_OFFSET, CRC32_DATA_END } from '../constants.js';
import { crc32 } from '../crc32.js';

/** Helper: create a minimal valid profile. */
function minimalProfile(): NFCProfile {
  return {
    protocolVersion: 1,
    flags: 0,
    patientIdHash: Buffer.alloc(32, 0xab),
    bloodType: BloodType.O_POS,
    allergies: [],
    medications: [],
    conditions: [],
    emergencyContacts: [],
    emergencyUrl: '',
  };
}

/** Helper: create a fully-loaded profile with max items. */
function fullProfile(): NFCProfile {
  return {
    protocolVersion: 1,
    flags: 0b00000011,
    patientIdHash: Buffer.alloc(32, 0xff),
    bloodType: BloodType.AB_POS,
    allergies: Array.from({ length: 8 }, (_, i) => ({
      name: `Alg${i + 1}`,
      severity: i % 4 as Severity,
    })),
    medications: Array.from({ length: 10 }, (_, i) => ({
      name: `Med${i + 1}`,
      dosageMg: (i + 1) * 100,
      frequency: i % 8 as MedFrequency,
    })),
    conditions: Array.from({ length: 8 }, (_, i) => ({
      name: `Cond${i + 1}`,
      severity: i % 4 as Severity,
    })),
    emergencyContacts: [
      { name: 'Jane Doe', phone: '+15551234567', relationship: 'Spouse' },
      { name: 'John Smith', phone: '+15559876543', relationship: 'Parent' },
      { name: 'Dr. Adams', phone: '+15551112222', relationship: 'Doctor' },
    ],
    emergencyUrl: 'https://eyed.health/emergency/abc123',
  };
}

describe('encode', () => {
  it('produces exactly 888 bytes for a minimal profile', () => {
    const buf = encode(minimalProfile());
    expect(buf.length).toBe(NFC_TOTAL_SIZE);
  });

  it('produces exactly 888 bytes for a full profile', () => {
    const buf = encode(fullProfile());
    expect(buf.length).toBe(NFC_TOTAL_SIZE);
  });

  it('writes protocol version and flags into the header', () => {
    const profile = minimalProfile();
    profile.protocolVersion = 2;
    profile.flags = 0b10101010;
    const buf = encode(profile);
    expect(buf.readUInt8(0x00)).toBe(2);
    expect(buf.readUInt8(0x01)).toBe(0b10101010);
    // reserved bytes
    expect(buf.readUInt8(0x02)).toBe(0);
    expect(buf.readUInt8(0x03)).toBe(0);
  });

  it('writes patient ID hash at offset 0x04', () => {
    const hash = Buffer.alloc(32);
    hash.fill(0xde, 0, 16);
    hash.fill(0xad, 16, 32);
    const profile = minimalProfile();
    profile.patientIdHash = hash;
    const buf = encode(profile);
    expect(buf.subarray(0x04, 0x24).equals(hash)).toBe(true);
  });

  it('encodes blood type correctly', () => {
    for (const bt of [
      BloodType.O_NEG, BloodType.O_POS, BloodType.A_NEG, BloodType.A_POS,
      BloodType.B_NEG, BloodType.B_POS, BloodType.AB_NEG, BloodType.AB_POS,
      BloodType.UNKNOWN,
    ]) {
      const profile = minimalProfile();
      profile.bloodType = bt;
      const buf = encode(profile);
      expect(buf.readUInt8(0x24)).toBe(bt);
    }
  });

  it('writes allergies at offset 0x25', () => {
    const profile = minimalProfile();
    profile.allergies = [
      { name: 'Peanuts', severity: Severity.LIFE_THREATENING },
      { name: 'Latex', severity: Severity.MODERATE },
    ];
    const buf = encode(profile);
    // First allergy
    expect(buf.readUInt8(0x25)).toBe(Severity.LIFE_THREATENING);
    expect(buf.subarray(0x26, 0x26 + 7).toString('utf-8').replace(/\0/g, '')).toBe('Peanuts');
    // Second allergy
    expect(buf.readUInt8(0x2d)).toBe(Severity.MODERATE);
    expect(buf.subarray(0x2e, 0x2e + 5).toString('utf-8')).toBe('Latex');
  });

  it('writes medications at offset 0x65', () => {
    const profile = minimalProfile();
    profile.medications = [
      { name: 'Aspirin', dosageMg: 500, frequency: MedFrequency.TWICE_DAILY },
    ];
    const buf = encode(profile);
    expect(buf.readUInt16LE(0x65)).toBe(500);
    expect(buf.subarray(0x67, 0x67 + 7).toString('utf-8').replace(/\0/g, '')).toBe('Aspirin');
    expect(buf.readUInt8(0x65 + 2 + 9)).toBe(MedFrequency.TWICE_DAILY);
  });

  it('computes a valid CRC32 checksum', () => {
    const buf = encode(fullProfile());
    const storedCrc = buf.readUInt32LE(CRC32_OFFSET);
    const computedCrc = crc32(buf.subarray(0, CRC32_DATA_END));
    expect(storedCrc).toBe(computedCrc);
  });

  // --- Validation errors ---

  it('throws if allergies exceed max 8', () => {
    const profile = minimalProfile();
    profile.allergies = Array.from({ length: 9 }, (_, i) => ({
      name: `A${i}`,
      severity: Severity.MILD,
    }));
    expect(() => encode(profile)).toThrow(/max 8/);
  });

  it('throws if medications exceed max 10', () => {
    const profile = minimalProfile();
    profile.medications = Array.from({ length: 11 }, (_, i) => ({
      name: `M${i}`,
      dosageMg: 100,
      frequency: MedFrequency.ONCE_DAILY,
    }));
    expect(() => encode(profile)).toThrow(/max 10/);
  });

  it('throws if conditions exceed max 8', () => {
    const profile = minimalProfile();
    profile.conditions = Array.from({ length: 9 }, (_, i) => ({
      name: `C${i}`,
      severity: Severity.MILD,
    }));
    expect(() => encode(profile)).toThrow(/max 8/);
  });

  it('throws if emergencyContacts exceed max 3', () => {
    const profile = minimalProfile();
    profile.emergencyContacts = Array.from({ length: 4 }, (_, i) => ({
      name: `Contact${i}`,
      phone: '555-0000',
      relationship: 'Friend',
    }));
    expect(() => encode(profile)).toThrow(/max 3/);
  });

  it('throws if emergencyUrl exceeds 127 UTF-8 bytes', () => {
    const profile = minimalProfile();
    profile.emergencyUrl = 'https://eyed.health/' + 'x'.repeat(200);
    expect(() => encode(profile)).toThrow(/max 127/);
  });

  it('throws if patientIdHash is not 32 bytes', () => {
    const profile = minimalProfile();
    profile.patientIdHash = Buffer.alloc(16);
    expect(() => encode(profile)).toThrow(/32 bytes/);
  });

  it('throws if blood type is out of range', () => {
    const profile = minimalProfile();
    profile.bloodType = 99 as BloodType;
    expect(() => encode(profile)).toThrow(/bloodType/);
  });

  it('throws if dosageMg exceeds uint16 range', () => {
    const profile = minimalProfile();
    profile.medications = [{ name: 'X', dosageMg: 70000, frequency: MedFrequency.ONCE_DAILY }];
    expect(() => encode(profile)).toThrow(/dosageMg/);
  });

  it('truncates allergy names longer than 7 bytes', () => {
    const profile = minimalProfile();
    profile.allergies = [{ name: 'Penicillin', severity: Severity.SEVERE }];
    const buf = encode(profile);
    // Only first 7 bytes of the name fit
    const stored = buf.subarray(0x26, 0x26 + 7).toString('utf-8').replace(/\0/g, '');
    expect(stored).toBe('Penicil');
  });

  it('writes emergency URL at offset 0x225 with null termination', () => {
    const profile = minimalProfile();
    profile.emergencyUrl = 'https://eyed.health/e/test';
    const buf = encode(profile);
    const urlSlice = buf.subarray(0x225, 0x225 + 128);
    const nullIdx = urlSlice.indexOf(0);
    const url = urlSlice.subarray(0, nullIdx).toString('utf-8');
    expect(url).toBe('https://eyed.health/e/test');
  });
});
