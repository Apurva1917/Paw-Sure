/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { PawsureVerificationEngine } from '../verificationEngine';
import { CareTask, CareEvidence } from '../../types/pawsure';

describe('PawsureVerificationEngine (Non-Negotiable Rule 2)', () => {
  const baseTask: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
    category: 'walk',
    title: 'Morning Walk',
    evidence: []
  };

  it('evaluates task with no evidence as upcoming', () => {
    const result = PawsureVerificationEngine.evaluateTaskEvidence(baseTask, '4829');
    expect(result.status).toBe('upcoming');
    expect(result.qualifyingChannelsCount).toBe(0);
  });

  it('evaluates missed call alone as Not Confirmed (visit arrival only)', () => {
    const taskWithMissedCall: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
      ...baseTask,
      evidence: [
        {
          id: 'ev-call-1',
          type: 'missed_call',
          timestamp: '08:00 AM',
          isVisitProofOnly: true
        }
      ]
    };
    const result = PawsureVerificationEngine.evaluateTaskEvidence(taskWithMissedCall, '4829');
    expect(result.status).toBe('not_confirmed');
    expect(result.visitEvidencePresent).toBe(true);
    expect(result.taskEvidencePresent).toBe(false);
  });

  it('evaluates single task signal (e.g. photo alone) as Likely (1 channel)', () => {
    const taskWithPhoto: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
      ...baseTask,
      evidence: [
        {
          id: 'ev-photo-1',
          type: 'photo',
          url: 'https://example.com/photo.jpg',
          timestamp: '08:05 AM',
          isVisitProofOnly: false
        }
      ]
    };
    const result = PawsureVerificationEngine.evaluateTaskEvidence(taskWithPhoto, '4829');
    expect(result.status).toBe('likely');
    expect(result.qualifyingChannelsCount).toBe(1);
    expect(result.taskEvidencePresent).toBe(true);
  });

  it('evaluates single task signal (e.g. valid IVR code alone) as Likely', () => {
    const taskWithIvr: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
      ...baseTask,
      evidence: [
        {
          id: 'ev-ivr-1',
          type: 'ivr_keypad',
          enteredCode: '4829',
          timestamp: '08:10 AM',
          isVisitProofOnly: false
        }
      ]
    };
    const result = PawsureVerificationEngine.evaluateTaskEvidence(taskWithIvr, '4829');
    expect(result.status).toBe('likely');
    expect(result.qualifyingChannelsCount).toBe(1);
  });

  it('evaluates two independent qualifying channels (photo + arrival signal or photo + valid home code) as Confirmed', () => {
    const taskConfirmed: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
      ...baseTask,
      evidence: [
        {
          id: 'ev-gps-1',
          type: 'gps',
          timestamp: '07:30 AM',
          isVisitProofOnly: true
        },
        {
          id: 'ev-photo-1',
          type: 'photo',
          timestamp: '08:00 AM',
          isVisitProofOnly: false
        }
      ]
    };
    const result = PawsureVerificationEngine.evaluateTaskEvidence(taskConfirmed, '4829');
    expect(result.status).toBe('confirmed');
    expect(result.qualifyingChannelsCount).toBeGreaterThanOrEqual(2);
  });

  it('evaluates invalid passcode as Not Confirmed and flags contradiction', () => {
    const taskInvalidCode: Pick<CareTask, 'category' | 'title' | 'evidence'> = {
      ...baseTask,
      evidence: [
        {
          id: 'ev-ivr-wrong',
          type: 'ivr_keypad',
          enteredCode: '0000', // Invalid code
          timestamp: '08:15 AM'
        }
      ]
    };
    const result = PawsureVerificationEngine.evaluateTaskEvidence(taskInvalidCode, '4829');
    expect(result.status).toBe('not_confirmed');
    expect(result.hasInvalidCodeOrContradiction).toBe(true);
  });

  it('evaluates owner physical return match as Matched', () => {
    const result = PawsureVerificationEngine.evaluateTaskEvidence(baseTask, '4829', true);
    expect(result.status).toBe('matched');
  });
});
