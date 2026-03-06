/** SDK configuration */
export interface EyeDConfig {
  /** RPC URL for Linea network */
  rpcUrl: string;
  /** Contract addresses */
  contracts: {
    identity: string;
    access: string;
    session: string;
    audit: string;
  };
}

/** Categories of records that can be shared */
export type AccessScope =
  | 'emergency'
  | 'allergies'
  | 'medications'
  | 'conditions'
  | 'labs'
  | 'imaging'
  | 'procedures'
  | 'immunizations'
  | 'full';

/** Parameters for creating a sharing session */
export interface SessionParams {
  /** Which record categories to share */
  scopes: AccessScope[];
  /** Session duration in seconds */
  duration: number;
  /** Hash of one-time PIN */
  pinHash: string;
}

/** Result of session creation */
export interface SessionResult {
  sessionId: string;
  expiresAt: number;
  qrData: string;
}

/** On-chain identity token info */
export interface IdentityToken {
  tokenId: string;
  identityHash: string;
  enrolledAt: number;
  guardian?: string;
}

/** Audit log entry */
export interface AuditEntry {
  tokenId: string;
  provider: string;
  sessionId: string;
  scope: string;
  timestamp: number;
  eventType: 'access' | 'modify' | 'emergency';
}
