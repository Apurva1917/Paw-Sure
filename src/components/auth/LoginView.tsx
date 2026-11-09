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
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LoginView: React.FC<{ onSuccessfulLogin?: () => void }> = ({ onSuccessfulLogin }) => {
  const { loginOwner, loginHelper, loginAdmin, setRole } = usePawsure();
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

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(adminStaffId, adminPassword, adminMfa);
    onSuccessfulLogin?.();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#38223A] flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <div className="text-center max-w-md w-full mb-6">
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

      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#EE8267]/20 space-y-6">
        {/* Role Tab Selector */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
            Select Your Role to Authenticate
          </span>
          <div className="grid grid-cols-3 gap-1 bg-[#FFF9F3] p-1.5 rounded-2xl border border-gray-100">
            <button
              type="button"
              onClick={() => setSelectedRole('owner')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'owner'
                  ? 'bg-[#EE8267] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Pet Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('helper')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'helper'
                  ? 'bg-[#EE8267] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Caretaker</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-[#38223A] text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Staff Ops</span>
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
                Log in to view Bruno's routines, daily health handovers and verified care proofs.
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#EE8267]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-gray-700">Simulated 4-Digit OTP</label>
                  <button
                    type="button"
                    onClick={() => setOwnerOtp('4829')}
                    className="text-[11px] text-[#EE8267] font-semibold hover:underline"
                  >
                    Auto-Fill (4829)
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={ownerOtp}
                  onChange={(e) => setOwnerOtp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-center font-mono tracking-widest text-base font-bold focus:outline-none focus:border-[#EE8267]"
                />
                <span className="text-[11px] text-gray-400 block mt-1">
                  * Demo OTP: Enter <strong>4829</strong> to authenticate as Neha Kapoor.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] transition shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Log in to Owner Dashboard</span>
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
                Log in to receive today's daily handovers, submit visit proof, and view tasks.
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-gray-200 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Language Preference / भाषा चुनें</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'hi', label: 'हिन्दी (Hindi)' },
                    { id: 'en', label: 'English' },
                    { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                    { id: 'ta', label: 'தமிழ் (Tamil)' }
                  ].map((l) => (
                    <button
                      type="button"
                      key={l.id}
                      onClick={() => setHelperLang(l.id as any)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition ${
                        helperLang === l.id
                          ? 'bg-[#FFF0E6] border-[#EE8267] text-[#EE8267]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interface Mode: Smartphone vs Basic Phone */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Interface Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHelperMode('smartphone')}
                    className={`p-2.5 rounded-2xl border text-left transition ${
                      helperMode === 'smartphone'
                        ? 'border-[#075E54] bg-emerald-50/50'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#075E54]">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Smartphone (WhatsApp UI)</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Photo & voice evidence</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHelperMode('basic_phone')}
                    className={`p-2.5 rounded-2xl border text-left transition ${
                      helperMode === 'basic_phone'
                        ? 'border-[#EE8267] bg-[#FFF0E6]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#EE8267]">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Basic Phone Mode</span>
                    </div>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Missed-call & IVR entry</span>
                  </button>
                </div>
              </div>

              {/* Safety Pledge & Consent */}
              <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-[11px] text-gray-700 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consentAgreed"
                  checked={helperConsent}
                  onChange={(e) => setHelperConsent(e.target.checked)}
                  className="rounded mt-0.5 text-[#EE8267] focus:ring-[#EE8267]"
                />
                <label htmlFor="consentAgreed" className="leading-snug">
                  I agree to Pawsure's <strong>Safe Handling Code of Conduct</strong> and consent to visit GPS/telephony logging for pet safety.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!helperConsent}
              className={`w-full py-3 rounded-2xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 ${
                helperConsent
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Log in as Sunita Sharma</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* EXPERIENCE 3: ADMIN STAFF LOGIN */}
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
          label="Simulated credentials provided for quick testing. Real backend token exchange is mocked."
        />
      </div>
    </div>
  );
};
