/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { providerAdapters } from '../providerAdapters';

describe('PawsureProviderAdapters (Non-Negotiable Rule 1)', () => {
  it('marks SMS OTP as SIMULATED with demo code in demo mode', async () => {
    providerAdapters.setDemoMode(true);
    const sendResult = await providerAdapters.sendOtp('+91 98450 11223');
    expect(sendResult.status).toBe('SIMULATED');
    expect(sendResult.isSimulated).toBe(true);
    expect(sendResult.data?.validDemoCode).toBe('4829');

    const verifySuccess = await providerAdapters.verifyOtp('+91 98450 11223', '4829');
    expect(verifySuccess.data?.verified).toBe(true);

    const verifyFail = await providerAdapters.verifyOtp('+91 98450 11223', '9999');
    expect(verifyFail.data?.verified).toBe(false);
  });

  it('marks telephony missed-calls and DTMF as SIMULATED in demo mode', async () => {
    const callResult = await providerAdapters.simulateMissedCall('+91 98765 43210', '1800-PAWSURE');
    expect(callResult.status).toBe('SIMULATED');
    expect(callResult.data?.arrivalRecorded).toBe(true);

    const dtmfResult = await providerAdapters.simulateIvrDtmf('+91 98765 43210', '4829');
    expect(dtmfResult.status).toBe('SIMULATED');
    expect(dtmfResult.data?.codeValid).toBe(true);
  });

  it('returns UNAVAILABLE when demo mode is disabled for live carrier operations', async () => {
    providerAdapters.setDemoMode(false);
    const prodResult = await providerAdapters.sendOtp('+91 98450 11223');
    expect(prodResult.status).toBe('UNAVAILABLE');
    expect(prodResult.isSimulated).toBe(false);

    // Reset to demo mode
    providerAdapters.setDemoMode(true);
  });

  it('validates masked Aadhaar format XXXX-XXXX-3829 and never stores full Aadhaar', async () => {
    const validMasked = await providerAdapters.verifyAadhaarMasked('XXXX-XXXX-3829');
    expect(validMasked.data?.isFormatValid).toBe(true);

    const invalidFullAadhaar = await providerAdapters.verifyAadhaarMasked('1234-5678-9012');
    expect(invalidFullAadhaar.data?.isFormatValid).toBe(false);
  });

  it('declares payment escrow as UNAVAILABLE until licensed banking gateway is connected', async () => {
    const escrowResult = await providerAdapters.createEscrowHold('booking-123', 850);
    expect(escrowResult.status).toBe('UNAVAILABLE');
  });
});
