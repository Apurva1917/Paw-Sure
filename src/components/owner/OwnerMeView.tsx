/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  User,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  Gift,
  Lock,
  Globe,
  Plus,
  Mail,
  CheckCircle2,
  LogOut,
  Sparkles,
  KeyRound
} from 'lucide-react';

export const OwnerMeView: React.FC<{ onNavigateTab?: (tab: string) => void }> = ({ onNavigateTab }) => {
  const { auth, household, logout, rewards, pets } = usePawsure();

  const [language, setLanguage] = useState<'en' | 'hi' | 'kn' | 'ta'>('en');
  const [coOwnerName, setCoOwnerName] = useState('');
  const [coOwnerPhone, setCoOwnerPhone] = useState('');
  const [coOwnerRelation, setCoOwnerRelation] = useState<'spouse' | 'co_parent' | 'family' | 'roommate'>('spouse');
  const [inviteSent, setInviteSent] = useState(false);

  const [coOwnersList, setCoOwnersList] = useState(household.coOwners || [
    {
      id: 'co-rohit-1',
      name: 'Rohit Kapoor',
      phone: '+91 98450 99887',
      email: 'rohit.k@example.com',
      relationship: 'spouse' as const,
      inviteStatus: 'active' as const
    }
  ]);

  const handleInviteCoOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coOwnerName.trim() || !coOwnerPhone.trim()) return;
    setCoOwnersList((prev) => [
      ...prev,
      {
        id: `co-${Date.now()}`,
        name: coOwnerName,
        phone: coOwnerPhone,
        relationship: coOwnerRelation,
        inviteStatus: 'pending_invite'
      }
    ]);
    setCoOwnerName('');
    setCoOwnerPhone('');
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      <SimulatedBanner label="Pet Parent Account Settings · Role: Owner · Household ID: #hh-neha-1" />

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EE8267] to-[#A78BFA] flex items-center justify-center text-white text-xl font-bold font-heading shadow-md">
          NK
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-heading text-xl font-bold text-[#38223A]">{auth.name || 'Neha Kapoor'}</h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Primary Pet Parent
            </span>
          </div>
          <p className="text-xs text-gray-500 font-mono">{auth.phone || '+91 98450 11223'}</p>
          <p className="text-xs text-gray-600">
            Caring for <strong className="text-[#EE8267]">{pets.map((p) => p.name).join(' & ')}</strong>
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Household & Address Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm text-[#38223A] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EE8267]" />
            <span>Household & Location Details</span>
          </h2>
          <span className="text-[10px] font-mono text-gray-400">ID: {household.id}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 space-y-1">
            <span className="text-gray-400 block text-[10px] font-semibold uppercase">Residence Address</span>
            <p className="font-semibold text-[#38223A]">{household.address.apartmentNo}, {household.address.buildingName}</p>
            <p className="text-gray-600">{household.address.locality}, {household.address.city} - {household.address.pincode}</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 space-y-1">
            <span className="text-gray-400 block text-[10px] font-semibold uppercase">Access & Security Codes</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Home Lockbox Passcode:</span>
              <strong className="font-mono text-[#EE8267] bg-white px-2 py-0.5 rounded border border-gray-200">
                {household.securityHomeCode || '4829'}
              </strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-600">Building Gate Pass:</span>
              <strong className="font-mono text-gray-700">{household.gateCode || 'GATE-7712'}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Household Membership & Co-Owners Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-sm text-[#38223A] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#A78BFA]" />
          <span>Household Co-Owners & Family Members</span>
        </h2>
        <p className="text-xs text-gray-500">
          Co-owners can view daily verification evidence, receive emergency backup alerts, and authorize handovers.
        </p>

        <div className="space-y-2">
          {coOwnersList.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-[#38223A] block">{member.name}</span>
                <span className="text-gray-500 font-mono text-[11px]">{member.phone} · Relationship: {member.relationship}</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  member.inviteStatus === 'active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {member.inviteStatus === 'active' ? 'Active Co-Parent' : 'Invite Sent (Pending)'}
              </span>
            </div>
          ))}
        </div>

        {/* Co-Owner Invite Form */}
        <form onSubmit={handleInviteCoOwner} className="p-4 rounded-2xl border border-dashed border-[#EE8267]/40 bg-[#FFF0E6]/30 space-y-3">
          <span className="text-xs font-bold text-[#EE8267] block">Invite Family Member or Co-Owner</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              placeholder="Full Name (e.g. Priya Kapoor)"
              value={coOwnerName}
              onChange={(e) => setCoOwnerName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white"
            />
            <input
              type="tel"
              placeholder="Mobile (+91 ...)"
              value={coOwnerPhone}
              onChange={(e) => setCoOwnerPhone(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white"
            />
            <select
              value={coOwnerRelation}
              onChange={(e) => setCoOwnerRelation(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-semibold"
            >
              <option value="spouse">Spouse</option>
              <option value="co_parent">Co-Parent</option>
              <option value="family">Family Member</option>
              <option value="roommate">Roommate</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#EE8267] text-white rounded-xl text-xs font-bold hover:bg-[#e06f52] transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Send Co-Owner Invite Link</span>
          </button>
          {inviteSent && (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated invite link dispatched via SMS & WhatsApp!</span>
            </p>
          )}
        </form>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <h2 className="font-heading font-bold text-sm text-[#38223A] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#EE8267]" />
          <span>App Language Preference</span>
        </h2>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिंदी' },
            { id: 'kn', label: 'ಕನ್ನಡ' },
            { id: 'ta', label: 'தமிழ்' }
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id as any)}
              className={`py-2.5 rounded-2xl border font-bold text-xs transition ${
                language === l.id
                  ? 'border-[#EE8267] bg-[#EE8267] text-white shadow-xs'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards & Pilot Status Summary */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" />
            <span>Pawsure Pilot Tier</span>
          </span>
          <h3 className="font-heading font-bold text-base text-[#38223A]">{rewards.pilotTier}</h3>
          <p className="text-xs text-gray-500">
            Balance: <strong className="text-[#38223A]">{rewards.pointsBalance} pts</strong> · Cap: 125 pts/month (PRD pilot rule)
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('rewards')}
            className="px-4 py-2 rounded-2xl bg-[#FFF9F3] border border-amber-200 text-amber-900 text-xs font-bold hover:bg-[#FFF0E6] transition"
          >
            Manage Vouchers →
          </button>
        )}
      </div>
    </div>
  );
};
