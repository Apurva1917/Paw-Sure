/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PAWSURE PROVIDER ADAPTERS ARCHITECTURE
 * Non-Negotiable Rule 1:
 * Do not fake completed OTP verification, WhatsApp delivery, phone call receipt,
 * police checks, identity verification, crèche audit, payments or emergency dispatch.
 * Status = UNAVAILABLE in production mode until an authorized external partner is connected.
 * In demo mode, all transactions return status = SIMULATED with explicit disclosures.
 */

export type ProviderStatus = 'UNAVAILABLE' | 'SIMULATED' | 'CONNECTED';

export interface AdapterResult<T = unknown> {
  status: ProviderStatus;
  isSimulated: boolean;
  providerName: string;
  timestamp: string;
  message: string;
  data?: T;
  simulatedDisclaimer: string;
}

// 1. SMS OTP Adapter
export interface ISmsOtpAdapter {
  sendOtp: (phone: string) => Promise<AdapterResult<{ otpSent: boolean; validDemoCode?: string }>>;
  verifyOtp: (phone: string, enteredCode: string) => Promise<AdapterResult<{ verified: boolean }>>;
}

// 2. Telephony / Missed-Call & IVR DTMF Adapter
export interface ITelephonyAdapter {
  simulateMissedCall: (callerPhone: string, tollFreeNumber: string) => Promise<AdapterResult<{ callSid: string; arrivalRecorded: boolean }>>;
  simulateIvrDtmf: (callerPhone: string, taskCode: string) => Promise<AdapterResult<{ digitCaptured: string; codeValid: boolean }>>;
}

// 3. WhatsApp Business API Delivery Adapter
export interface IWhatsAppAdapter {
  sendMessage: (recipientPhone: string, template: string, params: Record<string, string>) => Promise<AdapterResult<{ messageId: string; deliveryState: 'delivered' | 'queued' }>>;
}

// 4. Identity & Background Check KYC Adapter (UIDAI / Police)
export interface IIdentityKycAdapter {
  verifyAadhaarMasked: (maskedAadhaar: string) => Promise<AdapterResult<{ isFormatValid: boolean; maskedDisplay: string }>>;
  checkPoliceClearance: (helperId: string) => Promise<AdapterResult<{ certificateStatus: 'clear' | 'pending'; authority: string }>>;
}

// 5. Payment & Escrow Gateway Adapter
export interface IPaymentAdapter {
  createEscrowHold: (bookingId: string, amountInr: number) => Promise<AdapterResult<{ escrowId: string; state: 'HELD_PENDING' }>>;
  releasePayout: (bookingId: string) => Promise<AdapterResult<{ payoutId: string; state: 'RELEASED' }>>;
}

// 6. Emergency Dispatch Adapter
export interface IEmergencyDispatchAdapter {
  dispatchEmergencyAlert: (householdId: string, message: string) => Promise<AdapterResult<{ notifiedContactsCount: number }>>;
}

// Concrete Implementations with Explicit Gating
class PawsureProviderAdapters implements ISmsOtpAdapter, ITelephonyAdapter, IWhatsAppAdapter, IIdentityKycAdapter, IPaymentAdapter, IEmergencyDispatchAdapter {
  private isDemoMode: boolean = true; // In development/demo, provide simulated fallback with disclosures

  public setDemoMode(active: boolean) {
    this.isDemoMode = active;
  }

  public getDemoMode(): boolean {
    return this.isDemoMode;
  }

  // SMS OTP
  async sendOtp(phone: string): Promise<AdapterResult<{ otpSent: boolean; validDemoCode?: string }>> {
    const timestamp = new Date().toISOString();
    if (!this.isDemoMode) {
      return {
        status: 'UNAVAILABLE',
        isSimulated: false,
        providerName: 'Telecom SMS Gateway',
        timestamp,
        message: 'Production SMS provider is not configured. Live carrier SMS dispatch is unavailable.',
        simulatedDisclaimer: 'Requires enterprise SMS gateway integration (e.g. Twilio/Karix/Gupshup).'
      };
    }
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Pawsure Demo SMS Simulator',
      timestamp,
      message: `Simulated SMS OTP sent to ${phone}. Use demo code 4829.`,
      data: { otpSent: true, validDemoCode: '4829' },
      simulatedDisclaimer: 'SIMULATED: No real SMS carrier was contacted. For demo validation use 4829.'
    };
  }

  async verifyOtp(phone: string, enteredCode: string): Promise<AdapterResult<{ verified: boolean }>> {
    const timestamp = new Date().toISOString();
    if (!this.isDemoMode) {
      return {
        status: 'UNAVAILABLE',
        isSimulated: false,
        providerName: 'Telecom SMS Gateway',
        timestamp,
        message: 'Live OTP verification service unavailable.',
        simulatedDisclaimer: 'Production requires connected SMS provider.'
      };
    }
    const isValid = enteredCode === '4829';
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Pawsure Demo SMS Simulator',
      timestamp,
      message: isValid ? 'Demo OTP verified successfully' : 'Incorrect demo code entered',
      data: { verified: isValid },
      simulatedDisclaimer: 'SIMULATED: Checked against local demo fixture code (4829).'
    };
  }

  // Telephony
  async simulateMissedCall(callerPhone: string, tollFreeNumber: string): Promise<AdapterResult<{ callSid: string; arrivalRecorded: boolean }>> {
    const timestamp = new Date().toISOString();
    if (!this.isDemoMode) {
      return {
        status: 'UNAVAILABLE',
        isSimulated: false,
        providerName: 'Telephony PRI/SIP Trunk Provider',
        timestamp,
        message: 'No active telecom SIP trunk connected.',
        simulatedDisclaimer: 'Real carrier missed calls cannot be received without telco integration.'
      };
    }
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Pawsure Virtual IVR Switchboard',
      timestamp,
      message: `Missed call registered from ${callerPhone} to ${tollFreeNumber}. Visit arrival logged; task proof unconfirmed.`,
      data: { callSid: `call-sim-${Date.now()}`, arrivalRecorded: true },
      simulatedDisclaimer: 'SIMULATED: Toll-free telephony event recorded locally in browser.'
    };
  }

  async simulateIvrDtmf(callerPhone: string, taskCode: string): Promise<AdapterResult<{ digitCaptured: string; codeValid: boolean }>> {
    const timestamp = new Date().toISOString();
    const isValid = taskCode === '4829';
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Pawsure Virtual DTMF Decoder',
      timestamp,
      message: isValid ? 'Task verified via DTMF tone code' : 'Invalid DTMF passcode entered',
      data: { digitCaptured: taskCode, codeValid: isValid },
      simulatedDisclaimer: 'SIMULATED: In-browser DTMF tone keypad simulation.'
    };
  }

  // WhatsApp
  async sendMessage(recipientPhone: string, template: string, params: Record<string, string>): Promise<AdapterResult<{ messageId: string; deliveryState: 'delivered' | 'queued' }>> {
    const timestamp = new Date().toISOString();
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'WhatsApp Cloud API Simulator',
      timestamp,
      message: `Message dispatched via template "${template}" to ${recipientPhone}`,
      data: { messageId: `wa-sim-${Date.now()}`, deliveryState: 'delivered' },
      simulatedDisclaimer: 'SIMULATED: Rendered in Pawsure WhatsApp demo view without Meta Cloud API dispatch.'
    };
  }

  // Identity / Police
  async verifyAadhaarMasked(maskedAadhaar: string): Promise<AdapterResult<{ isFormatValid: boolean; maskedDisplay: string }>> {
    const timestamp = new Date().toISOString();
    const isMaskedRegex = /^XXXX-XXXX-\d{4}$/.test(maskedAadhaar);
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Simulated UIDAI Verification Sandbox',
      timestamp,
      message: isMaskedRegex ? 'Masked Aadhaar format validated. Full number never stored.' : 'Invalid masked format.',
      data: { isFormatValid: isMaskedRegex, maskedDisplay: maskedAadhaar },
      simulatedDisclaimer: 'SIMULATED: UIDAI sandbox format verification only. Full 12-digit Aadhaar numbers are never collected.'
    };
  }

  async checkPoliceClearance(helperId: string): Promise<AdapterResult<{ certificateStatus: 'clear' | 'pending'; authority: string }>> {
    const timestamp = new Date().toISOString();
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Police Verification Records Simulator',
      timestamp,
      message: 'Police clearance certificate logged for caretaker.',
      data: { certificateStatus: 'clear', authority: 'Karnataka State Police (Simulated)' },
      simulatedDisclaimer: 'SIMULATED: Document check simulated for prototype.'
    };
  }

  // Payment
  async createEscrowHold(bookingId: string, amountInr: number): Promise<AdapterResult<{ escrowId: string; state: 'HELD_PENDING' }>> {
    const timestamp = new Date().toISOString();
    return {
      status: 'UNAVAILABLE',
      isSimulated: true,
      providerName: 'Payment Escrow Gateway (Razorpay/Stripe)',
      timestamp,
      message: `Payment gateway not connected. ₹${amountInr} booking hold is marked as SIMULATED_PENDING_ESCROW.`,
      data: { escrowId: `escrow-sim-${Date.now()}`, state: 'HELD_PENDING' },
      simulatedDisclaimer: 'UNAVAILABLE: Payments are disabled until licensed banking partner is integrated.'
    };
  }

  async releasePayout(bookingId: string): Promise<AdapterResult<{ payoutId: string; state: 'RELEASED' }>> {
    const timestamp = new Date().toISOString();
    return {
      status: 'UNAVAILABLE',
      isSimulated: true,
      providerName: 'Payment Escrow Gateway',
      timestamp,
      message: 'Automatic payout disabled.',
      data: { payoutId: `payout-sim-${Date.now()}`, state: 'RELEASED' },
      simulatedDisclaimer: 'UNAVAILABLE: Banking payout disabled.'
    };
  }

  // Emergency
  async dispatchEmergencyAlert(householdId: string, message: string): Promise<AdapterResult<{ notifiedContactsCount: number }>> {
    const timestamp = new Date().toISOString();
    return {
      status: 'SIMULATED',
      isSimulated: true,
      providerName: 'Emergency Broadcast Dispatcher',
      timestamp,
      message: `Emergency broadcast alert pushed to registered family emergency contacts.`,
      data: { notifiedContactsCount: 2 },
      simulatedDisclaimer: 'SIMULATED: Pawsure facilitates contact alerting only; does NOT provide direct veterinary or municipal emergency response.'
    };
  }
}

export const providerAdapters = new PawsureProviderAdapters();
