import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { StatusBadge } from '../common/StatusBadge';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { EscalationLadderModal } from '../common/EscalationLadderModal';
import { VerificationStatus, EscalationItem } from '../../types/pawsure';
import {
  LayoutDashboard,
  Home,
  PawPrint,
  Users,
  CheckSquare,
  Activity,
  AlertTriangle,
  Scale,
  BarChart3,
  ScrollText,
  Settings,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Lock,
  FileCheck,
  Award,
  FastForward,
  BellRing,
  Send,
  Eye,
  Building2
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'households'
  | 'pets'
  | 'helpers'
  | 'facility_audits'
  | 'onboarding_consent'
  | 'identity_kyc'
  | 'telephony_ivr'
  | 'reviews'
  | 'activity'
  | 'escalations'
  | 'disputes'
  | 'notifications'
  | 'analytics'
  | 'audit'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    tasks,
    escalations,
    auditLogs,
    pets,
    helper,
    reports,
    ivrLogs,
    handovers,
    rewards,
    ratings,
    simulatedClock,
    advanceSimulatedTime,
    adminSetTaskStatus,
    resolveEscalation,
    facilityAudits
  } = usePawsure();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [selectedLadderEscalation, setSelectedLadderEscalation] = useState<EscalationItem | null>(null);

  // Stats
  const totalTasks = tasks.length;
  const confirmedTasks = tasks.filter((t) => t.status === 'confirmed').length;
  const likelyTasks = tasks.filter((t) => t.status === 'likely').length;
  const notConfirmedTasks = tasks.filter((t) => t.status === 'not_confirmed').length;
  const activeEscalations = escalations.filter((e) => e.status === 'active');
  const disputedReviews = ratings.filter((r) => r.status === 'disputed');

  const navItems: { id: AdminTab; label: string; count?: number; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'escalations', label: 'Escalations Ladder', count: activeEscalations.length, icon: AlertTriangle },
    { id: 'reviews', label: 'Evidence Review Queue', count: likelyTasks, icon: CheckSquare },
    { id: 'telephony_ivr', label: 'Missed-Call & IVR Activity', count: ivrLogs.length, icon: PhoneCall },
    { id: 'activity', label: 'Live Care Activity', icon: Activity },
    { id: 'households', label: 'Household & Owners', icon: Home },
    { id: 'pets', label: 'Pet Profiles & Care Cards', count: pets.length, icon: PawPrint },
    { id: 'helpers', label: 'Caretakers & References', count: 1, icon: Users },
    { id: 'facility_audits', label: '100-Pt Facility Audits', count: facilityAudits.length, icon: Building2 },
    { id: 'onboarding_consent', label: 'Onboarding & Consent', icon: FileCheck },
    { id: 'identity_kyc', label: 'Identity & Masked KYC', icon: Lock },
    { id: 'disputes', label: 'Disputes & Reviews', count: disputedReviews.length, icon: Scale },
    { id: 'notifications', label: 'Notification Delivery', icon: BellRing },
    { id: 'analytics', label: 'Pilot Metrics & SLA', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs (Immutable)', count: auditLogs.length, icon: ScrollText },
    { id: 'settings', label: 'Verification Policies', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#38223A] pb-24">
      {/* Top Banner */}
      <SimulatedBanner label="Admin Operations Console · Security Level 4 · Full ID numbers strictly masked · Simulated Telephony" />

      <div className="max-w-7xl mx-auto mt-4 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 px-3 py-2 mb-3 border-b border-gray-100">
                <span className="p-2 rounded-2xl bg-[#38223A] text-white">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-heading font-bold text-sm text-[#38223A]">Pawsure Operations</h2>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                    Clock: {simulatedClock}
                  </span>
                </div>
              </div>

              {/* Quick Time Advancement Tool inside sidebar */}
              <div className="p-2.5 rounded-2xl bg-[#FFF0E6] border border-[#EE8267]/30 mb-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-[11px] text-[#EE8267]">
                  <span className="flex items-center gap-1">
                    <FastForward className="w-3.5 h-3.5" />
                    Advance Time
                  </span>
                  <span>{simulatedClock}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => advanceSimulatedTime(15)}
                    className="flex-1 py-1 rounded-lg bg-white text-[#EE8267] font-bold text-[10px] border border-[#EE8267]/40 hover:bg-[#FFF9F3]"
                  >
                    +15m
                  </button>
                  <button
                    onClick={() => advanceSimulatedTime(30)}
                    className="flex-1 py-1 rounded-lg bg-white text-[#EE8267] font-bold text-[10px] border border-[#EE8267]/40 hover:bg-[#FFF9F3]"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => advanceSimulatedTime(45)}
                    className="flex-1 py-1 rounded-lg bg-[#EE8267] text-white font-bold text-[10px] hover:bg-[#E26D50]"
                  >
                    +45m
                  </button>
                </div>
              </div>

              <nav className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-[#38223A] text-white shadow-xs'
                          : 'text-gray-600 hover:bg-[#FFF0E6] hover:text-[#38223A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                            isActive
                              ? 'bg-white text-[#38223A]'
                              : item.id === 'escalations'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 space-y-5">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div>
                  <h1 className="font-heading text-2xl font-bold text-[#38223A]">
                    Care Operations Control Desk
                  </h1>
                  <p className="text-xs text-gray-500">
                    Live verification confidence breakdown across Bellandur pilot cluster.
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block">Confirmed Tasks</span>
                    <span className="text-2xl font-bold text-[#10B981] mt-1 block">{confirmedTasks}</span>
                    <span className="text-[11px] text-gray-400">GPS/Photo verified</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">In Review (Likely)</span>
                    <span className="text-2xl font-bold text-[#D97706] mt-1 block">{likelyTasks}</span>
                    <span className="text-[11px] text-gray-400">Proof pending inspection</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block">Not Confirmed</span>
                    <span className="text-2xl font-bold text-[#EF4444] mt-1 block">{notConfirmedTasks}</span>
                    <span className="text-[11px] text-gray-400">Overdue SLA triggers</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Active Escalations</span>
                    <span className="text-2xl font-bold text-purple-900 mt-1 block">{activeEscalations.length}</span>
                    <span className="text-[11px] text-gray-400">Ladder active</span>
                  </div>
                </div>

                {/* Active Escalations Banner */}
                {activeEscalations.length > 0 && (
                  <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <h2 className="font-heading font-bold text-sm text-rose-900">
                          Active Care Gaps Needing Attention ({activeEscalations.length})
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab('escalations')}
                        className="text-xs font-bold text-rose-700 hover:underline"
                      >
                        Inspect Ladder →
                      </button>
                    </div>

                    {activeEscalations.map((esc) => (
                      <div
                        key={esc.id}
                        className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#38223A]">{esc.title}</span>
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded-full">
                              Stage: {esc.currentStage}
                            </span>
                          </div>
                          <p className="text-gray-500 text-[11px] mt-0.5">{esc.details}</p>
                        </div>
                        <button
                          onClick={() => setSelectedLadderEscalation(esc)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-xs shrink-0"
                        >
                          Open Ladder Timeline
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ESCALATIONS LADDER */}
            {activeTab === 'escalations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-xl font-bold text-[#38223A]">
                      Missed-Care Escalation Ladder & Incident History
                    </h1>
                    <p className="text-xs text-gray-500">
                      7-stage SLA progression: Task Due → Reminder → Owner Alert → Owner Ack → Backup Circle → Find Cover → Resolution.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {escalations.map((esc) => (
                    <div
                      key={esc.id}
                      className={`p-5 rounded-3xl border shadow-xs space-y-3 ${
                        esc.status === 'active' ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-gray-200 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#38223A]">{esc.title}</h3>
                            <span className="text-xs font-mono font-bold text-rose-700">
                              (Overdue: +{esc.simulatedOverdueMins}m)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{esc.householdName} · Caregiver: {esc.helperName}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Current Stage: {esc.currentStage}
                          </span>
                          <button
                            onClick={() => setSelectedLadderEscalation(esc)}
                            className="px-3 py-1 rounded-xl bg-[#38223A] text-white text-xs font-bold hover:bg-black"
                          >
                            Inspect Full Ladder
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-white border border-gray-100 text-xs text-gray-700">
                        <strong className="block text-[11px] text-gray-400 uppercase">Recent Ladder Event:</strong>
                        <p className="mt-0.5">{esc.timeline[esc.timeline.length - 1]?.note || esc.details}</p>
                      </div>

                      {esc.status === 'active' && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                          <button
                            onClick={() => resolveEscalation(esc.id, 'Admin phone check confirmed pet is fine.')}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                          >
                            Resolve Incident
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TELEPHONY & IVR ACTIVITY */}
            {activeTab === 'telephony_ivr' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-xl font-bold text-[#38223A]">
                      Missed-Call & IVR Activity Ledger
                    </h1>
                    <p className="text-xs text-gray-500">
                      Telemetry records received on toll-free line 1800-PAWSURE.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold">
                    Toll-Free Gateway Active
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FFF9F3] text-gray-500 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Event Type</th>
                        <th className="p-3">Caller Phone</th>
                        <th className="p-3">Dialed Line</th>
                        <th className="p-3">Evidence Nature</th>
                        <th className="p-3">Status / Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {ivrLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#FFF0E6]/30">
                          <td className="p-3 font-bold text-[#38223A]">{log.timestamp}</td>
                          <td className="p-3 uppercase font-bold text-[#EE8267]">{log.eventType}</td>
                          <td className="p-3">{log.helperPhone}</td>
                          <td className="p-3">{log.dialedNumber}</td>
                          <td className="p-3">
                            {log.recognizedAsVisitProofOnly ? (
                              <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                                Visit Arrival Proof Only
                              </span>
                            ) : (
                              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-sans font-bold text-[10px]">
                                Task Proof Verified
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-sans text-xs text-gray-700">{log.statusText}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ONBOARDING & CONSENT */}
            {activeTab === 'onboarding_consent' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Caretaker Onboarding & Legal Consent Ledger
                </h1>
                <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Sunita Sharma (+91 98765 43210)</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold text-xs">
                      Consent Active
                    </span>
                  </div>
                  <p className="text-gray-600">Preferred Language: <strong>हिन्दी (Hindi)</strong></p>
                  <p className="text-gray-600">Interface Mode: <strong>{helper.interfaceMode}</strong></p>
                  <p className="text-gray-600">Agreed to Safe Handling Pledge: <strong>{helper.consentAgreed ? 'Yes' : 'No'}</strong></p>
                  <p className="text-gray-400 font-mono text-[11px]">Consent Timestamp: {helper.consentTimestamp}</p>
                </div>
              </div>
            )}

            {/* 5. IDENTITY & MASKED KYC */}
            {activeTab === 'identity_kyc' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Identity Verification & Masked Document Registry
                </h1>
                <p className="text-xs text-gray-500">
                  Strict privacy compliance: Aadhaar numbers are permanently masked. Only last 4 digits stored.
                </p>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs space-y-3">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Sunita Sharma</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                      Level 3 Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FFF9F3]">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Government ID (Aadhaar)</span>
                      <span className="font-mono font-bold text-base text-[#38223A]">{helper.maskedAadhaar}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F3]">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Police Certificate</span>
                      <span className="font-mono font-bold text-base text-[#38223A]">{helper.policeBackgroundCheck.certificateNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. HOUSEHOLDS */}
            {activeTab === 'households' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Household & Owner Management
                </h1>
                <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>Neha Kapoor</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600">Address: Tower 4, Flat 402, Green Glen Layout, Bellandur, Bangalore</p>
                  <p className="text-gray-600">Registered Phone: +91 98450 11223</p>
                  <p className="text-gray-600">Assigned Caregiver: Sunita Sharma (+91 98765 43210)</p>
                  <p className="text-gray-600">Household Care Passcode: <strong className="font-mono text-[#EE8267]">4829</strong></p>
                </div>
              </div>
            )}

            {/* 7. PET PROFILES & CARE CARDS */}
            {activeTab === 'pets' && (
              <div className="space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Pet Profiles & Active Care Cards ({pets.length})
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex items-center gap-4"
                    >
                      <img
                        src={pet.photo}
                        alt={pet.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#EE8267]"
                      />
                      <div className="text-xs space-y-1">
                        <h2 className="font-heading font-bold text-base text-[#38223A]">{pet.name}</h2>
                        <p className="text-gray-500">{pet.species.toUpperCase()} · {pet.breed} · {pet.weightKg}kg</p>
                        <p className="text-gray-600">Primary Vet: {pet.primaryVet.clinic}</p>
                        <span className="text-[10px] font-mono text-[#EE8267] font-bold block">
                          Security Passcode: {pet.securityHomeCode || '4829'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. CARETAKERS & REFERENCES */}
            {activeTab === 'helpers' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Vetted Caregivers & Verified References
                </h1>
                <div className="p-4 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={helper.avatar}
                      alt={helper.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#A78BFA]"
                    />
                    <div>
                      <h2 className="font-heading font-bold text-base text-[#38223A]">{helper.name}</h2>
                      <p className="text-gray-500 font-mono">{helper.phone}</p>
                      <p className="text-gray-600">★ {helper.rating} ({helper.completedSitsCount} completed sits)</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-bold block mb-1">Verified References on File:</span>
                    <ul className="space-y-1 text-gray-700">
                      {helper.references.map((r, i) => (
                        <li key={i} className="flex items-center justify-between">
                          <span>{r.name} ({r.petInfo}) — {r.locality}</span>
                          <span className="text-emerald-700 font-bold">✓ Verified</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* FACILITY AUDITS (100-POINT RUBRIC GATE) */}
            {activeTab === 'facility_audits' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <h1 className="font-heading text-xl font-bold text-[#38223A]">
                      Crèche Facility 100-Point Audit Ledger ({facilityAudits.length})
                    </h1>
                    <p className="text-xs text-gray-500">
                      Marketplace P1 Gate: Facilities must score 85+ (Grade A) and have ZERO safety redline failures.
                    </p>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
                    PRD v1.3 Standard Rubric
                  </span>
                </div>

                <div className="space-y-4">
                  {facilityAudits.map((facility) => (
                    <div
                      key={facility.id}
                      className={`p-5 rounded-3xl border transition-all ${
                        facility.safetyRedlineFailed
                          ? 'bg-rose-50/60 border-2 border-rose-300'
                          : 'bg-[#FFF9F3] border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/70">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-bold text-lg ${
                              facility.safetyRedlineFailed
                                ? 'bg-rose-600 text-white'
                                : 'bg-purple-700 text-white'
                            }`}
                          >
                            {facility.grade}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="font-heading font-bold text-base text-[#38223A]">
                                {facility.facilityName}
                              </h2>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  facility.safetyRedlineFailed
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {facility.safetyRedlineFailed
                                  ? 'BLOCKED: SAFETY REDLINE FAILED'
                                  : `APPROVED (Score: ${facility.totalScore}/100)`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                              Operator: {facility.operatorName} ({facility.operatorPhone}) · {facility.locality}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#38223A] block">
                            Capacity: {facility.capacityMaxPets} pets
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Staff: {facility.currentStaffCount} handlers
                          </span>
                        </div>
                      </div>

                      {/* 100-Point Breakdown Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
                        <div className="p-2 bg-white rounded-xl border border-gray-100">
                          <span className="text-gray-400 block text-[10px]">1. Physical Safety (20)</span>
                          <strong className={facility.safety20 < 15 ? 'text-rose-600' : 'text-gray-800'}>
                            {facility.safety20} / 20 pts
                          </strong>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-gray-100">
                          <span className="text-gray-400 block text-[10px]">2. Health Protocols (15)</span>
                          <strong className="text-gray-800">{facility.health15} / 15 pts</strong>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-gray-100">
                          <span className="text-gray-400 block text-[10px]">3. Staff Ratio 1:4 (15)</span>
                          <strong className="text-gray-800">{facility.staff15} / 15 pts</strong>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-gray-100">
                          <span className="text-gray-400 block text-[10px]">4. Space & Zones (15)</span>
                          <strong className="text-gray-800">{facility.spacePlay15} / 15 pts</strong>
                        </div>
                      </div>

                      {/* Redline failure warning box if failed */}
                      {facility.safetyRedlineFailed && (
                        <div className="mt-3 p-3 rounded-2xl bg-rose-100/80 border border-rose-300 text-xs text-rose-950 space-y-1">
                          <strong className="block font-bold">Unconditional Redline Failure:</strong>
                          <p>{facility.safetyRedlineReasons.join('; ')}</p>
                          <span className="text-[10px] text-rose-800 italic block">
                            Platform Rule: This facility cannot be booked by pet owners until a physical re-audit verifies double-gate latching.
                          </span>
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
                        <span>Audited by: {facility.auditorId} on {facility.auditDate}</span>
                        <span>Vet Contract: {facility.vetSignOff.vetName} ({facility.vetSignOff.clinicName})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. EVIDENCE REVIEW */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div>
                  <h1 className="font-heading text-xl font-bold text-[#38223A]">
                    Care Evidence Review Queue
                  </h1>
                  <p className="text-xs text-gray-500">
                    Tasks marked "Likely" that require human review of attached voice notes or bowls.
                  </p>
                </div>

                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === 'likely' || t.status === 'not_confirmed')
                    .map((task) => (
                      <div
                        key={task.id}
                        className="bg-white rounded-3xl p-5 border border-amber-300 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-gray-500">{task.scheduledTime}</span>
                              <StatusBadge status={task.status} size="sm" />
                            </div>
                            <h3 className="font-bold text-base text-[#38223A] mt-0.5">{task.title}</h3>
                            <p className="text-xs text-gray-600">{task.instructions}</p>
                          </div>
                        </div>

                        {task.notes && (
                          <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-900 border border-amber-200">
                            <strong>Caregiver Note:</strong> {task.notes}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => adminSetTaskStatus(task.id, 'not_confirmed', 'Rejected by admin review')}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-bold hover:bg-rose-50"
                          >
                            Mark Not Confirmed
                          </button>
                          <button
                            onClick={() => adminSetTaskStatus(task.id, 'confirmed', 'Approved by admin inspection')}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                          >
                            Approve as Confirmed
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 10. DISPUTES & RATINGS */}
            {activeTab === 'disputes' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Disputes & Rating Review Desk
                </h1>
                {ratings.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{r.ownerName} on {r.petName}'s care</span>
                      <span className="font-bold text-amber-500">{'★'.repeat(r.ratingStars)}</span>
                    </div>
                    <p className="text-gray-700">"{r.feedbackText}"</p>
                    {r.status === 'disputed' && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                        <strong>Dispute Flagged:</strong> {r.disputeNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 11. NOTIFICATIONS DELIVERY */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h1 className="font-heading text-xl font-bold text-[#38223A]">
                      Notification Dispatch Ledger (5 Discrete Delivery States)
                    </h1>
                    <p className="text-xs text-gray-500">
                      Tracking: Queued → Sent → Delivered → Acknowledged / Failed (Asia/Kolkata).
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-gray-100 text-gray-700 font-bold px-2.5 py-0.5 rounded-full">
                    Idempotent Dispatch
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  {[
                    {
                      id: 'notif-1',
                      time: '01:30 PM IST',
                      to: 'Sunita (+91 98765 43210)',
                      channel: 'SMS',
                      type: 'Task Due Reminder',
                      status: 'delivered',
                      detail: 'Midday relief check scheduled window now active'
                    },
                    {
                      id: 'notif-2',
                      time: '02:00 PM IST',
                      to: 'Neha Kapoor (+91 98450 11223)',
                      channel: 'Push Notification',
                      type: 'Care Gap Escalation',
                      status: 'acknowledged',
                      detail: 'Owner explicit "I\'m on it" action recorded at 02:16 PM'
                    },
                    {
                      id: 'notif-3',
                      time: '02:15 PM IST',
                      to: 'Rohit & Friends Circle (3 recipients)',
                      channel: 'WhatsApp / SMS',
                      type: 'Backup Alert',
                      status: 'sent',
                      detail: 'Backup standby broadcast dispatched within 1.5km radius'
                    },
                    {
                      id: 'notif-4',
                      time: '02:25 PM IST',
                      to: 'Pooja Reddy (+91 98451 22334)',
                      channel: 'In-App Direct',
                      type: 'Friend Finder Offer',
                      status: 'queued',
                      detail: 'Hold timer active (10 mins provisional reserve)'
                    },
                    {
                      id: 'notif-5',
                      time: '01:45 PM IST',
                      to: 'Carrier Gateway +91 91234 56789',
                      channel: 'SMS Gateway',
                      type: 'Secondary Sitter Ping',
                      status: 'failed',
                      detail: 'Carrier network timeout; fallback to push attempted'
                    }
                  ].map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-bold text-[11px]">{n.time}</span>
                          <span className="text-gray-300">·</span>
                          <span className="font-bold text-[#38223A]">{n.type}</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.2 rounded font-sans font-bold">
                            {n.channel}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-700 font-sans">
                          To: <strong>{n.to}</strong> — {n.detail}
                        </p>
                      </div>

                      <span
                        className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                          n.status === 'acknowledged'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : n.status === 'delivered'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : n.status === 'sent'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : n.status === 'queued'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {n.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. PILOT METRICS & ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Pilot Quality & Verification Metrics
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-gray-500 font-bold block uppercase text-[10px]">Verification Rate</span>
                    <span className="text-3xl font-bold text-emerald-800 mt-1 block">94.2%</span>
                    <p className="text-emerald-700 mt-1">Confirmed with valid photo/IVR code</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-gray-500 font-bold block uppercase text-[10px]">Avg Backup Response</span>
                    <span className="text-3xl font-bold text-purple-800 mt-1 block">4.2 min</span>
                    <p className="text-purple-700 mt-1">Across 1.5km local circle</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-gray-500 font-bold block uppercase text-[10px]">Basic Phone Usage</span>
                    <span className="text-3xl font-bold text-amber-800 mt-1 block">38%</span>
                    <p className="text-amber-700 mt-1">Arrivals recorded via missed-call</p>
                  </div>
                </div>
              </div>
            )}

            {/* 13. AUDIT LOGS */}
            {activeTab === 'audit' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="font-heading text-xl font-bold text-[#38223A]">
                    System Audit Trail (Immutable Ledger)
                  </h1>
                  <span className="text-xs font-mono text-gray-400">{auditLogs.length} events logged</span>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 text-xs flex items-start justify-between gap-3 font-mono"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-bold">{log.timestamp}</span>
                          <span className="text-[#EE8267] font-semibold">{log.actor} ({log.actorRole})</span>
                          <span className="text-purple-700 font-bold">[{log.action}]</span>
                        </div>
                        <p className="text-gray-700 font-sans mt-0.5 text-xs">{log.details}</p>
                      </div>
                      <span className="text-[10px] uppercase text-gray-400 font-bold">{log.category}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 14. SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 text-xs">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Verification & Escalation Thresholds
                </h1>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border border-gray-200 space-y-2">
                    <span className="font-bold text-sm block">Missed Care Alert Window</span>
                    <p className="text-gray-500">Minutes past scheduled time before a task transitions to "Not confirmed".</p>
                    <select className="px-3 py-1.5 rounded-xl border border-gray-300">
                      <option>30 minutes (Standard PRD)</option>
                      <option>15 minutes (Strict)</option>
                      <option>45 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 15. LIVE CARE ACTIVITY */}
            {activeTab === 'activity' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Live Care Activity Stream
                </h1>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-gray-100 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono text-gray-500 font-bold">{task.scheduledTime}</span>
                        <h3 className="font-bold text-[#38223A] mt-0.5">{task.title}</h3>
                        <p className="text-gray-500">Caregiver: {task.assignedHelperName}</p>
                      </div>
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Escalation Ladder Modal */}
      {selectedLadderEscalation && (
        <EscalationLadderModal
          escalation={selectedLadderEscalation}
          isOpen={!!selectedLadderEscalation}
          onClose={() => setSelectedLadderEscalation(null)}
        />
      )}
    </div>
  );
};
