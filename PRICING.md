# EyeD Pricing Model

## Overview

EyeD is a patient-owned medical records platform using eye-scan biometric identity, encrypted QR/PIN sharing, NFC wristbands, and blockchain-backed access control. Revenue comes from four streams: consumer subscriptions (B2C), healthcare provider SaaS (B2B), government/NGO contracts (B2G), and an anonymized research data marketplace (B2R).

---

## B2C: Patient Tiers

### Free Tier — $0 Forever

The free tier must be genuinely life-saving, not a crippled demo. If the free version doesn't protect someone in an emergency, the mission fails.

**Identity**

- Eye scan enrollment (iris + periocular + sclera)
- Soulbound token (SBT) minted on-chain
- Auto-populates phone's native Medical ID (iOS Health / Android Safety)

**Records**

- Store up to 50 medical records/documents
- Manual entry (allergies, medications, conditions, blood type)
- Up to 500MB encrypted storage

**Sharing**

- 5 QR + PIN shares per month
- Emergency profile always active
- Lock screen Medical ID always populated

**Emergency**

- Emergency contact designation (up to 2)
- Emergency iris access (dual healthcare worker authorization)
- Full audit log of who accessed your data

**Not Included**

- NFC band
- Family accounts
- Provider-uploaded records (FHIR integration)
- Multi-language emergency card
- Data marketplace participation
- Advanced analytics
- Priority support

---

### Premium Tier — $7.99/month or $69.99/year (save 27%)

**Everything in Free, plus:**

**Records**

- Unlimited record storage
- 5GB encrypted storage (imaging, PDFs, labs)
- Provider-uploaded records via FHIR
- Auto-import from connected hospitals
- Document scanning (photo to structured data)
- Medication reminder integration

**Sharing**

- Unlimited QR + PIN shares
- Persistent provider access (e.g., primary doctor gets ongoing read access)
- Time-boxed sharing presets (1 hour / 24 hours / 1 week / custom)
- Share-by-link for telehealth visits

**Emergency**

- NFC band included (shipped in welcome kit)
- Up to 5 emergency contacts
- Multi-language emergency card (PDF/printable)
- Emergency contact auto-notify on any record access
- Customizable emergency tiers (choose what EMTs see vs. doctors)

**Security**

- Advanced audit dashboard
- Real-time push notifications when anyone views records
- Instant session revocation controls
- Biometric change detection alerts

**Support**

- Priority support
- Guided onboarding for importing existing records

---

### Family Tier — $14.99/month or $129.99/year (up to 6 members)

**Everything in Premium, plus:**

**Family Management**

- Up to 6 linked profiles
- Child profiles (parent-managed, auto-transfers ownership at age 16-18)
- Elder profiles (caregiver-managed, with dignity controls — elder can override if capable)
- Pet profiles (veterinary records)

**NFC Bands**

- 3 NFC bands included (additional bands $3 each)
- Child-sized bands available
- Keychain/pendant form factor for elderly

**Family Features**

- Shared emergency contacts across all family members
- Caregiver dashboard (upcoming medications, appointments for all members)
- Family health timeline
- Dependent management with role-based permissions (modify vs. view)

**Storage**

- 20GB shared encrypted storage
- Family-wide FHIR integration

---

### Travel Tier — $19.99/month or $29.99 one-time trip pass (30 days)

**Everything in Premium, plus:**

**Travel-Specific**

- Pre-trip record preparation (compile and verify for destination hospital)
- Records translated into destination country's language
- Destination hospital pre-registration (send records ahead)
- Travel insurance integration
- In-country emergency number auto-configuration
- 24/7 emergency concierge relay service (multilingual staff communicates with foreign doctors)
- Post-trip record consolidation (merge foreign treatment into unified profile)

**Physical Kit**

- NFC band + NFC card (wallet-sized backup)
- Printed multi-language emergency card
- QR luggage tag (medical info travels with your bag)

---

## Regional Pricing

| Region                                | Premium               | Family                | Travel Pass |
| ------------------------------------- | --------------------- | --------------------- | ----------- |
| UAE / Singapore / Switzerland         | $7.99/mo              | $14.99/mo             | $29.99      |
| India / Thailand / Southeast Asia     | $2.99/mo              | $4.99/mo              | $9.99       |
| Sub-Saharan Africa / Refugee contexts | Free (NGO-subsidized) | Free (NGO-subsidized) | N/A         |

---

## B2B: Healthcare Provider Tiers

### Basic — $99/month

_Individual clinics / small practices_

- Up to 3 provider staff accounts
- Scan QR / NFC to view patient records
- Add treatment notes to patient records
- Up to 200 patient interactions/month (query-only — no Signal real-time monitoring)
- Browser-based (no install required)
- **Note:** Signal (RPM monitoring) requires Standard tier or above

### Standard — $499/month

_Hospitals / large practices_

- Up to 25 staff accounts
- Unlimited patient interactions
- **Signal real-time monitoring included** — enables RPM billing (CPT 99454/99457, ~$98.77/patient/month reimbursement)
- FHIR integration with existing EMR (Epic, Cerner, etc.)
- Auto-upload treatment records to patient's encrypted storage (with consent)
- Emergency dual-auth iris scanning station
- Analytics dashboard (anonymized patient flow, access patterns)
- Bulk NFC bands for patient distribution (at cost: $2/band)

### Enterprise — Custom ($2,000-$10,000/month)

_Hospital networks / national health systems_

- Unlimited staff, unlimited locations
- Full EMR integration + custom FHIR mapping
- Dedicated integration engineer
- White-label option (hospital's branding)
- API access for custom workflows
- SLA with uptime guarantees
- Ambulance / emergency services integration
- On-premise node option (data sovereignty)
- Compliance certification assistance (local regulations)

### Pay-Per-Use (Alternative)

_No monthly commitment_

- $1.50 per patient record access (scan + view)
- $0.50 per record write (adding treatment notes)
- Good for: small clinics, pharmacies, medical tourism facilitators
- Micro-transactions can be settled via utility token on-chain

---

## B2G: Government & NGO Contracts

### National Health System License

- Per-citizen pricing: $0.50-$2.00/citizen/year
- Example: 10M citizens = $5M-$20M/year recurring
- Includes: all citizen accounts, NFC bands for vulnerable populations, provider portal for all national facilities, integration with national health ID system

### Humanitarian / NGO Program

- Subsidized: $0.10-$0.25/person/year
- Includes: provisioning, NFC bands, staff training
- Funded by: UNHCR, Red Cross, WHO, Gates Foundation, bilateral aid budgets
- Example: 500,000 refugees at $0.25/person = $125K/year

### Medical Tourism Corridor Partnership

- Revenue share with tourism boards
- Co-branded with destination marketing
- Example: UAE to India corridor — 500K medical tourists/year x $5 trip fee = $2.5M/year from one corridor

---

## B2R: Anonymized Research Data Marketplace

### How It Works

1. Pharma/research company requests anonymized dataset (e.g., "10,000 Type 2 Diabetes patients aged 40-60 in GCC")
2. Platform identifies eligible patients
3. Each patient receives an explicit OPT-IN request
4. Patient consents (or declines) — fully voluntary
5. Data anonymized using zero-knowledge proofs (researchers get statistical patterns, never individual records)
6. Patient gets PAID for their contribution

### Revenue Split

- Pharma pays: $50-$500 per dataset (depending on size/specificity)
- Patient receives: 70% of payment
- Platform takes: 30% commission

### Why Pharma Pays

- Clinical trial recruitment currently costs $15,000-$40,000 per patient
- Anonymized real-world data at $50-$500/dataset is 100x cheaper
- Data is verified (on-chain provenance from real providers), not self-reported

### Eligibility

- Available to Premium and Family tier subscribers only (conversion incentive)

---

## NFC Band Economics

### Manufacturing Cost

| Order Volume  | Unit Cost |
| ------------- | --------- |
| 1,000 bands   | ~$2.10    |
| 10,000 bands  | ~$0.89    |
| 100,000 bands | ~$0.55    |

### Custom Medical-Grade Band Cost at Scale

- NFC chip (NTAG216): $0.30-$0.50
- Medical-grade silicone: $0.20-$0.40
- Custom engraving (medical symbol + multilingual text): $0.10-$0.20
- Packaging + QR setup card: $0.15-$0.25
- **Total at scale: $0.75-$1.35/band**

### Distribution Model

| Channel                  | Price to User              | Margin                                 |
| ------------------------ | -------------------------- | -------------------------------------- |
| Premium subscribers      | Free (included)            | Cost absorbed by subscription          |
| Family subscribers       | 3 free, additional $3 each | ~$2 margin per extra band              |
| Free tier users          | $5-$10 retail              | ~$4-$9 margin                          |
| Referral reward          | Free (refer 3 friends)     | Acquisition cost                       |
| Hospital partners (bulk) | $2-$3/band                 | $1-$2 margin                           |
| Vulnerable populations   | Free                       | Subsidized by NGO/government contracts |
| Emergency services stock | At cost                    | $0 margin (adoption driver)            |

At $1/band, giving away 100,000 bands to vulnerable populations costs $100K — a rounding error on humanitarian aid budgets.

---

## Conversion Triggers

### Free to Premium

- "You've used 5 of 5 shares this month"
- "A provider wants to upload your lab results — upgrade to receive them"
- "Your audit log shows 3 access events — upgrade for real-time alerts"
- "You're booking a trip — add travel protection for $29.99"

### Free to Family

- "Add your child's profile"
- "Your parent's doctor wants to share records with you as caregiver"
- "Manage medication reminders for family members"

### Premium to Travel

- "We see you have an appointment at Bangkok Hospital next month — prepare your records?"
- Medical tourism partner referral

### Any Tier to Data Marketplace

- "A research study matches your profile. Contribute anonymized data and earn $15. [Opt In] [No Thanks]"

---

## Revenue Projections

### Year 1 (Launch + Early Adoption)

| Stream                 | Revenue     |
| ---------------------- | ----------- |
| Consumer subscriptions | $2M         |
| Provider SaaS          | $200K       |
| Government contracts   | $500K       |
| Research marketplace   | $0          |
| NFC band margin        | $50K        |
| **Total**              | **~$2.75M** |

### Year 2 (Growth)

| Stream                 | Revenue     |
| ---------------------- | ----------- |
| Consumer subscriptions | $20M        |
| Provider SaaS          | $1.3M       |
| Government contracts   | $3.5M       |
| Research marketplace   | $100K       |
| NFC band margin        | $300K       |
| **Total**              | **~$25.2M** |

### Year 3 (Scale)

| Stream                 | Revenue   |
| ---------------------- | --------- |
| Consumer subscriptions | $60M      |
| Provider SaaS          | $8M       |
| Government contracts   | $15M      |
| Research marketplace   | $2M       |
| NFC band margin        | $1M       |
| **Total**              | **~$86M** |

### Assumptions

- 1M total users by end of Year 2
- 85% free / 10% premium / 4% family / 1% travel split
- 5% freemium-to-paid conversion rate (industry median for health apps: 3-5%)
- Health app median payer LTV: $16.44, upper quartile: $31.12
- Provider adoption driven by medical tourism corridor partnerships
- One national health system pilot contract by Year 2
- Research marketplace launches mid-Year 2

### Cost Structure (Year 2)

| Category                 | Annual Cost |
| ------------------------ | ----------- |
| NFC bands (150K shipped) | $150K       |
| Cloud / IPFS storage     | $200K       |
| Blockchain gas fees (L2) | $50K        |
| Team (30 people avg)     | $3M         |
| Marketing / acquisition  | $2M         |
| Legal / compliance       | $500K       |
| Office / operations      | $500K       |
| **Total**                | **~$6.4M**  |

**Gross Margin: ~75%**

---

## Key Metrics to Track

| Metric                           | Target                     |
| -------------------------------- | -------------------------- |
| Free-to-Premium conversion       | 5-8%                       |
| Monthly churn (Premium)          | <3%                        |
| Monthly churn (Family)           | <1.5%                      |
| NFC band activation rate         | >70%                       |
| Provider portal DAU/MAU          | >40%                       |
| Emergency access events/month    | Track for impact reporting |
| Avg records per user             | >10 (engagement indicator) |
| QR shares per premium user/month | >8                         |
| Research marketplace opt-in rate | >20% of eligible           |
| Net Promoter Score               | >50                        |

---

---

## Cost of Goods — Particle Health (Data Infrastructure)

Particle Health is our health record network provider. 320M+ patients, 160K+ organizations. These are our data costs.

> **Visual model:** See `particle-pricing-model.html` for interactive tabs with margin analysis, RPM ROI, and contract timeline.

### Compliant Billing Code Directory (verified June 2026)

**IMPORTANT:** MyPulseScan is the records + intelligence layer. RPM requires actual FDA-cleared devices at the patient's home (BP cuffs, glucometers, scales) that transmit daily. MyPulseScan identifies qualifying patients, provides clinical context for staff review, and supports audit documentation — but the device is the clinic's responsibility.

#### RPM — Remote Patient Monitoring (requires device at patient's home)

| CPT Code | Service                            | Frequency        | Payout | Compliance Rule                                |
| -------- | ---------------------------------- | ---------------- | ------ | ---------------------------------------------- |
| 99453    | Initial Setup & Education          | Once per episode | ~$20   | Staff trains patient on device use, documented |
| 99454    | Device Supply & Data Transmission  | Monthly          | ~$47   | Device transmits on 16+ days out of 30         |
| 99457    | RPM Management (First 20 min)      | Monthly          | ~$52   | 20 min staff time + interactive communication  |
| 99458    | RPM Management (Additional 20 min) | Monthly          | ~$43   | Billed if staff spends 40+ total minutes       |

**RPM Monthly Potential: $99–$142 per patient/month** (chronic patients with home devices)

#### BHI — Behavioral Health Integration (no device required)

| CPT Code | Service                     | Frequency | Payout | Compliance Rule                                                |
| -------- | --------------------------- | --------- | ------ | -------------------------------------------------------------- |
| 99484    | General BHI Care Management | Monthly   | ~$48   | 20 min/mo clinical staff time, validated rating scales (PHQ-9) |

#### CoCM — Psychiatric Collaborative Care Model (no device required)

| CPT Code | Service                    | Frequency | Payout | Compliance Rule                                              |
| -------- | -------------------------- | --------- | ------ | ------------------------------------------------------------ |
| 99492    | Initial CoCM Management    | Month 1   | ~$162  | 70 min first month: care tracking + psychiatric consultation |
| 99493    | Subsequent CoCM Management | Month 2+  | ~$131  | 60 min subsequent months                                     |
| 99494    | Additional CoCM Time       | Monthly   | ~$67   | Each additional 30 min of care manager time                  |

#### E/M Uplift (directly supported by Particle record retrieval)

| CPT Code | Service                | Without Records | With Records | Net Increase |
| -------- | ---------------------- | --------------- | ------------ | ------------ |
| 99204    | New Patient (Moderate) | 99203 = $128    | $167         | +$39         |
| 99205    | New Patient (High)     | 99203 = $128    | $237         | +$109        |

#### Other Billable Programs

| Program                 | Codes       | Monthly/Patient      | Particle Fit                                      |
| ----------------------- | ----------- | -------------------- | ------------------------------------------------- |
| CCM (Chronic Care Mgmt) | 99490       | ~$66                 | Records identify 2+ chronic conditions            |
| TCM (Transitional Care) | 99495/99496 | $201–$273/event      | Signal ADT alerts trigger post-discharge outreach |
| Risk Adjustment (HCC)   | —           | Increases capitation | Complete records surface missed diagnoses         |

### B2B Volume Pricing Tiers (per clinic)

| Tier       | Clinics | Base Fee/Clinic | Per Patient | Target                          |
| ---------- | ------- | --------------- | ----------- | ------------------------------- |
| Standard   | 1–10    | $499/mo         | $1.50/pt    | Pilot — prove ROI at one region |
| Growth     | 11–20   | $399/mo         | $1.25/pt    | Regional rollout                |
| Enterprise | 21+     | $299/mo         | $1.00/pt    | Full network deployment         |

**Cost guard:** One Particle query per unique patient per billing period — cached after first lookup. No double-billing on our side.

### Reimbursement Context (corrected June 2026)

Signal enables clinics to build compliant RPM programs alongside MyPulseScan record retrieval. The clinic provides the device, MyPulseScan provides the records + patient identification + clinical context. Combined with BHI, CoCM, CCM, TCM, and E/M uplift, a single chronic patient with behavioral health comorbidities can generate $190–$299+/month in legitimate recurring reimbursement. Our Particle cost is $1.00 PMPM at current tier.

### Signal — Real-Time Patient Monitoring (PMPM)

| Patient Roster | PMPM  | Minimum Annual | Notes                           |
| -------------- | ----- | -------------- | ------------------------------- |
| 5,000          | $1.00 | $60,000        | **Current commitment**          |
| 15,000         | $0.50 | $90,000        | Next tier — add Urology group   |
| 50,000         | $0.40 | $240,000       |                                 |
| 100,000        | $0.30 | $360,000       | Target — Urology + Primary Care |
| 500,000        | $0.20 | $1,200,000     | Enterprise scale                |
| 1,000,000      | $0.15 | $1,800,000     | National scale                  |

**Contract minimum:** $50,000/year. Current 5K × $1 = $60K (exceeds minimum).

### Workbench Gold — Per-Query Pricing (Flat JSON)

| Tier   | Annual Queries | Price Per Query | Annual Fee |
| ------ | -------------- | --------------- | ---------- |
| Tier 1 | 250,000        | $0.75           | $187,500   |
| Tier 2 | 600,000        | $0.65           | $390,000   |
| Tier 3 | 1,400,000      | $0.55           | $770,000   |
| Tier 4 | 5,000,000      | $0.45           | $2,250,000 |

### Margin Decision — Basic Tier ($99/mo) = Query-Only

**Problem identified:** At $99/mo with 200 patients on Signal ($1 PMPM), Particle cost would be $200/mo — a $101/mo loss per clinic.

**Decision: Option 1 (applied above)** — Basic tier provides query-only access (no Signal/RPM monitoring). Signal real-time monitoring requires Standard ($499/mo) or above. This preserves the $99 entry-level price point while keeping us margin-positive. Basic clinics use Workbench Gold per-query pricing as the COGS layer.

**Standard+ ROI for clinics:** At $499/mo + $1.50/patient, a clinic with 200 chronic patients generates $99–$142/patient/month in RPM reimbursement alone, plus $48/patient/month BHI for behavioral health patients, plus $39–$109 E/M uplift per visit. Total potential: $190–$299+/patient/month in new revenue vs $1.50/patient cost to us.

### Data Format Status

- **Flat JSON:** Available now (our integration is built for this)
- **FHIR R4:** Coming later in 2026 (additive — Flat stays stable)

### Pricing source

Received from Matt Davidson (Particle Health, Senior AE) on May 19, 2026. Contract minimum $50K/yr.

---

_Last updated: June 2, 2026_
_Project: EyeD — Your eyes. Your records. Your control._
