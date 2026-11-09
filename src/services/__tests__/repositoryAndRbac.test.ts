/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { pawsureRepository } from '../pawsureRepository';
import { OwnerReturnCheck } from '../../types/pawsure';

describe('PawsureRepository & RBAC Permissions', () => {
  beforeEach(() => {
    pawsureRepository.resetAll();
  });

  it('scopes households correctly and provides primary household for owner', () => {
    const hh = pawsureRepository.getHouseholdForUser('owner-neha-1', 'owner');
    expect(hh).toBeDefined();
    expect(hh?.primaryOwnerId).toBe('owner-neha-1');
    expect(hh?.securityHomeCode).toBe('4829');
  });

  it('filters pets according to role authorization', () => {
    // Owner sees their household pets
    const ownerPets = pawsureRepository.getPetsForRole('hh-neha-1', 'owner');
    expect(ownerPets.length).toBeGreaterThan(0);
    expect(ownerPets.some((p) => p.name === 'Bruno')).toBe(true);

    // Helper sees only assigned pets
    const helperPets = pawsureRepository.getPetsForRole('hh-neha-1', 'helper', 'helper-sunita-1');
    expect(helperPets.length).toBeGreaterThan(0);
  });

  it('logs audit when sensitive actions are recorded', () => {
    const initialLogsCount = pawsureRepository.getState().auditLogs.length;
    pawsureRepository.logAudit(
      'Sunita Sharma',
      'helper',
      'Security Passcode Read',
      'Read lockbox code for assigned visit.',
      'safety',
      true
    );

    const updatedLogs = pawsureRepository.getState().auditLogs;
    expect(updatedLogs.length).toBe(initialLogsCount + 1);
    const lastLog = updatedLogs[0];
    expect(lastLog.sensitiveDataAccessed).toBe(true);
    expect(lastLog.action).toBe('Security Passcode Read');
    expect(lastLog.actor).toBe('Sunita Sharma');
  });

  it('updates state immutably and persists updates', () => {
    const returnCheck: OwnerReturnCheck = {
      id: 'ret-test-1',
      householdId: 'hh-neha-1',
      petId: 'pet-bruno-1',
      date: '2026-11-09',
      inspectedAt: '06:00 PM',
      waterBowlFilled: true,
      foodBowlMatchesPortion: true,
      dogReliefWalkNoted: true,
      petDemeanor: 'calm_happy',
      inspectionMatchesReportedTasks: true,
      disputeFlagged: false,
      disputeStatus: 'none'
    };

    pawsureRepository.updateState((draft) => ({
      ...draft,
      returnChecks: [returnCheck, ...draft.returnChecks]
    }));

    const checks = pawsureRepository.getState().returnChecks;
    expect(checks.some((c) => c.id === 'ret-test-1')).toBe(true);
  });
});
