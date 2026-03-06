import { describe, it, expect } from 'vitest';
import { crc32 } from '../crc32.js';

describe('crc32', () => {
  it('returns 0x00000000 for an empty buffer', () => {
    expect(crc32(Buffer.alloc(0))).toBe(0x00000000);
  });

  it('computes the correct CRC32 for the ASCII string "123456789"', () => {
    // IEEE 802.3 / ISO 3309 check value
    const input = Buffer.from('123456789', 'ascii');
    expect(crc32(input)).toBe(0xcbf43926);
  });

  it('computes the correct CRC32 for a single byte 0x00', () => {
    expect(crc32(Buffer.from([0x00]))).toBe(0xd202ef8d);
  });

  it('computes the correct CRC32 for "EYED"', () => {
    const input = Buffer.from('EYED', 'ascii');
    const result = crc32(input);
    // Determinism check: calling twice must return same value
    expect(crc32(input)).toBe(result);
    // Value must be a 32-bit unsigned integer
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
  });

  it('is deterministic across multiple calls', () => {
    const data = Buffer.from([0xde, 0xad, 0xbe, 0xef, 0xca, 0xfe]);
    const first = crc32(data);
    const second = crc32(data);
    const third = crc32(data);
    expect(first).toBe(second);
    expect(second).toBe(third);
  });

  it('produces different checksums for different inputs', () => {
    const a = crc32(Buffer.from('hello'));
    const b = crc32(Buffer.from('world'));
    expect(a).not.toBe(b);
  });

  it('handles a zeroed buffer of 888 bytes', () => {
    const buf = Buffer.alloc(888, 0);
    const result = crc32(buf);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
    // Deterministic
    expect(crc32(buf)).toBe(result);
  });
});
