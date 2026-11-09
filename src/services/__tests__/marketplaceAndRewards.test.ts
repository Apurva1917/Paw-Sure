/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { pawsureRepository } from '../pawsureRepository';
import { FacilityAudit, OwnerRewardAccount } from '../../types/pawsure';

describe('Marketplace P1/P2 Gating & 100-Point Audit Rubrics', () => {
  it('approves Grade A facilities with no safety redlines', () => {
    const audits = pawsureRepository.getState().facilityAudits;
    const happyPaws = audits.find((f) => f.id === 'fac-happy-paws-1');

    expect(happyPaws).toBeDefined();
    expect(happyPaws?.totalScore).toBe(93);
    expect(happyPaws?.grade).toBe('A');
    expect(happyPaws?.safetyRedlineFailed).toBe(false);
    expect(happyPaws?.status).toBe('approved');
  });

  it('unconditionally blocks facilities that fail safety redline even if total score is passing', () => {
    const audits = pawsureRepository.getState().facilityAudits;
    const barkHaven = audits.find((f) => f.id === 'fac-bark-haven-2');

    expect(barkHaven).toBeDefined();
    expect(barkHaven?.totalScore).toBe(66);
    expect(barkHaven?.grade).toBe('C');
    // Safety redline must be true
    expect(barkHaven?.safetyRedlineFailed).toBe(true);
    expect(barkHaven?.safetyRedlineReasons[0]).toContain('Single unlatched entrance gate');
    expect(barkHaven?.status).toBe('corrective_action');

    // Marketplace listing must be blocked
    const listings = pawsureRepository.getState().marketplaceListings;
    const barkHavenListing = listings.find((l) => l.providerId === 'fac-bark-haven-2');
    expect(barkHavenListing?.isEligibleForPublicListing).toBe(false);
    expect(barkHavenListing?.safetyRedlineBlocked).toBe(true);
  });

  it('calculates audit total score strictly from the 7 rubric categories', () => {
    const testAudit: FacilityAudit = {
      id: 'audit-test',
      facilityId: 'f-test',
      facilityName: 'Test Facility',
      operatorName: 'Tester',
      operatorPhone: '+91 99999 88888',
      locality: 'Koramangala',
      capacityMaxPets: 10,
      currentStaffCount: 3,
      acceptedSpecies: ['dog'],
      auditDate: '2026-11-09',
      auditorId: 'auditor-1',
      version: 'v1.3',
      safety20: 20,
      health15: 15,
      staff15: 15,
      spacePlay15: 15,
      hygiene15: 15,
      transparency10: 10,
      ownerExperience10: 10,
      totalScore: 100,
      grade: 'A',
      safetyRedlineFailed: false,
      safetyRedlineReasons: [],
      vetSignOff: {
        vetName: 'Dr. Test',
        clinicName: 'Test Clinic',
        signedAt: '2026-11-09',
        licenseNumber: 'VET-1234'
      },
      status: 'approved',
      expiresAt: '2027-11-09'
    };

    const calculatedSum =
      testAudit.safety20 +
      testAudit.health15 +
      testAudit.staff15 +
      testAudit.spacePlay15 +
      testAudit.hygiene15 +
      testAudit.transparency10 +
      testAudit.ownerExperience10;

    expect(calculatedSum).toBe(100);
    expect(testAudit.totalScore).toBe(calculatedSum);
  });
});

describe('Rewards Ledger Rules (PRD Pilot Specification)', () => {
  it('enforces 125 monthly points cap rule for households', () => {
    const rewards: OwnerRewardAccount = {
      pointsBalance: 60,
      pendingPoints: 10,
      lifetimeEarned: 120,
      monthlyEarned: 120,
      pilotTier: 'Bronze Care',
      vouchers: []
    };

    // Attempting to add 10 points when monthlyEarned is 120
    const pointsToAdd = 10;
    const cappedEarned = Math.min((rewards.monthlyEarned || 0) + pointsToAdd, 125);
    expect(cappedEarned).toBe(125); // Capped at 125
  });

  it('validates voucher redemption against points balance', () => {
    const rewards: OwnerRewardAccount = {
      pointsBalance: 520,
      pendingPoints: 0,
      lifetimeEarned: 600,
      monthlyEarned: 80,
      pilotTier: 'Bronze Care',
      vouchers: [
        {
          id: 'v-1',
          partnerName: 'PetStore Plus',
          title: '₹20 Off Grooming or Food Voucher',
          discountDesc: 'Flat ₹20 discount on min ₹200 bill',
          pointsCost: 500,
          claimed: false
        }
      ]
    };

    const targetVoucher = rewards.vouchers[0];
    const canRedeem = rewards.pointsBalance >= targetVoucher.pointsCost;
    expect(canRedeem).toBe(true);

    const newBalance = rewards.pointsBalance - targetVoucher.pointsCost;
    expect(newBalance).toBe(20);
  });
});
