/**
 * Pure CRC32 implementation (IEEE 802.3 polynomial 0xEDB88320).
 * No external dependencies.
 */

const CRC32_TABLE = new Uint32Array(256);

// Build lookup table once at module load
for (let i = 0; i < 256; i++) {
  let crc = i;
  for (let j = 0; j < 8; j++) {
    if (crc & 1) {
      crc = (crc >>> 1) ^ 0xedb88320;
    } else {
      crc = crc >>> 1;
    }
  }
  CRC32_TABLE[i] = crc >>> 0;
}

/**
 * Compute CRC32 checksum of a buffer.
 * Returns an unsigned 32-bit integer.
 */
export function crc32(data: Buffer | Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i]!;
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff]!;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
