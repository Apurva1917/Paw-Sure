import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Award,
  Phone,
  UserCheck,
  Lock,
  ChevronLeft,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const HelperVerificationScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { helper } = usePawsure();
  const [consentAcknowledged, setConsentAcknowledged] = useState(helper.consentAgreed);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      {/* Simulation Disclosure */}
      <SimulatedBanner label="Aadhaar KYC & Police background screening are simulated demo credentials." />

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#EE8267] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to WhatsApp Tasks</span>
        </button>
        <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Level 3 Verified Caregiver
        </span>
      </div>

      {/* Profile ID Card */}
      <div className="rounded-3xl bg-white p-6 border border-[#A78BFA]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={helper.avatar}
              alt={helper.name}
              className="w-20 h-20 rounded-3xl object-cover border-4 border-[#FFF0E6] shadow-sm"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
                Professional Caregiver Profile
              </span>
              <h1 className="font-heading text-xl font-bold text-[#38223A]">
                {helper.name}
              </h1>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                {helper.phone} · Active in Bellandur & HSR
              </p>
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="text-xl font-bold text-[#38223A]">★ {helper.rating}</span>
            <span className="text-[11px] text-gray-400 block">{helper.reviewCount} verified pet parent reviews</span>
          </div>
        </div>

        {/* Identity & Aadhaar KYC Section (MASKED ONLY) */}
        <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-gray-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Government Identity Verification (Aadhaar KYC)
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-gray-500">Masked ID Number:</span>
            <span className="font-mono font-bold text-[#38223A] tracking-wider text-sm">
              {helper.maskedAadhaar}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 italic">
            * Strict privacy policy: Full 12-digit Aadhaar is never stored or displayed on Pawsure.
          </p>
        </div>

        {/* Police Background Check Details */}
        <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-700 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-purple-600" />
              State Police Verification Certificate
            </span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Clear (No Records)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-gray-600">
            <div>
              <span className="text-gray-400 block">Certificate Ref:</span>
              <span className="font-mono font-semibold">{helper.policeBackgroundCheck.certificateNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Verified Date:</span>
              <span className="font-semibold">{helper.policeBackgroundCheck.verifiedDate}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 block">Issuing Body:</span>
              <span className="font-medium">{helper.policeBackgroundCheck.issuingAuthority}</span>
            </div>
          </div>
        </div>

        {/* Experience & Certifications */}
        <div className="space-y-3 pt-2 border-t border-gray-100 text-xs">
          <div>
            <h3 className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#EE8267]" />
              Professional Certifications
            </h3>
            <ul className="space-y-1">
              {helper.certifications.map((cert, i) => (
                <li key={i} className="flex items-center gap-1.5 text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* References */}
          <div>
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
              Verified Pet Parent References
            </h3>
            <div className="space-y-2">
              {helper.references.map((ref, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#38223A]">
                    <span>{ref.name}</span>
                    <span className="text-emerald-700 text-[10px] font-bold bg-emerald-100 px-2 py-0.2 rounded-full">
                      ✓ Phone Confirmed
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{ref.petInfo} · {ref.locality}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caregiver Code of Conduct & Consent */}
        <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#EE8267]/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#38223A]">Pawsure Caregiver Pledge & Consent</span>
            <span className="text-[10px] text-gray-500">Jan 2026</span>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            I pledge to follow all pet handling precautions, never use physical force, report all feeding and behavioral changes immediately, and submit authentic photo/GPS verification for every visit.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="consentCheck"
              checked={consentAcknowledged}
              onChange={(e) => setConsentAcknowledged(e.target.checked)}
              className="rounded text-[#EE8267] focus:ring-[#EE8267]"
            />
            <label htmlFor="consentCheck" className="text-xs font-semibold text-[#38223A]">
              Caregiver Consent & Code of Conduct Active
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
