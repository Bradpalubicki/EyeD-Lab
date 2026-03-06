# EyeD — Master Project Plan

> **Your eyes. Your records. Your control.**

---

## 1. Vision & Mission

**Vision:** Every person on earth owns and controls their medical identity — accessible anywhere, by anyone they authorize, protected by cryptography they don't need to understand.

**Mission:** Build a platform where your eyes are your medical passport. No cards to lose, no records to fax, no databases to breach. A phone-based eye scan creates your identity. A QR code shares your records. An NFC band protects you when you can't protect yourself. A blockchain ensures no one — not us, not hospitals, not governments — can tamper with the trail.

### Core Principles

| Principle | What It Means |
|---|---|
| **Patient-owned** | You own your data. Period. |
| **Zero-knowledge** | Hospitals verify without storing. They read, they don't keep. |
| **Universal access** | Works with any smartphone. No special hardware. |
| **Emergency-first** | Must work when the patient can't advocate for themselves. |
| **Invisible blockchain** | Users never see or interact with crypto. The tech is invisible. |
| **Humanitarian by design** | Free tier must be genuinely life-saving, not a crippled demo. |

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: PATIENT IDENTITY                    │
│                                                                 │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ Mobile   │  │ Eye Scan   │  │ Face +   │  │ NFC Band     │  │
│  │ App      │  │ (iris +    │  │ Liveness │  │ (NTAG216,    │  │
│  │ (React   │  │ periocular │  │ (fallback│  │  passive,    │  │
│  │ Native / │  │ + sclera)  │  │  for dark│  │  no battery) │  │
│  │ Expo)    │  │            │  │  iris)   │  │              │  │
│  └────┬─────┘  └─────┬──────┘  └────┬─────┘  └──────┬───────┘  │
│       │              │              │               │           │
│       │    Phone Medical ID Auto-Population         │           │
│       │    (iOS HealthKit / Android Safety)          │           │
└───────┼──────────────┼──────────────┼───────────────┼───────────┘
        │              │              │               │
┌───────┼──────────────┼──────────────┼───────────────┼───────────┐
│       ▼              ▼              ▼               ▼           │
│                 LAYER 2: ACCESS CONTROL                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • QR code generation with one-time PIN                  │   │
│  │  • Time-limited session smart contracts                  │   │
│  │  • Tiered access: Emergency / Clinical / Full / Recovery │   │
│  │  • Dual healthcare worker auth (emergency)               │   │
│  │  • Emergency contact cascade (Shamir's Secret Sharing)   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│                 LAYER 3: VERIFICATION                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Zero-knowledge proof engine (Circom + snarkjs)        │   │
│  │  • Selective disclosure (show only requested fields)      │   │
│  │  • Rendered view only — no file download                  │   │
│  │  • Session watermarking (provider ID + timestamp)         │   │
│  │  • On-chain proof verification (Solidity verifier)        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│              LAYER 4: TRUST (BLOCKCHAIN)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Soulbound Token (ERC-5192) — patient identity          │   │
│  │  • Access control smart contracts                         │   │
│  │  • Session management contracts                           │   │
│  │  • Immutable audit log (event emissions)                  │   │
│  │  • Guardian management (children, elderly, incapacitated) │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│                   LAYER 5: DATA                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Encrypted medical records (AES-256-GCM)                │   │
│  │  • Hybrid: IPFS/Pinata (active) + Arweave (archive)      │   │
│  │  • FHIR R4 formatted                                      │   │
│  │  • Patient holds decryption keys                          │   │
│  │  • Off-chain data deletable (GDPR compliant)              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│            LAYER 6: PROVIDER PORTAL                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Browser-based (no install)                             │   │
│  │  • Scan QR / NFC → view authorized records                │   │
│  │  • Add treatment records (patient consent)                │   │
│  │  • FHIR integration with existing EMR (Epic, Cerner)      │   │
│  │  • Emergency dual-auth iris scan station                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│              LAYER 7: BACKEND SERVICES                          │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │ API Gateway│ │ Decryption │ │ FHIR       │ │ Notification│  │
│  │ (Fastify)  │ │ Gateway    │ │ Translation│ │ Service     │  │
│  │            │ │ (CF Worker)│ │ Service    │ │ (Push/SMS)  │  │
│  └────────────┘ └────────────┘ └────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Blockchain Selection

### Comparison Matrix

| Dimension | Base | Polygon PoS | Polygon zkEVM | Arbitrum |
|---|---|---|---|---|
| **Avg gas fee** | ~$0.01 | ~$0.05 | ~$0.03 | ~$0.20 |
| **Throughput** | 1,000+ TPS | 700 TPS | 300 TPS | 400 TPS |
| **EVM compatible** | Full | Full | Full | Full |
| **Developer tooling** | Excellent (Hardhat, Foundry, Viem) | Excellent | Good | Excellent |
| **Healthcare projects** | Growing | Several | Few | Few |
| **Uptime track record** | Strong (Coinbase infra) | Strong (8.4M daily txns) | Newer | Strong |
| **Institutional credibility** | Coinbase-backed | Polygon Labs | Polygon Labs | Offchain Labs |
| **Data availability** | Ethereum L1 (via OP Stack) | Polygon PoS validators | Ethereum L1 (ZK proofs) | Ethereum L1 (fraud proofs) |

### Decision: Base (Primary)

**Rationale:**
- **Lowest gas fees (~$0.01/tx)** — critical for micro-transactions like per-scan access events and audit log entries
- **1,000+ TPS** — handles scale without congestion as user base grows
- **Full EVM compatibility** — all Solidity tooling, OpenZeppelin libraries, and developer infrastructure works out of the box
- **Coinbase backing** — strong institutional credibility, critical for healthcare and government partnerships. Coinbase is a regulated, publicly traded company.
- **Consumer-friendly onboarding** — Coinbase Smart Wallet enables gasless transactions for users via account abstraction (ERC-4337), meaning patients never need to buy or hold crypto
- **Growing ecosystem** — 2nd largest L2 by TVL, attracting serious projects

### Secondary: Polygon PoS

Deploy to Polygon PoS as a secondary chain for regions where Polygon has stronger government relationships (India, Southeast Asia). Multi-chain deployment via shared Solidity codebase and cross-chain identity bridges in Phase 4+.

---

## 4. Smart Contract Architecture

### 4.1 Contract Overview

```
contracts/
├── identity/
│   ├── EyeDIdentity.sol        ← ERC-5192 Soulbound Token
│   └── EyeDIdentityRegistry.sol ← Enrollment management
├── access/
│   ├── EyeDAccess.sol           ← Grant/revoke permissions
│   ├── EyeDSession.sol          ← Time-limited sessions
│   └── EyeDEmergency.sol        ← Emergency access protocol
├── guardian/
│   └── EyeDGuardian.sol         ← Child/elder/org guardianship
├── audit/
│   └── EyeDAudit.sol            ← Event-based audit trail
├── verification/
│   └── EyeDVerifier.sol         ← ZK proof on-chain verifier
└── proxy/
    └── EyeDProxy.sol            ← UUPS upgrade proxy
```

### 4.2 EyeDIdentity.sol (Soulbound Token)

```solidity
// Core interface
interface IEyeDIdentity {
    // Mint a new soulbound identity token
    // Only callable by authorized issuers (EyeD platform)
    function mint(address to, bytes32 identityHash) external returns (uint256);

    // Burn token (patient-initiated account deletion)
    function burn(uint256 tokenId) external;

    // Always returns true — tokens are permanently locked (soulbound)
    function locked(uint256 tokenId) external view returns (bool);

    // Get identity hash for a token
    function getIdentityHash(uint256 tokenId) external view returns (bytes32);

    // Check if an identity hash is already enrolled
    function isEnrolled(bytes32 identityHash) external view returns (bool);
}
```

**Key properties:**
- Inherits: ERC721 + ERC5192 (soulbound extension)
- Non-transferable — `_beforeTokenTransfer` reverts unless minting or burning
- One token per person — enforced by `identityHash` uniqueness mapping
- `identityHash` = hash of ZK proof of enrollment (derived from eye scan, but contains no biometric data)
- Contains: identity hash, enrollment timestamp, guardian address (optional)
- Only mintable by authorized issuer addresses (multi-sig controlled)

### 4.3 EyeDAccess.sol (Access Control)

```solidity
interface IEyeDAccess {
    // Patient grants access to a provider
    function grantAccess(
        uint256 tokenId,
        address provider,
        bytes32 scope,           // which record categories
        uint256 expiry           // block timestamp
    ) external returns (bytes32 sessionId);

    // Patient revokes an active session
    function revokeAccess(
        uint256 tokenId,
        bytes32 sessionId
    ) external;

    // Emergency access — requires dual healthcare worker auth
    function emergencyAccess(
        uint256 tokenId,
        address provider1,       // first healthcare worker
        address provider2,       // second healthcare worker (witness)
        bytes32 facilityId       // registered facility
    ) external returns (bytes32 sessionId);

    // Check if a session is currently valid
    function isSessionValid(bytes32 sessionId) external view returns (bool);
}

// Events (immutable audit trail)
event AccessGranted(uint256 indexed tokenId, address indexed provider, bytes32 scope, uint256 expiry, bytes32 sessionId);
event AccessRevoked(uint256 indexed tokenId, bytes32 indexed sessionId);
event EmergencyAccessGranted(uint256 indexed tokenId, address provider1, address provider2, bytes32 facilityId, bytes32 sessionId);
event AccessExpired(bytes32 indexed sessionId);
```

**Modifiers:**
- `onlyTokenOwner(tokenId)` — only the patient (or their guardian)
- `onlyGuardian(tokenId)` — only assigned guardian(s)
- `requireDualAuth(provider1, provider2)` — both must be verified providers in the registry
- `requireRegisteredFacility(facilityId)` — facility must be in the network

### 4.4 EyeDSession.sol (Session Manager)

```solidity
struct Session {
    uint256 tokenId;          // patient identity
    address provider;         // who has access
    bytes32 scope;            // what records are visible
    uint256 expiry;           // when access dies
    bytes32 pinHash;          // hash of one-time PIN
    uint8 accessCount;        // how many times accessed
    uint8 maxAccess;          // max allowed accesses
    bool revoked;             // manually killed
}
```

**Functions:**
- `createSession(scope, duration, pinHash)` → returns sessionId
- `validateSession(sessionId, pinProof)` → returns bool (checks expiry + pin + access count)
- `expireSession(sessionId)` → callable by anyone after expiry timestamp
- Auto-expiration enforced on every `validateSession` call

### 4.5 EyeDGuardian.sol (Guardian Management)

```solidity
enum GuardianType { PARENT, ORGANIZATION, CAREGIVER, EMERGENCY_CONTACT }

interface IEyeDGuardian {
    // Assign a guardian to a patient's token
    function assignGuardian(
        uint256 tokenId,
        address guardian,
        GuardianType guardianType
    ) external;

    // Remove a guardian
    function removeGuardian(uint256 tokenId, address guardian) external;

    // Transfer ownership when child comes of age
    // Called by the child after performing their own eye scan enrollment
    function transferToSelf(uint256 childTokenId, bytes32 newIdentityProof) external;

    // Get all guardians for a token
    function getGuardians(uint256 tokenId) external view returns (Guardian[] memory);
}
```

**Rules:**
- `PARENT` guardian: full control, can modify records, share, manage
- `ORGANIZATION` guardian (UNHCR, foster agency): requires 2-of-N multi-sig for any modification
- `CAREGIVER` guardian: can view and share, cannot delete
- `EMERGENCY_CONTACT` guardian: can participate in recovery only
- All guardianship changes are logged as events (immutable history of who had control)
- `transferToSelf` can only be called by the child's own newly-enrolled identity (verified via ZK proof)

### 4.6 EyeDAudit.sol (Audit Trail)

Gas-efficient event-only pattern — no state storage for individual audits, just indexed event emissions:

```solidity
event RecordAccessed(
    uint256 indexed tokenId,
    address indexed provider,
    bytes32 indexed sessionId,
    bytes32 scope,
    bytes32 facilityId,
    uint256 timestamp
);

event RecordModified(
    uint256 indexed tokenId,
    address indexed provider,
    bytes32 recordHash,
    uint256 timestamp
);

event EmergencyOverride(
    uint256 indexed tokenId,
    address provider1,
    address provider2,
    bytes32 facilityId,
    uint256 timestamp
);
```

Queryable by tokenId, provider, or timestamp range using standard event log filtering.

### 4.7 EyeDVerifier.sol (ZK Proof Verifier)

- Auto-generated from Circom circuit compilation
- Verifies Groth16 proofs on-chain
- Used for:
  - Identity verification (eye scan → ZK proof → on-chain match)
  - Selective disclosure proofs (prove a fact about records without revealing the records)
  - Biometric match proofs (prove "this eye matches the enrolled identity" without revealing the iris template)

### 4.8 Deployment & Upgrade Strategy

- **Proxy pattern:** OpenZeppelin UUPS (Universal Upgradeable Proxy Standard)
- **Admin:** 3-of-5 multi-sig wallet (Gnosis Safe)
- **Timelock:** 48-hour delay on all upgrades (visible to community)
- **All contracts:** Verified and open-sourced on BaseScan
- **Deployment tooling:** Hardhat + hardhat-deploy with deterministic addresses

---

## 5. Identity & Biometrics System

### 5.1 Eye Scan Pipeline

```
Step  Action                              Where it happens
────  ──────                              ────────────────
 1    Phone front camera activates        Device
 2    YOLOv3-tiny detects eye region      Device (ML model)
 3    Auto-focus + zoom to iris           Device (camera API)
 4    Capture 10-15 frames                Device
 5    ISO 29794-6 quality validation      Device (quality model)
 6    Best frame selected by score        Device
 7    Iris + periocular + sclera          Device (feature
      features extracted                  extraction model)
 8    Features → cryptographic template   Device (secure enclave)
 9    Template stored in secure enclave   Device ONLY
10    ZK proof generated from template    Device (snarkjs/WASM)
11    ZK proof submitted to chain         Blockchain
12    SBT minted                          Blockchain

      Biometric template NEVER leaves
      the device. Not to us, not to
      the chain, not to anyone.
```

### 5.2 Dark Iris Handling

Standard phone cameras struggle with dark irises (majority of target market population). Multi-modal approach:

| Biometric | Capture Method | Accuracy | Role |
|---|---|---|---|
| Iris pattern | Front camera, visible spectrum | 96.6% (visible light) | Primary |
| Periocular skin texture | Same camera, area around eye | Supplementary | Boosts accuracy |
| Sclera vein patterns | Same camera, white of eye | Supplementary | Unique even in dark eyes |
| Face + liveness | Depth sensor (where available) or 2D with liveness | 95-99% | Fallback |

Combined multi-modal accuracy target: **>99%**

Liveness checks: blink detection, head turn, random prompt ("look left"), screen reflection analysis.

### 5.3 Recovery Flow (Lost / New Phone)

1. User downloads app on any new phone
2. Scans eyes → app generates ZK proof from fresh scan
3. On-chain verifier confirms proof matches enrolled identity hash
4. SBT access restored to new device
5. Old device access automatically invalidated
6. Emergency contacts notified of device change
7. 24-hour cooldown on sensitive operations (prevents immediate misuse if stolen phone + eye spoofing)

### 5.4 Child & Infant Enrollment

| Age | Identity Method | Guardian | Notes |
|---|---|---|---|
| 0-12 months | Footprint biometric + parent link | Parent (PARENT type) | Iris not stable yet |
| 1-5 years | Iris scan (assisted by parent) | Parent (PARENT type) | Iris stable from age 1 |
| 6-15 years | Iris scan (self) | Parent (PARENT type) | Child can view own records |
| 16-18 | Iris scan (self) | Transition period | Auto-prompt to claim ownership |
| 18+ | Full self-ownership | None (or voluntary) | `transferToSelf()` called |

Unaccompanied minors: Guardian type = `ORGANIZATION`, requires 2-of-N multi-sig for any modification. Full audit trail of every organization that held guardianship.

---

## 6. Data Layer Architecture

### 6.1 Encryption Scheme

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Master Key (MK)                                 │
│  └── Stored in device secure enclave             │
│      (iOS Secure Enclave / Android StrongBox)    │
│      └── Never exportable                        │
│                                                  │
│  Key Encryption Key (KEK)                        │
│  └── Derived from MK via HKDF                    │
│      └── Used to wrap/unwrap DEKs                │
│                                                  │
│  Data Encryption Keys (DEKs)                     │
│  └── One unique DEK per record                   │
│      └── DEK encrypts record with AES-256-GCM    │
│      └── DEK wrapped by KEK, stored alongside    │
│          encrypted record on IPFS                │
│                                                  │
│  Sharing Key Exchange                            │
│  └── When granting access:                       │
│      └── Patient's app unwraps relevant DEKs     │
│      └── Re-wraps DEKs with provider's public    │
│          key using ECIES (secp256k1)             │
│      └── Wrapped DEKs stored in session on-chain │
│      └── Provider's decryption gateway unwraps   │
│          and decrypts in-memory                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 6.2 Storage Strategy

| Data Type | Storage | Cost | Persistence | Deletable? |
|---|---|---|---|---|
| Active medical records | IPFS via Pinata (encrypted) | $0.48/GB/year | While pinned | Yes (unpin → garbage collected) |
| Permanent archive | Arweave (encrypted) | ~$2.10/GB one-time | 200+ years | Crypto-shredded (destroy keys) |
| Emergency profile | NFC band (on-tag) | $0 (on device) | Until overwritten | Yes (re-provision band) |
| Audit logs | On-chain events | Gas fee per event | Permanent | No (immutable, but anonymized) |
| Biometric templates | Device secure enclave | $0 | Until device reset | Yes (user-initiated) |
| Session metadata | Redis (cache) | Included in infra | Session duration only | Auto-expires |
| User preferences | PostgreSQL (metadata) | Included in infra | While account active | Yes (account deletion) |

### 6.3 FHIR R4 Data Model

| FHIR Resource | EyeD Usage | Fields Captured |
|---|---|---|
| Patient | Demographics, identifiers | Name, DOB, gender, language, contact |
| AllergyIntolerance | Allergies | Substance, reaction, severity, onset |
| Condition | Diagnoses | Code, status, onset, severity |
| MedicationStatement | Current medications | Medication, dosage, frequency, prescriber |
| Observation | Vitals, lab results | Type, value, units, date, performer |
| Procedure | Surgical history | Code, date, outcome, performer, facility |
| Immunization | Vaccinations | Vaccine, date, lot, site, administrator |
| DocumentReference | Imaging, PDFs, scans | Type, date, content (binary reference to IPFS) |
| DiagnosticReport | Lab panels, radiology | Code, results, conclusion, performer |

All records stored internally as FHIR R4 JSON, encrypted, on IPFS. FHIR format ensures interoperability with any EMR system that supports the standard.

### 6.4 Data Deletion (GDPR/PDPA Compliance)

1. Patient requests deletion via app
2. All IPFS records unpinned → garbage collected (data disappears from network)
3. All Arweave records: encryption keys destroyed → data is cryptographically irretrievable (bytes persist on Arweave but are meaningless without keys)
4. On-chain SBT is burned
5. Audit trail remains on-chain but is anonymized (hash references only, no PII)
6. PostgreSQL metadata purged
7. Redis sessions expired
8. Confirmation sent to patient

---

## 7. NFC Band System

### 7.1 Hardware Specification

| Property | Specification |
|---|---|
| Chip | NXP NTAG216 |
| Frequency | 13.56 MHz (ISO 14443A, NFC Forum Type 2) |
| Storage | 888 bytes |
| Material | Medical-grade silicone, hypoallergenic |
| Sizes | Adult (adjustable), Child (smaller), Pendant/Keychain (elderly) |
| Waterproof | IP68 |
| Lifespan | 20+ years (no battery) |
| Engraving | ⚕ symbol + "SCAN FOR MEDICAL INFO" in EN/AR/ZH/ES/FR/HI |

### 7.2 Data Layout (888 bytes)

```
Offset  Size    Field
──────  ────    ─────
0x00    4B      Header (protocol version + flags)
0x04    32B     Patient ID hash (links to on-chain SBT)
0x24    1B      Blood type (encoded enum: 0=O-, 1=O+, ... 7=AB+)
0x25    64B     Allergies (up to 8, compressed encoding)
0x65    128B    Medications (up to 10, compressed encoding)
0xE5    64B     Conditions (up to 8, compressed encoding)
0x125   256B    Emergency contacts (up to 3: name + phone + relationship)
0x225   128B    Emergency access URL
0x2A5   64B     ECDSA signature (secp256k1, proves data authenticity)
0x2E5   4B      CRC32 checksum
0x2E9   143B    Reserved (future use)
────────────
Total:  888B
```

### 7.3 Provisioning Flow

1. Patient opens app → Settings → NFC Band
2. App compiles emergency profile from stored records
3. App compresses data to fit 888-byte layout
4. App generates ECDSA signature over the data
5. Patient taps phone to band
6. App writes NDEF record via NFC
7. Verification read-back confirms data integrity
8. Confirmation displayed
9. App prompts re-provisioning whenever records change ("Your medications changed. Tap your band to update.")

### 7.4 Emergency Reading Flow

1. Any NFC-enabled smartphone taps the band
2. Phone reads NDEF record
3. **If offline:** Phone displays basic medical info directly from tag data (parsed by browser from data URI)
4. **If online:** URL opens emergency profile webpage with richer display, multi-language support, and provider portal link
5. No app required on the reading side — it's just a URL
6. Footer link: "Healthcare provider? Tap here for full record access" (requires authentication)

---

## 8. Mobile App Architecture

### 8.1 Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Framework | React Native + Expo (SDK 52+) | Cross-platform iOS + Android |
| State | Zustand | Lightweight, performant state management |
| Navigation | React Navigation v7 | Screen routing |
| Camera/Biometrics | react-native-vision-camera + custom YOLO model | Eye detection + iris capture |
| Local Auth | expo-local-authentication | Fingerprint/FaceID for app unlock |
| Crypto | react-native-quick-crypto | AES-256-GCM, ECIES, ECDSA |
| Blockchain | wagmi + viem | Contract interaction, wallet management |
| NFC | react-native-nfc-manager | Band read/write |
| QR Generation | react-native-qrcode-svg | QR code rendering |
| QR Scanning | react-native-vision-camera | Camera-based QR reading |
| Secure Storage | expo-secure-store | Keys + biometric template reference |
| App Storage | react-native-mmkv | Fast local data |
| Push | expo-notifications + FCM/APNs | Alerts |
| ZK Proofs | snarkjs (WASM build) | On-device proof generation |

### 8.2 Screen Map

```
App
├── Onboarding
│   ├── WelcomeScreen (3-slide value prop)
│   ├── EyeScanSetup (camera permission → guided scan → enrollment)
│   ├── EmergencyProfileSetup (blood type, allergies, meds, conditions)
│   ├── EmergencyContactSetup (add 2 contacts)
│   ├── MedicalIDSync (auto-populate iOS/Android Medical ID)
│   └── NFCBandSetup (optional — "Tap your band to activate")
│
├── Home (Tab Navigator)
│   ├── Dashboard
│   │   ├── Health summary card
│   │   ├── Recent access log (who viewed your records)
│   │   ├── Quick share button (→ QR generation)
│   │   ├── Emergency profile status badge
│   │   └── NFC band sync status
│   │
│   ├── Records
│   │   ├── RecordList (by category: allergies, meds, conditions, labs, imaging, procedures)
│   │   ├── RecordDetail
│   │   ├── AddRecord (manual entry form)
│   │   ├── ScanDocument (camera → OCR → structured data)
│   │   └── ImportFromProvider (FHIR connection flow)
│   │
│   ├── Share
│   │   ├── GenerateQR (select scope → set duration → QR + PIN displayed)
│   │   ├── ActiveShares (list of live sessions with countdown timers)
│   │   └── RevokeShare (instant session kill)
│   │
│   ├── Emergency
│   │   ├── EmergencyProfileEditor
│   │   ├── EmergencyContacts
│   │   ├── NFCBandProvisioning
│   │   ├── EmergencyTierConfig (what EMTs see vs. doctors)
│   │   └── EmergencyIrisSettings (opt in/out of passive iris access)
│   │
│   └── Family (Premium/Family tier)
│       ├── FamilyMemberList
│       ├── AddDependent (child / elder / pet)
│       ├── CaregiverDashboard (meds, appointments across members)
│       ├── GuardianshipManager
│       └── MedicationReminders
│
└── Settings
    ├── Account (subscription management, plan upgrade)
    ├── Security (biometric settings, recovery setup, active devices)
    ├── Privacy (full audit log, data deletion request)
    ├── NFCBand (re-provision, read test)
    ├── Notifications (preferences)
    └── Language
```

### 8.3 Offline Capability

| Feature | Offline? | How |
|---|---|---|
| Emergency profile | Yes | Cached locally in MMKV |
| NFC band reading | Yes | Tag data parsed directly, no network |
| View own records | Yes | Records cached encrypted, decrypted on-device |
| QR sharing | Limited | Pre-generated QR codes work, but provider can't fetch records without internet |
| Record entry | Yes | Queued locally, syncs when online |
| Eye scan auth | Yes | Template in secure enclave, verified locally |

---

## 9. Provider Portal Architecture

### 9.1 Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server-rendered, fast |
| Styling | Tailwind CSS | Rapid UI development |
| Auth | Provider wallet signature verification | No traditional login — crypto-native |
| FHIR Client | fhir-kit-client | FHIR resource handling |
| QR Scanner | HTML5 Camera API | Browser-based scanning |
| NFC Reader | Web NFC API | Chrome/Edge on Android |
| Deployment | Vercel or Cloudflare Pages | Global edge, fast |

### 9.2 Features

- Scan QR code or NFC from patient
- Enter one-time PIN
- View authorized records in rendered, watermarked format
- No download capability (server-rendered, no right-click save, print-restricted via CSS)
- Add treatment records to patient's file (with consent flow)
- Session timer visible (countdown to access expiration)
- Emergency access workflow (dual-auth iris scan)
- FHIR integration panel (connect existing EMR for auto-sync)
- Patient lookup by facility-specific ID (for returning patients who previously shared)

### 9.3 Security Controls

- All patient data rendered server-side, streamed as HTML — no JSON payloads in browser
- Zero data stored in browser cache, localStorage, or IndexedDB
- Session watermarking: provider ID + timestamp + facility name on every view
- Auto-logout on tab close or 5 minutes of inactivity
- All actions logged to on-chain audit trail
- Rate limiting per provider per patient

---

## 10. Backend Services

### 10.1 API Gateway

| Property | Detail |
|---|---|
| Runtime | Node.js + Fastify |
| Auth | JWT + provider wallet ECDSA signature verification |
| Rate limiting | Per-provider, per-endpoint, sliding window |
| API versioning | `/v1/` prefix |
| Docs | OpenAPI 3.1 / Swagger UI |
| Deployment | Docker container on AWS ECS (me-south-1 Bahrain) |

**Key endpoints:**
- `POST /v1/session/create` — create new access session
- `POST /v1/session/validate` — validate QR + PIN
- `GET /v1/records/{sessionId}` — fetch authorized records (proxied through decryption gateway)
- `POST /v1/records/add` — provider adds treatment record
- `POST /v1/emergency/request` — initiate emergency access
- `GET /v1/audit/{tokenId}` — fetch access audit log
- `POST /v1/nfc/compile` — compile emergency profile for NFC provisioning

### 10.2 Decryption Gateway

| Property | Detail |
|---|---|
| Runtime | Cloudflare Workers (edge compute) |
| Locations | UAE, Singapore, Thailand, India, EU, US |
| Function | Session token + PIN → derive decryption key → fetch from IPFS → decrypt in-memory → stream to browser → discard |
| State | Completely stateless — nothing persisted after response |
| Security | TLS 1.3, certificate pinning, request signing |

### 10.3 FHIR Translation Service

- Converts between EyeD internal JSON format and FHIR R4 resources
- Handles import from hospital EMR (FHIR endpoint → EyeD encrypted storage)
- Handles export to hospital EMR (EyeD → FHIR response)
- Supports SMART on FHIR app launch protocol
- Deployed as standalone microservice (Node.js)

### 10.4 Notification Service

| Channel | Provider | Use Case |
|---|---|---|
| Push | Firebase/APNs | Record access alerts, session expiry, band update reminders |
| SMS | Twilio | Emergency contact notifications, OTP fallback |
| Email | SendGrid | Access reports, account alerts, marketing (opt-in) |
| Webhook | Custom | Provider integrations, EMR event triggers |

---

## 11. Security Architecture

### 11.1 Threat Model

| Threat | Probability | Impact | Mitigation |
|---|---|---|---|
| Unauthorized record access | Medium | Critical | Multi-factor: QR + PIN + time limit + on-chain verification |
| Biometric spoofing (photo/video) | Medium | Critical | Liveness detection (blink, head turn, screen reflection), multi-modal biometrics |
| NFC band cloning | Low | Medium | ECDSA signature verification; band only contains emergency info; full records require second factor |
| MITM on decryption gateway | Low | Critical | TLS 1.3 + certificate pinning in mobile app |
| Compromised phone | Medium | High | Biometric template in secure enclave (non-exportable), app data encrypted at rest |
| Rogue healthcare provider | Low | High | All access immutably logged, real-time patient alerts, instant revocation |
| Stolen NFC band | Medium | Low | Band contains pre-authorized emergency info only (patient chose what's on it); full records require eye scan + dual auth |
| Blockchain key compromise | Low | High | Social recovery via emergency contacts (2-of-3 Shamir's Secret Sharing) |
| Smart contract vulnerability | Low | Critical | Professional audit, formal verification, bug bounty, timelock upgrades |
| EyeD insider threat | Low | Critical | Zero-knowledge architecture — EyeD never has access to patient data or biometrics. We can't access what we don't have. |
| IPFS pinning failure | Low | Medium | Redundant pinning (multiple providers), Arweave permanent backup |
| Decryption gateway compromise | Low | Critical | Stateless design (no data persisted), edge isolation, request-scoped key derivation |

### 11.2 Encryption Standards

| Purpose | Standard | Notes |
|---|---|---|
| Data at rest | AES-256-GCM | Per-record unique DEK |
| Data in transit | TLS 1.3 | All API + gateway communication |
| Key exchange | ECIES (secp256k1) | Provider access key wrapping |
| Biometric storage | Hardware secure enclave | iOS Secure Enclave / Android StrongBox |
| NFC data signing | ECDSA (secp256k1) | Proves data authenticity |
| ZK proofs | Groth16 | via Circom/snarkjs |
| PIN/password | Argon2id | Memory-hard hashing |
| Key derivation | HKDF-SHA256 | Master key → KEK → DEK chain |

### 11.3 Compliance Targets

| Certification | Target Timeline | Purpose |
|---|---|---|
| UAE NESA guidelines | Phase 2 | National cybersecurity compliance |
| Singapore PDPA | Phase 3 | Data protection compliance |
| GDPR (EU) | Phase 3 | Data portability + right to delete |
| ISO 27001 | Phase 4 (Year 2) | Information security management |
| SOC 2 Type II | Phase 4 (Year 2) | Service organization controls |
| HIPAA (US) | Phase 5 (future) | US healthcare data compliance |

---

## 12. Emergency Access Protocol

### Tier 1 — NFC Band (instant, zero authentication)

```
Trigger:   Any smartphone taps the band
Requires:  Nothing (pre-authorized by patient at setup)
Reveals:   Blood type, allergies, medications, conditions, emergency contacts
Time:      3 seconds
Works:     Anywhere on earth, any smartphone, no internet required, patient unconscious
```

### Tier 2 — Phone Lock Screen Medical ID (instant, zero authentication)

```
Trigger:   Paramedic swipes phone → Emergency → Medical ID
Requires:  Patient's phone is accessible
Reveals:   Same as NFC band + link to full records
Time:      10 seconds
Works:     iOS and Android, auto-populated by EyeD app during onboarding
```

### Tier 3 — Emergency Iris Access (dual authorization)

```
Trigger:   Hospital needs full records, patient unable to consent
Requires:  1) Patient pre-authorized emergency iris access
           2) Two verified healthcare workers present
           3) Request from registered facility
Process:   Doctor scans patient's iris with hospital device
           Nurse provides own credential as witness
           Smart contract verifies all conditions
Reveals:   Complete medical history (time-limited: 4-12 hours)
Time:      2-5 minutes
Logged:    Immutably on-chain, patient + emergency contacts notified
```

### Tier 4 — Emergency Contact Cascade (last resort)

```
Trigger:   Iris unavailable (eye trauma) + no NFC band + no phone
Requires:  Emergency contacts reachable
Process:   Step 1: Hospital contacts emergency contacts from any available ID
           Step 2: Contacts hold recovery keys (Shamir 2-of-3)
           Step 3: Two contacts reconstruct access
           Step 4: If no contacts reachable (1hr timeout):
                   → Consortium of 3+ verified hospitals vote
                   → Supermajority required
           Step 5: If no identity match at all:
                   → Temporary record created
                   → Mergeable when identity confirmed later
Reveals:   Full records
Time:      10 minutes to 1+ hours depending on step
Logged:    Everything, challengeable after the fact
```

---

## 13. Compliance & Legal

### 13.1 Regulatory Strategy by Jurisdiction

| Jurisdiction | Key Regulation | Compliance Approach | Entity Structure |
|---|---|---|---|
| **UAE** | VARA (crypto) + NESA (cybersecurity) + DHA (health) | VARA token registration, NESA guidelines, DHA data processing approval | Free zone entity (DIFC or ADGM) |
| **Singapore** | PDPA + MAS (crypto licensing) | PDPA data protection, MAS payment token exemption | Subsidiary |
| **Switzerland** | FINMA + FADP | FINMA no-action letter for utility token, FADP privacy compliance | Optional subsidiary in Zug |
| **EU** | GDPR + MiCA | Off-chain deletion model for GDPR, MiCA utility token registration | Assess per-country |
| **India** | DPDPA + SEBI (crypto guidelines) | DPDPA compliance, local data residency | Partnership model |
| **US (future)** | HIPAA + SEC (token) | HIPAA hybrid architecture, utility token opinion | Defer until regulatory clarity |

### 13.2 Corporate Structure

```
EyeD Holdings Ltd (UAE — DIFC or ADGM)
├── EyeD Technology FZE (UAE — DMCC or Meydan)
│   └── Core platform development + operations
├── EyeD Singapore Pte. Ltd. (future — Phase 4)
│   └── APAC expansion
└── EyeD Foundation (Swiss or Cayman — future)
    └── Token governance + open-source protocol stewardship
```

### 13.3 Key Legal Workstreams

1. **Token classification opinion** — engage UAE/Singapore crypto counsel to confirm utility token status (not a security)
2. **Healthcare data processing agreements** — template for provider partnerships
3. **Patient consent framework** — multi-jurisdictional, informed consent for data storage and emergency access
4. **NFC band regulatory classification** — confirm it's NOT a medical device (it stores data, doesn't diagnose or treat)
5. **Emergency access liability** — legal framework protecting providers who use emergency access in good faith
6. **Cross-border data transfer** — standard contractual clauses for data flowing between jurisdictions
7. **Research data marketplace** — anonymization standards, consent language, pharma partnership terms
8. **Terms of service + privacy policy** — patient-facing, provider-facing, in all target languages
9. **IP protection** — patent applications for novel system architecture where applicable

---

## 14. Infrastructure & DevOps

### 14.1 Cloud Architecture

| Component | Provider | Region | Purpose |
|---|---|---|---|
| API Gateway + Backend | AWS ECS (or GCP Cloud Run) | me-south-1 (Bahrain) | Primary compute |
| Decryption Gateway | Cloudflare Workers | Global edge (UAE, SG, TH, IN, EU) | Low-latency decryption |
| Database (metadata) | AWS RDS PostgreSQL | me-south-1 | User prefs, provider registry |
| Cache | AWS ElastiCache Redis | me-south-1 | Session cache |
| IPFS Pinning | Pinata (dedicated gateway) | Global | Encrypted record storage |
| Blockchain RPC | Alchemy or Infura | Base mainnet | Contract interaction |
| CDN | Cloudflare | Global | Provider portal + static assets |
| Secrets | AWS Secrets Manager | me-south-1 | API keys, signing keys |
| Monitoring | Datadog | N/A | Metrics, logs, traces |
| Alerting | PagerDuty | N/A | On-call incident management |

### 14.2 Repository Structure (Monorepo)

```
eyed/
├── apps/
│   ├── mobile/                 ← React Native / Expo app
│   ├── provider-portal/        ← Next.js provider portal
│   └── admin/                  ← Internal admin dashboard
├── packages/
│   ├── contracts/              ← Solidity smart contracts + tests
│   ├── sdk/                    ← TypeScript SDK for contract interaction
│   ├── fhir/                   ← FHIR R4 resource definitions + helpers
│   ├── crypto/                 ← Shared encryption utilities
│   ├── nfc/                    ← NFC data encoding/decoding
│   └── zk-circuits/            ← Circom circuits + snarkjs helpers
├── services/
│   ├── api-gateway/            ← Fastify API server
│   ├── decryption-gateway/     ← Cloudflare Worker
│   ├── fhir-service/           ← FHIR translation microservice
│   └── notification-service/   ← Push/SMS/email service
├── infrastructure/
│   ├── terraform/              ← IaC for AWS/Cloudflare
│   ├── docker/                 ← Dockerfiles
│   └── k8s/                    ← Kubernetes manifests (if needed)
├── docs/
│   ├── architecture/           ← ADRs, system design docs
│   ├── api/                    ← OpenAPI specs
│   └── guides/                 ← Integration guides for providers
├── .github/
│   └── workflows/              ← CI/CD pipelines
├── package.json                ← Workspace root (pnpm)
├── turbo.json                  ← Turborepo configuration
└── PROJECT_PLAN.md             ← This document
```

**Tooling:** pnpm workspaces + Turborepo for monorepo management.

### 14.3 CI/CD Pipeline

```
PR opened
  ├── Lint (ESLint, Solhint)
  ├── Type check (TypeScript)
  ├── Unit tests (Jest, Hardhat)
  ├── Contract tests (Foundry fuzz)
  ├── E2E tests (Playwright for portal, Detox for mobile)
  └── Security scan (Snyk, Slither for contracts)

Merge to develop
  └── Auto-deploy to staging environment

Promote to production (manual approval)
  ├── Deploy services to AWS ECS
  ├── Deploy portal to Vercel/Cloudflare
  ├── Deploy workers to Cloudflare
  └── Contract deployment (separate flow — Hardhat + multi-sig)

Contract deployment (separate)
  ├── Deploy to Base testnet → integration tests
  ├── Multi-sig approval (3-of-5)
  ├── 48-hour timelock
  └── Deploy to Base mainnet
```

---

## 15. Testing Strategy

### 15.1 Smart Contracts

| Type | Tool | Target |
|---|---|---|
| Unit tests | Hardhat + Chai | 100% branch coverage |
| Fuzz testing | Foundry | Access control, session logic |
| Formal verification | Certora or Halmos | Critical access control paths |
| Security audit | Trail of Bits / OpenZeppelin / Consensys Diligence | Full audit before mainnet |
| Bug bounty | Immunefi | Post-launch, ongoing |

### 15.2 Mobile App

| Type | Tool | Focus |
|---|---|---|
| Unit tests | Jest + React Native Testing Library | Business logic, crypto utils |
| E2E tests | Detox | Full user flows on device |
| Biometric testing | Physical device matrix | Various eye colors, skin tones, lighting |
| NFC testing | Physical tags + multiple phone models | Read/write reliability |
| Accessibility | VoiceOver (iOS) + TalkBack (Android) | Screen reader compatibility |
| Performance | React Native Performance Monitor | App startup < 2s, scan < 3s |

### 15.3 Backend

| Type | Tool | Target |
|---|---|---|
| Unit tests | Vitest | All service functions |
| API tests | Supertest + OpenAPI validation | All endpoints |
| Load tests | k6 | 10K concurrent sessions |
| Penetration test | Professional firm | Before launch |
| FHIR conformance | HL7 FHIR Validator | Resource validation |

### 15.4 Provider Portal

| Type | Tool | Target |
|---|---|---|
| E2E tests | Playwright | Full provider flows |
| Cross-browser | Chrome, Safari, Firefox, Edge | All major browsers |
| Mobile browser | iOS Safari, Android Chrome | Responsive views |
| QR scanning | Various lighting/screen sizes | Reliable scanning |
| NFC reading | Web NFC API (Chrome Android) | Band reading flow |

---

## 16. Phased Roadmap

### Phase 0: Foundation (Months 1-2)

- [ ] Corporate entity setup (UAE free zone)
- [ ] Legal counsel engagement (crypto + healthcare)
- [ ] Core team hiring (6-8 people)
- [ ] Architecture finalization + ADRs written
- [ ] Monorepo setup (pnpm + Turborepo + CI/CD)
- [ ] Design system + brand identity (logo, colors, typography)
- [ ] Smart contract development begins
- [ ] Base testnet deployment environment
- [ ] Iris detection ML model research + prototyping

### Phase 1: MVP (Months 3-5)

- [ ] Smart contracts deployed to Base testnet
- [ ] Mobile app core: eye scan enrollment + manual record entry + QR sharing
- [ ] NFC band provisioning and reading
- [ ] Phone Medical ID auto-population (iOS + Android)
- [ ] Basic provider portal (scan QR → enter PIN → view records)
- [ ] Emergency profile (NFC band + lock screen Medical ID)
- [ ] Decryption gateway (Cloudflare Workers)
- [ ] Internal testing + security review
- [ ] First NFC band prototype manufactured

### Phase 2: Closed Beta (Months 6-8)

- [ ] Smart contract security audit (professional firm)
- [ ] Smart contracts deployed to Base mainnet
- [ ] Invite-only beta (100-500 users)
- [ ] Partner with 2-3 clinics in UAE for pilot
- [ ] FHIR integration development (import/export)
- [ ] Zero-knowledge proof system (Circom circuits + verifier)
- [ ] Provider portal full build (treatment records, FHIR, emergency)
- [ ] NFC band manufacturing run (1,000 units)
- [ ] Bug bounty program launch (Immunefi)
- [ ] App Store / Google Play beta submission

### Phase 3: Public Launch (Months 9-12)

- [ ] App Store / Google Play public launch (UAE, Singapore)
- [ ] Premium / Family / Travel tier billing activation
- [ ] First hospital network partnership signed
- [ ] Medical tourism corridor pilot (UAE ↔ India or UAE ↔ Thailand)
- [ ] Provider SaaS billing activated
- [ ] Marketing campaign launch
- [ ] NFC band fulfillment pipeline operational
- [ ] Multi-language support (EN, AR, ZH, HI, TH, FR)
- [ ] **Target: 10,000 users**

### Phase 4: Scale (Months 13-18)

- [ ] Expand to 3-5 additional countries
- [ ] National health system pilot negotiation (UAE or Singapore)
- [ ] Research data marketplace beta
- [ ] Enterprise provider tier
- [ ] Ambulance / emergency services integration pilot
- [ ] Polygon PoS secondary chain deployment (India/SEA)
- [ ] ISO 27001 certification process
- [ ] Series A fundraising ($10-20M target)
- [ ] **Target: 100,000 users**

### Phase 5: Ecosystem (Months 19-24)

- [ ] Government contract signed (national health system)
- [ ] NGO partnerships (UNHCR, Red Cross) — humanitarian deployment
- [ ] Insurance company integration
- [ ] Pharmacy integration (medication verification)
- [ ] Wearable device integration (Apple Watch, Fitbit → auto-update records)
- [ ] Research data marketplace full launch
- [ ] SOC 2 Type II certification
- [ ] **Target: 1,000,000 users**

---

## 17. Team Requirements

### Phase 0-1 (Founding: 6-8 people)

| Role | Focus | Key Skills |
|---|---|---|
| CEO / Product Lead | Vision, fundraising, partnerships | Healthcare + crypto experience |
| CTO | Architecture, security, blockchain | Systems design, cryptography |
| Solidity Developer | Smart contracts | Solidity, Hardhat, Foundry, security |
| Mobile Developer | React Native app | RN/Expo, biometrics, camera APIs |
| Backend Developer | APIs, services | Node.js, Fastify, FHIR, cloud |
| UI/UX Designer | App + portal design | Health app UX, Arabic/multilingual |
| Healthcare Domain Expert | Clinical workflows, regulatory | FHIR, clinical experience |
| Legal Counsel (contract) | Crypto + healthcare law | UAE regulation, token classification |

### Phase 2-3 (Scale to 15-20, add:)

- 2nd Mobile Developer
- 2nd Solidity Developer
- Frontend Developer (Next.js — provider portal)
- DevOps / Infrastructure Engineer
- QA Engineer
- Product Manager
- Marketing / Growth Lead
- Business Development (hospital partnerships)
- Compliance / Regulatory Specialist
- Customer Support Lead

### Phase 4-5 (Scale to 30+, add:)

- Data Engineer (research marketplace pipeline)
- ML Engineer (iris model improvement + multi-modal accuracy)
- Security Engineer (dedicated)
- Regional BD leads (per target market)
- Operations Manager (NFC band supply chain)
- Finance / Controller

---

## 18. Complete Technology Stack

| Layer | Technology | Purpose | Alternative Considered |
|---|---|---|---|
| **Mobile** | React Native + Expo (SDK 52+) | Cross-platform app | Flutter (less crypto library support) |
| | Zustand | State management | Redux (heavier) |
| | react-native-vision-camera | Camera + ML model inference | expo-camera (less capable) |
| | wagmi + viem | Blockchain interaction | ethers.js (larger bundle) |
| | react-native-nfc-manager | NFC read/write | No viable alternative |
| | react-native-quick-crypto | AES, ECIES, ECDSA | crypto-browserify (slower) |
| | snarkjs (WASM) | On-device ZK proofs | No viable alternative for mobile |
| | expo-secure-store | Key storage | react-native-keychain |
| | react-native-mmkv | Fast local storage | AsyncStorage (slower) |
| **Blockchain** | Base (Ethereum L2) | Primary chain | Polygon PoS (higher fees), Arbitrum (higher fees) |
| | Solidity 0.8.x | Smart contract language | Vyper (smaller ecosystem) |
| | OpenZeppelin Contracts | Battle-tested base contracts | Custom (risky) |
| | Hardhat | Development + deployment | Truffle (deprecated) |
| | Foundry | Fuzz testing + gas optimization | Hardhat alone (less capable fuzz) |
| | ERC-5192 | Soulbound token standard | ERC-5484 (more complex) |
| | ERC-4337 | Account abstraction (gasless UX) | Meta-transactions (older pattern) |
| **ZK Proofs** | Circom | Circuit design | Noir (newer, less tooling) |
| | snarkjs | Proof generation + verification | rapidsnark (C++, harder to deploy) |
| | Groth16 | Proving system | PLONK (no trusted setup, but larger proofs) |
| **Backend** | Node.js + Fastify | API gateway | Express (slower), Go (smaller team familiarity) |
| | Cloudflare Workers | Decryption gateway (edge) | AWS Lambda@Edge (higher latency) |
| | PostgreSQL | Metadata store | MongoDB (less relational integrity) |
| | Redis | Session cache | Memcached (fewer features) |
| **Storage** | IPFS via Pinata | Active encrypted records | Filecoin (more complex), S3 (centralized) |
| | Arweave | Permanent archive | Filecoin (not truly permanent) |
| | AES-256-GCM | Record encryption | ChaCha20 (comparable, less hardware support) |
| | ECIES (secp256k1) | Key exchange for sharing | RSA (larger keys, slower) |
| **Portal** | Next.js 15 (App Router) | Provider portal | Remix (smaller ecosystem) |
| | Tailwind CSS | Styling | Chakra UI (heavier) |
| | Web NFC API | Browser NFC reading | No alternative |
| **Data Format** | FHIR R4 | Medical record interoperability | HL7 v2 (legacy), custom (non-standard) |
| | fhir-kit-client | FHIR resource handling | hapi-fhir (Java) |
| **Identity** | ERC-5192 | Soulbound token | Custom NFT (non-standard) |
| | YOLOv3-tiny | Eye region detection | MediaPipe (alternative, heavier) |
| | ISO 29794-6 | Iris image quality standard | Custom quality scoring |
| **NFC** | NXP NTAG216 | Band chip | NTAG213 (less storage: 144 vs 888 bytes) |
| | NDEF | Data format on tag | Custom binary (less compatible) |
| **Infrastructure** | AWS (me-south-1) | Primary cloud | GCP (less ME presence), Azure |
| | Cloudflare | CDN + Workers | AWS CloudFront (no Workers equivalent) |
| | GitHub Actions | CI/CD | GitLab CI (less ecosystem integration) |
| | Docker | Containerization | N/A |
| | pnpm + Turborepo | Monorepo management | Nx (heavier), yarn workspaces |
| **Monitoring** | Datadog | Metrics, logs, APM | Grafana Cloud (self-managed) |
| | PagerDuty | Incident alerting | Opsgenie (comparable) |
| | Immunefi | Bug bounty platform | HackerOne (less crypto-native) |

---

## 19. Risk Assessment

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Hospital adoption resistance | High | High | NFC/QR requires zero hospital-side setup. Position as complementary to existing EMR, not a replacement. |
| 2 | Regulatory changes in target markets | Medium | High | Multi-jurisdiction strategy. Don't depend on a single country. Legal counsel on retainer. |
| 3 | Biometric accuracy with dark irises | Medium | Medium | Multi-modal approach (iris + periocular + sclera + face fallback). Continuous model improvement. |
| 4 | NFC band supply chain disruption | Low | Medium | Multiple suppliers (China factories). Maintain 3-month inventory buffer. |
| 5 | Smart contract vulnerability | Low | Critical | Professional audit before mainnet. Formal verification on access control. Bug bounty. Timelock upgrades. |
| 6 | Key management / user loses keys | Medium | High | Eye scan recovery (the whole point). Shamir's Secret Sharing backup. Social recovery via contacts. |
| 7 | Incumbent EMR lobbying (Epic/Cerner) | Medium | High | FHIR is an open standard they must support by regulation. Position as complementary layer. Build provider demand from patients. |
| 8 | Token speculation distorting utility | Medium | Medium | Utility-first tokenomics. No speculative marketing. Token only used for access fees and gas abstraction. |
| 9 | Cold start problem (need patients AND hospitals) | High | High | Start with medical tourism corridors (patients already motivated). NFC band as zero-friction entry. Partner with 2-3 clinics first. |
| 10 | Decryption gateway compromise | Low | Critical | Stateless design, edge isolation, request-scoped key derivation, no data persistence, TLS 1.3 + cert pinning. |
| 11 | IPFS pinning service discontinuation | Low | Medium | Redundant pinning across providers. Arweave permanent backup. Migration plan documented. |
| 12 | Team key-person risk | Medium | High | Document all architecture decisions (ADRs). No single points of knowledge. Open-source core contracts. |
| 13 | Competitor with larger funding | Medium | Medium | First-mover in encrypted-barcode UX + humanitarian focus. Network effects from provider adoption. |
| 14 | Cultural/religious resistance to biometric scanning | Medium | Medium | Biometric is optional (NFC band works without it). Eye scan data never stored centrally. Respect opt-out. |
| 15 | Cross-border data sovereignty conflicts | Medium | High | Hybrid architecture: on-chain data is borderless (public blockchain), off-chain data respects local residency via regional IPFS gateways. |

---

## 20. Success Metrics

### Year 1

| Metric | Target |
|---|---|
| Total users | 10,000+ |
| Provider partners | 10+ |
| Countries live | 2 |
| Emergency profiles created | 5,000+ |
| Records shared via QR | 50,000+ |
| Security incidents | 0 |
| Smart contract audit | Completed |
| NFC bands distributed | 3,000+ |

### Year 2

| Metric | Target |
|---|---|
| Total users | 100,000+ |
| Provider partners | 50+ |
| Countries live | 5 |
| First government pilot | Signed |
| First NGO partnership | Signed |
| Annual recurring revenue | $25M+ |
| ISO 27001 | Certified |
| Freemium conversion rate | 5-8% |

### Year 3

| Metric | Target |
|---|---|
| Total users | 1,000,000+ |
| Provider partners | 200+ |
| Countries live | 10+ |
| Research marketplace | Active |
| Annual recurring revenue | $85M+ |
| Lives documented saved | At least 1 |

---

## 21. Budget Estimate

### Phase 0-1: Foundation + MVP (Months 1-5)

| Category | Cost |
|---|---|
| Team salaries (6-8 people x 5 months) | $300K-$500K |
| Legal / corporate setup | $50K-$100K |
| Smart contract audit | $50K-$100K |
| NFC band prototyping | $5K |
| Cloud infrastructure | $10K |
| Design / branding | $20K-$30K |
| ML model development (iris) | $20K |
| Miscellaneous | $50K |
| **Subtotal** | **$505K-$815K** |

### Phase 2-3: Beta + Launch (Months 6-12)

| Category | Cost |
|---|---|
| Team salaries (15 people x 7 months) | $900K-$1.5M |
| Marketing launch | $200K-$400K |
| NFC band manufacturing (5,000 units) | $10K |
| Cloud infrastructure | $50K |
| Hospital partnership development | $100K |
| Compliance / certifications | $100K |
| App Store fees + tooling | $20K |
| Miscellaneous | $100K |
| **Subtotal** | **$1.48M-$2.28M** |

### Phase 4-5: Scale + Ecosystem (Months 13-24)

| Category | Cost |
|---|---|
| Team salaries (30 people x 12 months) | $2M-$3M |
| Marketing / growth | $500K-$1M |
| NFC band manufacturing (100K units) | $100K |
| Infrastructure scaling | $200K |
| International expansion (offices, local ops) | $200K-$500K |
| ISO 27001 + SOC 2 certification | $150K |
| Miscellaneous | $200K |
| **Subtotal** | **$3.35M-$5.15M** |

### Total: Seed Through Series A

| Phase | Timeline | Budget |
|---|---|---|
| Phase 0-1 | Months 1-5 | $500K-$815K |
| Phase 2-3 | Months 6-12 | $1.5M-$2.3M |
| Phase 4-5 | Months 13-24 | $3.4M-$5.2M |
| **Total** | **24 months** | **$5.4M-$8.3M** |

Seed round target: **$2-3M** (covers through Phase 2)
Series A target: **$10-20M** (covers Phase 3-5 + runway)

---

## 22. Architecture Decision Records (ADRs)

Decisions to document formally before build begins:

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Blockchain selection: Base as primary L2 | Proposed |
| ADR-002 | ERC-5192 for soulbound identity tokens | Proposed |
| ADR-003 | Hybrid storage: IPFS (active) + Arweave (archive) | Proposed |
| ADR-004 | Groth16 for ZK proofs (Circom + snarkjs) | Proposed |
| ADR-005 | React Native + Expo for mobile | Proposed |
| ADR-006 | Cloudflare Workers for decryption gateway | Proposed |
| ADR-007 | FHIR R4 as canonical data format | Proposed |
| ADR-008 | NTAG216 for NFC bands | Proposed |
| ADR-009 | Account abstraction (ERC-4337) for gasless UX | Proposed |
| ADR-010 | UUPS proxy pattern for contract upgradeability | Proposed |
| ADR-011 | Multi-sig (3-of-5) for contract admin | Proposed |
| ADR-012 | Argon2id for PIN hashing | Proposed |
| ADR-013 | pnpm + Turborepo monorepo structure | Proposed |
| ADR-014 | Guardian model: institutional 2-of-N for organizations | Proposed |

Each ADR to be written as a separate document in `docs/architecture/` before implementation of the relevant component begins.

---

*This is a living document. It will be updated as decisions are made, technology evolves, and the project progresses.*

*Last updated: March 2, 2026*

**EyeD — Your eyes. Your records. Your control.**
