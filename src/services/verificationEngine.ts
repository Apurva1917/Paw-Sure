/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PAWSURE VERIFICATION ENGINE (PRD v1.3 Standard)
 * Non-Negotiable Rule 2:
 * Care task status is DERIVED from evidence, never a manually selected 'Completed' badge.
 * Distinguishes visit evidence from per-task evidence.
 * 
 * Rules:
 * - 2 independent qualifying channels (e.g. photo with current home code + qualifying arrival/exit call or gate entry) -> 'confirmed'
 * - 1 task-specific signal (photo, voice naming task, or IVR code after task prompt) -> 'likely'
 * - arrival/exit calls alone or missed call alone -> 'not_confirmed' (visit only)
 * - contradictions, invalid code, missing signal -> 'not_confirmed'
 * - owner return check match -> 'matched' (covered day, no points)
 * - Wrong code / contradiction CANNOT upgrade confidence.
 * - No perfect-verification claims.
 */

import { CareEvidence, VerificationStatus, CareTask } from '../types/pawsure';

export interface VerificationEvaluationResult {
  status: VerificationStatus;
  qualifyingChannelsCount: number;
  qualifyingChannels: string[];
  visitEvidencePresent: boolean;
  taskEvidencePresent: boolean;
  hasInvalidCodeOrContradiction: boolean;
  confidenceScore: number;
  rationale: string;
}

export class PawsureVerificationEngine {
  /**
   * Evaluates task status strictly based on immutable evidence array and current household security code.
   */
  public static evaluateTaskEvidence(
    task: Pick<CareTask, 'category' | 'title' | 'evidence'>,
    currentHouseholdCode = '4829',
    isOwnerReturnCheckMatched = false
  ): VerificationEvaluationResult {
    // Rule 5: Owner return check match -> Matched (covered day, no points)
    if (isOwnerReturnCheckMatched) {
      return {
        status: 'matched',
        qualifyingChannelsCount: 1,
        qualifyingChannels: ['owner_physical_return_check'],
        visitEvidencePresent: true,
        taskEvidencePresent: true,
        hasInvalidCodeOrContradiction: false,
        confidenceScore: 85,
        rationale: 'Physical inspection upon owner return verified day care. Status: Matched (no pilot points).'
      };
    }

    const evidenceList = task.evidence || [];
    if (evidenceList.length === 0) {
      return {
        status: 'upcoming',
        qualifyingChannelsCount: 0,
        qualifyingChannels: [],
        visitEvidencePresent: false,
        taskEvidencePresent: false,
        hasInvalidCodeOrContradiction: false,
        confidenceScore: 0,
        rationale: 'No care or visit evidence received yet.'
      };
    }

    // Check for contradictions or invalid codes
    let hasInvalidCode = false;
    for (const ev of evidenceList) {
      if ((ev.type === 'code' || ev.type === 'ivr_keypad') && ev.enteredCode) {
        if (ev.enteredCode !== currentHouseholdCode) {
          hasInvalidCode = true;
        }
      }
    }

    if (hasInvalidCode) {
      return {
        status: 'not_confirmed',
        qualifyingChannelsCount: 0,
        qualifyingChannels: [],
        visitEvidencePresent: evidenceList.some((e) => e.isVisitProofOnly),
        taskEvidencePresent: false,
        hasInvalidCodeOrContradiction: true,
        confidenceScore: 10,
        rationale: 'Invalid security code entered. Contradiction detected; confidence downgraded to Not Confirmed.'
      };
    }

    // Identify distinct qualifying independent channels
    const channelsFound = new Set<string>();
    let visitEvidencePresent = false;
    let taskEvidencePresent = false;

    for (const ev of evidenceList) {
      // Visit only signals (e.g. missed call, GPS check-in)
      if (ev.isVisitProofOnly || ev.type === 'missed_call' || ev.type === 'gps') {
        visitEvidencePresent = true;
        channelsFound.add(ev.type === 'missed_call' ? 'telephony_arrival_signal' : 'gps_arrival_signal');
        continue;
      }

      // Task-specific qualifying signals
      if (ev.type === 'photo') {
        taskEvidencePresent = true;
        channelsFound.add('visual_photo_evidence');
      } else if (ev.type === 'voice') {
        taskEvidencePresent = true;
        channelsFound.add('audio_voice_report');
      } else if ((ev.type === 'code' || ev.type === 'ivr_keypad') && ev.enteredCode === currentHouseholdCode) {
        taskEvidencePresent = true;
        channelsFound.add('dtmf_ivr_security_passcode');
      }
    }

    const qualifyingChannels = Array.from(channelsFound);

    // If only visit evidence is present (e.g. arrival missed call), task itself is NOT CONFIRMED
    if (visitEvidencePresent && !taskEvidencePresent) {
      return {
        status: 'not_confirmed',
        qualifyingChannelsCount: 0,
        qualifyingChannels,
        visitEvidencePresent: true,
        taskEvidencePresent: false,
        hasInvalidCodeOrContradiction: false,
        confidenceScore: 40,
        rationale: 'Arrival/visit signal recorded, but per-task proof (photo, voice, or code) is absent. Status: Not Confirmed.'
      };
    }

    // Two independent qualifying channels (e.g. photo + arrival call, or photo + valid home code) -> Confirmed
    if (taskEvidencePresent && qualifyingChannels.length >= 2) {
      return {
        status: 'confirmed',
        qualifyingChannelsCount: qualifyingChannels.length,
        qualifyingChannels,
        visitEvidencePresent,
        taskEvidencePresent: true,
        hasInvalidCodeOrContradiction: false,
        confidenceScore: 98,
        rationale: `Two independent qualifying channels verified (${qualifyingChannels.join(' + ')}). Status: Confirmed.`
      };
    }

    // One task-specific signal (photo, voice, or IVR code) -> Likely
    if (taskEvidencePresent && qualifyingChannels.length === 1) {
      return {
        status: 'likely',
        qualifyingChannelsCount: 1,
        qualifyingChannels,
        visitEvidencePresent,
        taskEvidencePresent: true,
        hasInvalidCodeOrContradiction: false,
        confidenceScore: 75,
        rationale: `Single task-specific signal recorded (${qualifyingChannels[0]}). Second corroborating channel required for Confirmed.`
      };
    }

    return {
      status: 'not_confirmed',
      qualifyingChannelsCount: 0,
      qualifyingChannels: [],
      visitEvidencePresent,
      taskEvidencePresent: false,
      hasInvalidCodeOrContradiction: false,
      confidenceScore: 20,
      rationale: 'Insufficient corroborating signals. Status: Not Confirmed.'
    };
  }
}
