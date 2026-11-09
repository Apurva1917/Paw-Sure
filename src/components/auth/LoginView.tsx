/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { Role } from '../../types/pawsure';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  Heart,
  Phone,
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  Globe,
  Smartphone,
  PhoneCall,
  User,
  HeartHandshake,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LoginView: React.FC<{ onSuccessfulLogin?: () => void }> = ({ onSuccessfulLogin }) => {
  const { loginOwner, loginHelper, loginCrecheOperator, loginAdmin, setRole } = usePawsure();
  const [selectedRole, setSelectedRole] = useState<Role>('owner');

  // Owner Form
  const [ownerPhone, setOwnerPhone] = useState('+91 98450 11223');
  const [ownerOtp, setOwnerOtp] = useState('4829');
  const [ownerOtpSent, setOwnerOtpSent] = useState(true);

  // Helper Form
  const [helperPhone, setHelperPhone] = useState('+91 98765 43210');
  const [helperLang, setHelperLang] = useState<'en' | 'hi' | 'kn' | 'ta'>('hi');
  const [helperMode, setHelperMode] = useState<'smartphone' | 'basic_phone'>('smartphone');
  const [helperConsent, setHelperConsent] = useState(true);

  // Crèche Operator Form
  const [crecheFacilityId, setCrecheFacilityId] = useState('creche-blr-01');
  const [crechePhone, setCrechePhone] = useState('+91 99001 22334');
  const [crecheManager, setCrecheManager] = useState('Arjun Mehta');

  // Admin Form
  const [adminStaffId, setAdminStaffId] = useState('OPS-LEAD-774');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminMfa, setAdminMfa] = useState('782910');

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginOwner(ownerPhone, ownerOtp);
    onSuccessfulLogin?.();
  };

  const handleHelperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginHelper(helperPhone, helperLang, helperMode, helperConsent);
    onSuccessfulLogin?.();
  };

  const handleCrecheSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCrecheOperator(crecheFacilityId, crechePhone, crecheManager);
    onSuccessfulLogin?.();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(adminStaffId, adminPassword, adminMfa);
    onSuccessfulLogin?.();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#38223A] flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center max-w-lg w-full mb-6">
        <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-[#EE8267] to-[#A78BFA] flex items-center justify-center text-white mx-auto shadow-md mb-2">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#38223A]">
          Pawsure
        </h1>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#EE8267] mt-0.5">
          Be sure, whoever's caring.
        </p>
      </div>

      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#EE8267]/20 space-y-6">
        {/* Role Tab Selector - 4 Personas */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Select Your Role to Authenticate
          </span>
          <div className="grid grid-cols-4 gap-1 bg-[#FFF9F3] p-1.5 rounded-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setSelectedRole('owner')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'owner'
                  ? 'bg-[#EE8267] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Pet Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('helper')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'helper'
                  ? 'bg-[#EE8267] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Caretaker</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('creche_operator')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'creche_operator'
                  ? 'bg-[#EE8267] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Crèche</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-[#38223A] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] sm:text-xs">Staff Ops</span>
            </button>
          </div>
        </div>

        {/* EXPERIENCE 1: PET OWNER (OTP) */}
        {selectedRole === 'owner' && (
          <form onSubmit={handleOwnerSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#38223A]">
                Pet Owner Login
              </h2>
              <p className="text-xs text-gray-500">
                Log in to check Bruno's routines, review daily care evidence, or manage handovers.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
                    placeholder="+91 98450 11223"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">One-Time Password (OTP)</label>
                  <span className="text-[11px] text-[#EE8267] font-semibold">Demo Code: 4829</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={4}
                    value={ownerOtp}
                    onChange={(e) => setOwnerOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 font-mono tracking-widest text-center text-sm font-bold focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#e06f52] transition shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Verify & Continue as Neha</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* EXPERIENCE 2: HELPER / CARETAKER */}
        {selectedRole === 'helper' && (
          <form onSubmit={handleHelperSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#38223A]">
                Caretaker / Helper Login
              </h2>
              <p className="text-xs text-gray-500">
                Log in to view assigned walks, acknowledge handovers, and submit photo/code evidence.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Registered Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={helperPhone}
                    onChange={(e) => setHelperPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#EE8267]" />
                  <span>Preferred Language</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'hi', label: 'हिंदी' },
                    { id: 'kn', label: 'ಕನ್ನಡ' },
                    { id: 'ta', label: 'தமிழ்' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setHelperLang(l.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        helperLang === l.id
                          ? 'border-[#EE8267] bg-[#EE8267]/10 text-[#EE8267]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Device Mode */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Experience Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHelperMode('smartphone')}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2 ${
                      helperMode === 'smartphone'
                        ? 'border-[#EE8267] bg-[#FFF9F3]'
                        : 'border-gray-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#EE8267] mt-0.5" />
                    <div>
                      <span className="font-bold text-[#38223A] block">Smartphone View</span>
                      <span className="text-[10px] text-gray-500">WhatsApp-style photos & audio</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHelperMode('basic_phone')}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2 ${
                      helperMode === 'basic_phone'
                        ? 'border-[#EE8267] bg-[#FFF9F3]'
                        : 'border-gray-200'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#38223A] block">Basic-Phone View</span>
                      <span className="text-[10px] text-gray-500">Missed-call & IVR keypad</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Safety Consent Toggle */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="helperConsentCheck"
                  checked={helperConsent}
                  onChange={(e) => setHelperConsent(e.target.checked)}
                  className="rounded text-[#EE8267] mt-1"
                />
                <label htmlFor="helperConsentCheck" className="text-[11px] text-gray-600">
                  I agree to the Pawsure Care Safety Guidelines (No helper face photos required; safety-first leash rules).
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!helperConsent}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 ${
                helperConsent
                  ? 'bg-[#EE8267] text-white hover:bg-[#e06f52]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Sign in as Sunita Sharma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* EXPERIENCE 3: CRÈCHE FACILITY OPERATOR (NEW) */}
        {selectedRole === 'creche_operator' && (
          <form onSubmit={handleCrecheSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#38223A] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#EE8267]" />
                <span>Crèche Facility Operator Login</span>
              </h2>
              <p className="text-xs text-gray-500">
                Log in to manage facility occupancy, review 100-point audit scorecards, and accept pet bookings.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Facility ID</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={crecheFacilityId}
                    onChange={(e) => setCrecheFacilityId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 font-mono text-xs focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Facility: Happy Paws Daycare (Grade A, Koramangala)</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Operator / Manager Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={crecheManager}
                    onChange={(e) => setCrecheManager(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Operator Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={crechePhone}
                    onChange={(e) => setCrechePhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#e06f52] transition shadow-md flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>Enter Crèche Operations Console</span>
            </button>
          </form>
        )}

        {/* EXPERIENCE 4: ADMIN STAFF LOGIN */}
        {selectedRole === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-[#38223A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Pawsure Staff Ops Portal</span>
              </h2>
              <p className="text-xs text-gray-500">
                Authorized personnel only. Multi-Factor Authentication (MFA) strictly required.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Staff ID / Email</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={adminStaffId}
                    onChange={(e) => setAdminStaffId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 font-mono text-xs focus:outline-none focus:border-[#38223A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Security Key / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#38223A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">Simulated MFA Code (TOTP)</label>
                  <button
                    type="button"
                    onClick={() => setAdminMfa('782910')}
                    className="text-[11px] text-purple-700 font-semibold hover:underline"
                  >
                    Paste Token (782910)
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={adminMfa}
                    onChange={(e) => setAdminMfa(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:border-[#38223A]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#38223A] text-white text-xs font-bold hover:bg-black transition shadow-md flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verify MFA & Enter Operations Console</span>
            </button>
          </form>
        )}

        {/* Development Auto-fill Note */}
        <SimulatedBanner
          label="SIMULATED: All 4 persona credentials are provided for demo testing. Real backend sessions are enforced via strict role policies."
        />
      </div>
    </div>
  );
};
