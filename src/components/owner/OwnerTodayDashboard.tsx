import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { StatusBadge } from '../common/StatusBadge';
import { CaregiverCheatSheetModal } from './CaregiverCheatSheetModal';
import { EscalationLadderModal } from '../common/EscalationLadderModal';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { CareTask, EscalationItem } from '../../types/pawsure';
import {
  ShieldAlert,
  Phone,
  MessageCircle,
  FileText,
  MapPin,
  Camera,
  CheckCircle2,
  Bell,
  Sun,
  AlertCircle,
  ExternalLink,
  Users,
  Compass,
  PhoneCall,
  Gift,
  FastForward
} from 'lucide-react';

interface OwnerTodayDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenRegisterWizard: () => void;
}

export const OwnerTodayDashboard: React.FC<OwnerTodayDashboardProps> = ({
  onNavigateTab,
  onOpenRegisterWizard
}) => {
  const {
    activePet,
    pets,
    setActivePetId,
    tasks,
    helper,
    helperCheckedIn,
    helperCheckInTime,
    checkInMethod,
    ownerConfirmTask,
    setRole,
    activeHandover,
    rewards,
    escalations,
    simulatedClock,
    advanceSimulatedTime
  } = usePawsure();

  const [selectedEvidenceTask, setSelectedEvidenceTask] = useState<CareTask | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [showSimulatedCall, setShowSimulatedCall] = useState<string | null>(null);
  const [activeLadderEscalation, setActiveLadderEscalation] = useState<EscalationItem | null>(null);

  // Compute status counts
  const confirmedCount = tasks.filter((t) => t.status === 'confirmed').length;
  const likelyCount = tasks.filter((t) => t.status === 'likely').length;
  const notConfirmedCount = tasks.filter((t) => t.status === 'not_confirmed').length;
  const upcomingCount = tasks.filter((t) => t.status === 'upcoming').length;
  const total = tasks.length || 1;
  const verifiedPercentage = Math.round((confirmedCount / total) * 100);

  const activeEsc = escalations.find((e) => e.status === 'active');

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Top Pet Switcher & Handover Status Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-[#EE8267]/20 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {pets.map((p) => {
            const isSelected = p.id === activePet.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePetId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#EE8267] text-white shadow-xs'
                    : 'bg-[#FFF9F3] text-[#38223A] hover:bg-[#FFF0E6]'
                }`}
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-6 h-6 rounded-full object-cover border border-white"
                />
                <span>{p.name}</span>
                <span className="text-[10px] opacity-80">({p.species.toUpperCase()})</span>
              </button>
            );
          })}
          <button
            onClick={onOpenRegisterWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-dashed border-[#EE8267] text-[#EE8267] hover:bg-[#FFF0E6] text-xs font-semibold shrink-0"
          >
            <span>+ Add Pet</span>
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onNavigateTab('rewards')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF9F3] border border-amber-200 text-amber-900 text-xs font-bold hover:bg-[#FFF0E6]"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600" />
            <span>{rewards.pointsBalance} pts</span>
          </button>

          <button
            onClick={() => onNavigateTab('handover')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF0E6] text-[#EE8267] text-xs font-bold hover:bg-[#F3D7EA] transition shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Handover ({activeHandover?.status || 'Open'})</span>
          </button>

          <button
            onClick={() => setShowCheatSheet(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition shrink-0"
          >
            <span>Cheat Sheet</span>
          </button>
        </div>
      </div>

      {/* Hero Pet Status Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFF0E6] via-[#FFF9F3] to-[#F3D7EA]/40 p-5 border border-[#EE8267]/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activePet.photo}
                alt={activePet.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-xs">
                <span className="block w-4 h-4 rounded-full bg-[#10B981] border-2 border-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EE8267]">
                  Today's Care Assurance
                </span>
                <span className="text-[11px] text-gray-500">· Clock: {simulatedClock}</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-[#38223A]">
                {activePet.name}'s Day
              </h1>
              <p className="text-xs text-[#38223A]/70 mt-0.5">
                {activePet.breed} · {activePet.ageYears} yrs {activePet.ageMonths} mos · {activePet.weightKg} kg
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-white/60 shadow-xs w-full sm:w-auto">
            <div className="flex items-center justify-between gap-4 text-center">
              <div>
                <span className="text-xl font-bold text-[#10B981]">{confirmedCount}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Confirmed</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="text-xl font-bold text-[#D97706]">{likelyCount}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Likely</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="text-xl font-bold text-[#EF4444]">{notConfirmedCount}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Unconfirmed</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="text-xl font-bold text-[#8B5CF6]">{upcomingCount}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-500 block">Upcoming</span>
              </div>
            </div>
            {/* Confidence Progress Bar */}
            <div className="mt-2.5 w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
              <div
                style={{ width: `${(confirmedCount / total) * 100}%` }}
                className="bg-[#10B981] h-full"
                title={`${confirmedCount} Confirmed`}
              />
              <div
                style={{ width: `${(likelyCount / total) * 100}%` }}
                className="bg-[#F59E0B] h-full"
                title={`${likelyCount} Likely`}
              />
              <div
                style={{ width: `${(notConfirmedCount / total) * 100}%` }}
                className="bg-[#EF4444] h-full"
                title={`${notConfirmedCount} Not Confirmed`}
              />
              <div
                style={{ width: `${(upcomingCount / total) * 100}%` }}
                className="bg-[#A78BFA] h-full"
                title={`${upcomingCount} Upcoming`}
              />
            </div>
          </div>
        </div>

        {/* Weather & Time Advancer snippet */}
        <div className="mt-4 pt-3 border-t border-[#EE8267]/15 flex flex-wrap items-center justify-between text-xs text-[#38223A]/80 gap-2">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>28°C Bellandur · AQI 74 (Moderate) · Shaded path walk recommended</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/70 px-2 py-1 rounded-xl border border-gray-200">
            <FastForward className="w-3.5 h-3.5 text-[#EE8267]" />
            <span className="text-[11px] font-bold">Fast Forward:</span>
            <button
              onClick={() => advanceSimulatedTime(15)}
              className="px-1.5 py-0.5 rounded bg-[#FFF0E6] text-[#EE8267] font-bold text-[10px] hover:bg-[#F3D7EA]"
            >
              +15m
            </button>
            <button
              onClick={() => advanceSimulatedTime(30)}
              className="px-1.5 py-0.5 rounded bg-[#FFF0E6] text-[#EE8267] font-bold text-[10px] hover:bg-[#F3D7EA]"
            >
              +30m
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL MISSED CARE ATTENTION BANNER (If any task is not confirmed) */}
      {notConfirmedCount > 0 && activeEsc && (
        <div className="rounded-3xl bg-rose-50 border-2 border-rose-300 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm text-rose-900">
                  Care Gap Detected: {activeEsc.title}
                </h2>
                <span className="text-[10px] font-mono bg-rose-200 text-rose-900 font-bold px-2 py-0.2 rounded-full">
                  Ladder: {activeEsc.currentStage}
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                Scheduled time passed by +{activeEsc.simulatedOverdueMins} mins. Visit arrival recorded, but task proof absent.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveLadderEscalation(activeEsc)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs text-center"
            >
              Inspect Escalation Ladder
            </button>
            <button
              onClick={() => onNavigateTab('friends')}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-white border border-rose-300 text-xs font-semibold text-rose-900 hover:bg-rose-100 transition text-center"
            >
              Backup Circle
            </button>
          </div>
        </div>
      )}

      {/* Caretaker Check-in Status Card (Showing Basic Phone vs GPS) */}
      <div className="rounded-3xl bg-white p-5 border border-[#38223A]/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={helper.avatar}
              alt={helper.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#A78BFA]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#EE8267] uppercase tracking-wider">
                  Assigned Caregiver
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ★ {helper.rating} Verified
                </span>
              </div>
              <h2 className="font-heading font-bold text-base text-[#38223A]">
                {helper.name}
              </h2>
              <p className="text-xs text-gray-500">
                {helper.experienceYears} yrs exp · {helper.completedSitsCount} completed sits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimulatedCall(helper.phone)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs font-semibold text-[#38223A] hover:bg-[#FFF0E6]"
            >
              <Phone className="w-3.5 h-3.5 text-[#EE8267]" />
              <span>Call</span>
            </button>
            <button
              onClick={() => setRole('helper')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#EE8267] text-white text-xs font-semibold hover:bg-[#E26D50] shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Helper View</span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
          <div className="flex items-center gap-1.5">
            {checkInMethod === 'basic_phone_missed_call' ? (
              <PhoneCall className="w-4 h-4 text-amber-600" />
            ) : (
              <MapPin className="w-4 h-4 text-emerald-600" />
            )}

            {helperCheckedIn ? (
              <span>
                <strong>Arrival Registered:</strong> {helperCheckInTime} · Method:{' '}
                <strong className="text-[#EE8267]">
                  {checkInMethod === 'basic_phone_missed_call'
                    ? 'Basic-Phone Missed Call (1800-PAWSURE)'
                    : 'GPS Geofence Match'}
                </strong>
              </span>
            ) : (
              <span className="text-amber-600">
                <strong>Checked Out</strong> · Not currently on premise
              </span>
            )}
          </div>

          <span className="text-[11px] text-gray-500">
            Aadhaar KYC: <strong className="font-mono text-gray-700">{helper.maskedAadhaar}</strong> (Verified)
          </span>
        </div>
      </div>

      {/* TODAY'S CARE TIMELINE & TASKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#38223A]">
              Today's Care Routine & Verification
            </h2>
            <p className="text-xs text-gray-500">
              Distinguishing Confirmed, Likely, Not confirmed and Upcoming.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('routine')}
            className="text-xs font-semibold text-[#EE8267] hover:underline"
          >
            Manage Routine →
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-3xl p-4.5 bg-white border transition-all ${
                task.status === 'confirmed'
                  ? 'border-emerald-200 shadow-xs'
                  : task.status === 'likely'
                  ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                  : task.status === 'not_confirmed'
                  ? 'border-rose-300 bg-rose-50/30 shadow-xs'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 ${
                      task.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'likely'
                        ? 'bg-amber-100 text-amber-800'
                        : task.status === 'not_confirmed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {task.category === 'walk' ? (
                      <Compass className="w-5 h-5" />
                    ) : task.category === 'food' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-gray-500">
                        {task.scheduledTime}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{task.estimatedDurationMins} mins</span>
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#38223A] mt-0.5">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">{task.instructions}</p>
                    {task.portionOrDistance && (
                      <p className="text-xs font-medium text-[#EE8267] mt-1">
                        Target: {task.portionOrDistance}
                      </p>
                    )}
                  </div>
                </div>

                {/* Evidence & Action Buttons */}
                <div className="flex items-center gap-2 sm:self-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  {task.evidence.length > 0 && (
                    <button
                      onClick={() => setSelectedEvidenceTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 text-xs font-semibold"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{task.evidence.length} Evidence</span>
                    </button>
                  )}

                  {task.status === 'likely' && (
                    <button
                      onClick={() => ownerConfirmTask(task.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                      title="Confirm this task based on caregiver notes"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Now (+20 pts)</span>
                    </button>
                  )}

                  {task.status === 'not_confirmed' && activeEsc && (
                    <button
                      onClick={() => setActiveLadderEscalation(activeEsc)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>View Escalation</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status explanation caption */}
              {task.notes && (
                <div className="mt-2.5 pt-2 border-t border-gray-100/70 text-[11px] text-gray-600 italic flex items-center gap-1.5">
                  <span className="font-semibold not-italic text-gray-500">Audit Note:</span>
                  <span>{task.notes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* QUICK EMERGENCY BAR */}
      <div className="rounded-3xl bg-rose-500 text-white p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-rose-200">
            Emergency Vet Card
          </span>
          <h2 className="font-heading font-bold text-lg">
            {activePet.primaryVet.clinic}
          </h2>
          <p className="text-xs text-rose-100 mt-0.5">
            {activePet.primaryVet.name} · {activePet.primaryVet.address}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`tel:${activePet.primaryVet.phone}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-rose-600 font-bold text-xs hover:bg-rose-50 shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>Call 24/7 Vet</span>
          </a>
          <button
            onClick={() => onNavigateTab('emergency')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-rose-600 border border-white/30 text-white font-semibold text-xs hover:bg-rose-700"
          >
            View Full Card
          </button>
        </div>
      </div>

      {/* EVIDENCE LOG MODAL */}
      {selectedEvidenceTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading font-bold text-base text-[#38223A]">
                Care Evidence Log
              </h3>
              <button
                onClick={() => setSelectedEvidenceTask(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#EE8267]">
                Task: {selectedEvidenceTask.title} ({selectedEvidenceTask.scheduledTime})
              </p>
              {selectedEvidenceTask.evidence.map((ev) => (
                <div key={ev.id} className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold uppercase text-gray-500 text-[10px]">
                      {ev.type.toUpperCase()} EVIDENCE
                    </span>
                    <span className="text-emerald-700 font-bold text-[11px]">
                      {ev.confidenceScore}% Confidence
                    </span>
                  </div>

                  {ev.url && (
                    <img
                      src={ev.url}
                      alt={ev.caption || 'Evidence'}
                      className="w-full h-44 rounded-xl object-cover border border-gray-200"
                    />
                  )}

                  <p className="text-gray-700">{ev.caption}</p>
                  {ev.isVisitProofOnly && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold inline-block">
                      Note: Proves arrival presence, not task execution.
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 block">Logged at {ev.timestamp}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedEvidenceTask(null)}
              className="w-full py-2.5 rounded-2xl bg-[#38223A] text-white text-xs font-semibold hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SIMULATED PHONE CALL DIALOG */}
      {showSimulatedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#38223A]">
                Calling {helper.name}...
              </h3>
              <p className="text-xs text-gray-500 font-mono mt-1">{showSimulatedCall}</p>
              <SimulatedBanner label="Simulated dialer demo in browser sandbox" className="mt-3 justify-center" />
            </div>
            <button
              onClick={() => setShowSimulatedCall(null)}
              className="w-full py-2.5 rounded-2xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Caregiver Cheat Sheet Modal */}
      <CaregiverCheatSheetModal
        pet={activePet}
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
      />

      {/* Escalation Ladder Modal */}
      {activeLadderEscalation && (
        <EscalationLadderModal
          escalation={activeLadderEscalation}
          isOpen={!!activeLadderEscalation}
          onClose={() => setActiveLadderEscalation(null)}
        />
      )}
    </div>
  );
};
