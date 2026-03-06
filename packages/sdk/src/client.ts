import type { EyeDConfig, SessionParams, SessionResult } from './types.js';

/**
 * Create an EyeD SDK client for contract interaction.
 * Stub implementation — real contract calls added in Phase 2.
 */
export function createEyeDClient(_config: EyeDConfig) {
  return {
    /** Create a sharing session (Phase 2: on-chain) */
    async createSession(_params: SessionParams): Promise<SessionResult> {
      throw new Error('Not implemented — Phase 2');
    },

    /** Validate a session is active (Phase 2: on-chain) */
    async validateSession(_sessionId: string, _pin: string): Promise<boolean> {
      throw new Error('Not implemented — Phase 2');
    },

    /** Revoke an active session (Phase 2: on-chain) */
    async revokeSession(_sessionId: string): Promise<void> {
      throw new Error('Not implemented — Phase 2');
    },

    /** Get audit log for a token (Phase 2: on-chain events) */
    async getAuditLog(_tokenId: string): Promise<[]> {
      throw new Error('Not implemented — Phase 2');
    },
  };
}
