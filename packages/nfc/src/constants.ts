/**
 * NTAG216 NFC data layout constants.
 *
 * Total: 888 bytes (0x378)
 *
 * Offset  Size   Field
 * 0x00    4B     Header (version u8 + flags u8 + reserved 2B)
 * 0x04    32B    Patient ID hash (SHA-256)
 * 0x24    1B     Blood type (enum)
 * 0x25    64B    Allergies (8 x 8B)
 * 0x65    128B   Medications (10 x 12B + 8B padding)
 * 0xE5    64B    Conditions (8 x 8B)
 * 0x125   256B   Emergency contacts (3 x 85B + 1B padding)
 * 0x225   128B   Emergency access URL (UTF-8 null-terminated)
 * 0x2A5   64B    ECDSA signature placeholder
 * 0x2E5   4B     CRC32 checksum (over 0x00..0x2E4)
 * 0x2E9   143B   Reserved
 */

// Total tag capacity
export const NFC_TOTAL_SIZE = 888;

// --- Header ---
export const HEADER_OFFSET = 0x00;
export const HEADER_SIZE = 4;

// --- Patient ID Hash ---
export const PATIENT_HASH_OFFSET = 0x04;
export const PATIENT_HASH_SIZE = 32;

// --- Blood Type ---
export const BLOOD_TYPE_OFFSET = 0x24;
export const BLOOD_TYPE_SIZE = 1;

// --- Allergies ---
export const ALLERGIES_OFFSET = 0x25;
export const ALLERGIES_SECTION_SIZE = 64;
export const ALLERGY_ENTRY_SIZE = 8; // 1B severity + 7B name
export const ALLERGY_NAME_SIZE = 7;
export const MAX_ALLERGIES = 8;

// --- Medications ---
export const MEDICATIONS_OFFSET = 0x65;
export const MEDICATIONS_SECTION_SIZE = 128;
export const MEDICATION_ENTRY_SIZE = 12; // 2B dosage + 10B name + (freq is packed into last byte before padding -- actually: 2B dosage + 9B name + 1B freq = 12B)
export const MEDICATION_NAME_SIZE = 9;
export const MAX_MEDICATIONS = 10;
// 10 * 12 = 120B used, 8B padding

// --- Conditions ---
export const CONDITIONS_OFFSET = 0xe5;
export const CONDITIONS_SECTION_SIZE = 64;
export const CONDITION_ENTRY_SIZE = 8; // 1B severity + 7B name
export const CONDITION_NAME_SIZE = 7;
export const MAX_CONDITIONS = 8;

// --- Emergency Contacts ---
export const CONTACTS_OFFSET = 0x125;
export const CONTACTS_SECTION_SIZE = 256;
export const CONTACT_ENTRY_SIZE = 85; // 30B name + 20B phone + 15B relationship + 20B reserved
export const CONTACT_NAME_SIZE = 30;
export const CONTACT_PHONE_SIZE = 20;
export const CONTACT_RELATIONSHIP_SIZE = 15;
export const CONTACT_RESERVED_SIZE = 20;
export const MAX_CONTACTS = 3;
// 3 * 85 = 255B used, 1B padding

// --- Emergency URL ---
export const URL_OFFSET = 0x225;
export const URL_SIZE = 128;
export const MAX_URL_LENGTH = 127; // 1 byte reserved for null terminator

// --- Signature ---
export const SIGNATURE_OFFSET = 0x2a5;
export const SIGNATURE_SIZE = 64;

// --- CRC32 ---
export const CRC32_OFFSET = 0x2e5;
export const CRC32_SIZE = 4;

// CRC is computed over bytes 0x00 through 0x2E4 inclusive
export const CRC32_DATA_END = 0x2e5;

// --- Reserved ---
export const RESERVED_OFFSET = 0x2e9;
export const RESERVED_SIZE = 143;
