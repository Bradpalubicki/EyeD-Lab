import { describe, it, expect } from 'vitest';
import { encode } from '../encoder.js';
import { decode } from '../decoder.js';
import { BloodType, MedFrequency, Severity } from '../types.js';
import type { NFCProfile } from '../types.js';
import { NFC_TOTAL_SIZE, CRC32_OFFSET } from '../constants.js';

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
    allergies: [
      { name: 'Peanut', severity: Severity.LIFE_THREATENING },
      { name: 'Latex', severity: Severity.MODERATE },
      { name: 'Dust', severity: Severity.MILD },
    ],
    medications: [
      { name: 'Aspirin', dosageMg: 500, frequency: MedFrequency.TWICE_DAILY },
      { name: 'Metformi', dosageMg: 1000, frequency: MedFrequency.ONCE_DAILY },
    ],
    conditions: [
      { name: 'Diabete', severity: Severity.SEVERE },
      { name: 'Asthma', severity: Severity.MODERATE },
    ],
    emergencyContacts: [
      { name: 'Jane Doe', phone: '+15551234567', relationship: 'Spouse' },
      { name: 'Dr. Adams', phone: '+15551112222', relationship: 'Doctor' },
    ],
    emergencyUrl: 'https://eyed.health/emergency/abc123',
  };
}

describe('decode', () => {
  it('throws on non-buffer input', () => {
    expect(() => decode('not a buffer' as unknown as Buffer)).toThrow(/Buffer/);
  });

  it('throws on wrong buffer size', () => {
    expect(() => decode(Buffer.alloc(100))).toThrow(/888/);
    expect(() => decode(Buffer.alloc(889))).toThrow(/888/);
    expect(() => decode(Buffer.alloc(0))).toThrow(/888/);
  });

  it('throws on corrupted CRC', () => {
    const buf = encode(minimalProfile());
    // Flip a bit in the CRC
    buf[CRC32_OFFSET] = (buf[CRC32_OFFSET]! ^ 0xff);
    expect(() => decode(buf)).toThrow(/CRC32 checksum mismatch/);
  });

  it('throws when data is tampered (body change invalidates CRC)', () => {
    const buf = encode(fullProfile());
    // Tamper with blood type byte but leave CRC unchanged
    buf[0x24] = 0xff;
    expect(() => decode(buf)).toThrow(/CRC32 checksum mismatch/);
  });

  it('roundtrips a minimal profile', () => {
    const original = minimalProfile();
    const buf = encode(original);
    const decoded = decode(buf);

    expect(decoded.protocolVersion).toBe(original.protocolVersion);
    expect(decoded.flags).toBe(original.flags);
    expect(decoded.patientIdHash.equals(original.patientIdHash)).toBe(true);
    expect(decoded.bloodType).toBe(original.bloodType);
    expect(decoded.allergies).toEqual([]);
    expect(decoded.medications).toEqual([]);
    expect(decoded.conditions).toEqual([]);
    expect(decoded.emergencyContacts).toEqual([]);
    expect(decoded.emergencyUrl).toBe('');
  });

  it('roundtrips a full profile with all data preserved', () => {
    const original = fullProfile();
    const buf = encode(original);
    const decoded = decode(buf);

    expect(decoded.protocolVersion).toBe(original.protocolVersion);
    expect(decoded.flags).toBe(original.flags);
    expect(decoded.patientIdHash.equals(original.patientIdHash)).toBe(true);
    expect(decoded.bloodType).toBe(original.bloodType);

    // Allergies (names may be truncated to 7 bytes)
    expect(decoded.allergies.length).toBe(original.allergies.length);
    for (let i = 0; i < original.allergies.length; i++) {
      expect(decoded.allergies[i]!.severity).toBe(original.allergies[i]!.severity);
      expect(decoded.allergies[i]!.name).toBe(original.allergies[i]!.name.slice(0, 7));
    }

    // Medications (names may be truncated to 9 bytes)
    expect(decoded.medications.length).toBe(original.medications.length);
    for (let i = 0; i < original.medications.length; i++) {
      expect(decoded.medications[i]!.dosageMg).toBe(original.medications[i]!.dosageMg);
      expect(decoded.medications[i]!.frequency).toBe(original.medications[i]!.frequency);
      expect(decoded.medications[i]!.name).toBe(original.medications[i]!.name.slice(0, 9));
    }

    // Conditions (names may be truncated to 7 bytes)
    expect(decoded.conditions.length).toBe(original.conditions.length);
    for (let i = 0; i < original.conditions.length; i++) {
      expect(decoded.conditions[i]!.severity).toBe(original.conditions[i]!.severity);
      expect(decoded.conditions[i]!.name).toBe(original.conditions[i]!.name.slice(0, 7));
    }

    // Emergency contacts (names up to 30B, phone 20B, relationship 15B)
    expect(decoded.emergencyContacts.length).toBe(original.emergencyContacts.length);
    for (let i = 0; i < original.emergencyContacts.length; i++) {
      expect(decoded.emergencyContacts[i]!.name).toBe(
        original.emergencyContacts[i]!.name.slice(0, 30),
      );
      expect(decoded.emergencyContacts[i]!.phone).toBe(
        original.emergencyContacts[i]!.phone.slice(0, 20),
      );
      expect(decoded.emergencyContacts[i]!.relationship).toBe(
        original.emergencyContacts[i]!.relationship.slice(0, 15),
      );
    }

    // URL
    expect(decoded.emergencyUrl).toBe(original.emergencyUrl);
  });

  it('roundtrips all blood types', () => {
    for (const bt of [
      BloodType.O_NEG, BloodType.O_POS, BloodType.A_NEG, BloodType.A_POS,
      BloodType.B_NEG, BloodType.B_POS, BloodType.AB_NEG, BloodType.AB_POS,
      BloodType.UNKNOWN,
    ]) {
      const profile = minimalProfile();
      profile.bloodType = bt;
      const decoded = decode(encode(profile));
      expect(decoded.bloodType).toBe(bt);
    }
  });

  it('roundtrips max items (8 allergies, 10 meds, 8 conditions, 3 contacts)', () => {
    const profile: NFCProfile = {
      protocolVersion: 1,
      flags: 0,
      patientIdHash: Buffer.alloc(32, 0x42),
      bloodType: BloodType.A_POS,
      allergies: Array.from({ length: 8 }, (_, i) => ({
        name: `Alg${i}`,
        severity: (i % 4) as Severity,
      })),
      medications: Array.from({ length: 10 }, (_, i) => ({
        name: `Med${i}`,
        dosageMg: (i + 1) * 50,
        frequency: (i % 8) as MedFrequency,
      })),
      conditions: Array.from({ length: 8 }, (_, i) => ({
        name: `Cnd${i}`,
        severity: (i % 4) as Severity,
      })),
      emergencyContacts: Array.from({ length: 3 }, (_, i) => ({
        name: `Contact ${i}`,
        phone: `+1555000${i}`,
        relationship: 'Friend',
      })),
      emergencyUrl: 'https://eyed.health/e/max',
    };

    const buf = encode(profile);
    expect(buf.length).toBe(NFC_TOTAL_SIZE);

    const decoded = decode(buf);
    expect(decoded.allergies.length).toBe(8);
    expect(decoded.medications.length).toBe(10);
    expect(decoded.conditions.length).toBe(8);
    expect(decoded.emergencyContacts.length).toBe(3);
  });

  it('handles zero-value severity (MILD = 0) correctly in allergies', () => {
    // Edge case: severity 0 means the allergy entry is not all-zeros if name is set.
    // But if severity=0 and name is empty, the entry IS all-zeros and should be skipped.
    const profile = minimalProfile();
    profile.allergies = [{ name: 'Egg', severity: Severity.MILD }];
    const decoded = decode(encode(profile));
    expect(decoded.allergies.length).toBe(1);
    expect(decoded.allergies[0]!.name).toBe('Egg');
    expect(decoded.allergies[0]!.severity).toBe(Severity.MILD);
  });

  it('handles zero dosage medication correctly', () => {
    // dosageMg = 0 with a non-empty name should still be decoded
    const profile = minimalProfile();
    profile.medications = [{ name: 'Placebo', dosageMg: 0, frequency: MedFrequency.AS_NEEDED }];
    const decoded = decode(encode(profile));
    expect(decoded.medications.length).toBe(1);
    expect(decoded.medications[0]!.name).toBe('Placebo');
    expect(decoded.medications[0]!.dosageMg).toBe(0);
  });

  it('preserves patientIdHash exactly across roundtrip', () => {
    const hash = Buffer.alloc(32);
    for (let i = 0; i < 32; i++) hash[i] = i;
    const profile = minimalProfile();
    profile.patientIdHash = hash;
    const decoded = decode(encode(profile));
    expect(decoded.patientIdHash.equals(hash)).toBe(true);
  });
});
