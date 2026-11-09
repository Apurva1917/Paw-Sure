import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { CareTask } from '../../types/pawsure';
import { StatusBadge } from '../common/StatusBadge';
import { HelperVerificationScreen } from './HelperVerificationScreen';
import { BasicPhoneModeView } from './BasicPhoneModeView';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { BRUNO_PHOTO } from '../../data/mockData';
import {
  Send,
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Clock,
  Key,
  ChevronRight,
  Info,
  X,
  MessageSquare,
  PhoneCall,
  FileText,
  XCircle,
  ThumbsUp
} from 'lucide-react';

export const HelperWhatsAppView: React.FC = () => {
  const {
    helper,
    activePet,
    tasks,
    helperCheckedIn,
    helperCheckInTime,
    checkInMethod,
    helperCheckInToggle,
    helperMarkTaskDone,
    helperSubmitEvidence,
    helperReportProblem,
    activeHandover,
    helperAcknowledgeHandover,
    helperDeclineHandover
  } = usePawsure();

  const [viewVerification, setViewVerification] = useState(false);
  const [viewBasicPhone, setViewBasicPhone] = useState(helper.interfaceMode === 'basic_phone');
  const [activeTaskForEvidence, setActiveTaskForEvidence] = useState<CareTask | null>(null);
  const [evidenceType, setEvidenceType] = useState<'photo' | 'voice' | 'code'>('photo');
  const [evidenceCaption, setEvidenceCaption] = useState('');
  const [securityCodeInput, setSecurityCodeInput] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);

  // Handover decline modal
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('Pet is exhibiting severe aggression / safety hazard');

  // Problem reporting modal
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [problemSeverity, setProblemSeverity] = useState<'low' | 'medium' | 'urgent'>('medium');

  // WhatsApp chat simulation
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'helper' | 'owner'; text: string; time: string }[]
  >([
    {
      sender: 'owner',
      text: 'Good morning Sunita! Bruno is excited for his morning walk. Please check the handover notes for today.',
      time: '07:15 AM'
    },
    {
      sender: 'helper',
      text: 'Good morning Neha ji! Yes, reached at 7:34 AM. Bruno is happily walking in the shaded park path right now.',
      time: '07:35 AM'
    },
    {
      sender: 'owner',
      text: 'Wonderful, please ensure he drinks fresh water after returning!',
      time: '08:15 AM'
    }
  ]);

  if (viewVerification) {
    return <HelperVerificationScreen onBack={() => setViewVerification(false)} />;
  }

  if (viewBasicPhone) {
    return <BasicPhoneModeView onSwitchToSmartphone={() => setViewBasicPhone(false)} />;
  }

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      { sender: 'helper', text: chatMessage, time: nowStr }
    ]);
    setChatMessage('');
  };

  const handleStartVoice = () => {
    setIsRecordingVoice(true);
    setVoiceSeconds(0);
    const interval = setInterval(() => {
      setVoiceSeconds((s) => {
        if (s >= 5) {
          clearInterval(interval);
          setIsRecordingVoice(false);
          return 5;
        }
        return s + 1;
      });
    }, 1000);
  };

  const handleSubmitEvidence = () => {
    if (!activeTaskForEvidence) return;

    if (evidenceType === 'photo') {
      helperSubmitEvidence(activeTaskForEvidence.id, 'photo', {
        url: BRUNO_PHOTO,
        caption: evidenceCaption || `Photo of ${activePet.name} care task verification`
      });
    } else if (evidenceType === 'voice') {
      helperSubmitEvidence(activeTaskForEvidence.id, 'voice', {
        caption: `Voice update: "${evidenceCaption || 'Care completed and Bruno is settled.'}"`
      });
    } else if (evidenceType === 'code') {
      helperSubmitEvidence(activeTaskForEvidence.id, 'code', {
        code: securityCodeInput,
        caption: `Household code ${securityCodeInput} entered`
      });
    }

    setActiveTaskForEvidence(null);
    setEvidenceCaption('');
    setSecurityCodeInput('');
  };

  const handleReportProblem = () => {
    if (!problemTitle.trim() || !problemDesc.trim()) {
      alert('Please fill out problem title and details.');
      return;
    }
    helperReportProblem(problemTitle, problemDesc, problemSeverity);
    setShowProblemModal(false);
    setProblemTitle('');
    setProblemDesc('');
    alert('Problem report logged and escalated to Owner & Admin!');
  };

  const handleConfirmDecline = () => {
    if (activeHandover) {
      helperDeclineHandover(activeHandover.id, declineReason);
    }
    setShowDeclineModal(false);
    alert('Assignment safely declined. Owner and Admin have been notified to arrange backup care.');
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-4">
      {/* Simulation Notice */}
      <SimulatedBanner label="WhatsApp UI demo & GPS check-in are simulated for caretaker workflow testing." />

      {/* WhatsApp Styled Mobile Frame */}
      <div className="rounded-3xl bg-[#ECE5DD] border border-[#075E54]/30 shadow-lg overflow-hidden flex flex-col">
        {/* WhatsApp Top Bar */}
        <div className="bg-[#075E54] text-white p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activePet.photo}
                alt={activePet.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#075E54]" />
            </div>
            <div>
              <h2 className="font-semibold text-sm leading-tight text-white flex items-center gap-1.5">
                <span>Neha Kapoor · {activePet.name}'s Care</span>
              </h2>
              <span className="text-[11px] text-emerald-200">
                Pawsure Care Protocol Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewBasicPhone(true)}
              className="px-2.5 py-1 rounded-full bg-amber-500 text-black hover:bg-amber-400 text-[11px] font-bold flex items-center gap-1 shadow-xs"
              title="Open Basic Phone missed call & IVR simulator"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Basic Phone</span>
            </button>
            <button
              onClick={() => setViewVerification(true)}
              className="px-2.5 py-1 rounded-full bg-white/15 text-white hover:bg-white/25 text-[11px] font-medium flex items-center gap-1"
              title="View your verified caregiver badge & KYC"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">KYC</span>
            </button>
          </div>
        </div>

        {/* PHASE 3: DAILY CARE HANDOVER ACKNOWLEDGEMENT CARD */}
        {activeHandover && (
          <div
            className={`p-3.5 border-b text-xs transition-all ${
              activeHandover.status === 'acknowledged'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : activeHandover.status === 'declined'
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#EE8267] mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Today's Daily Care Handover</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        activeHandover.status === 'acknowledged'
                          ? 'bg-emerald-200 text-emerald-800'
                          : activeHandover.status === 'declined'
                          ? 'bg-rose-200 text-rose-800'
                          : 'bg-amber-200 text-amber-800'
                      }`}
                    >
                      {activeHandover.status === 'acknowledged'
                        ? 'Acknowledged'
                        : activeHandover.status === 'declined'
                        ? 'Declined'
                        : 'Awaiting Your Sign-off'}
                    </span>
                  </div>
                  <p className="text-[11px] mt-1 text-gray-700">
                    Health: <strong>{activeHandover.petHealthCondition}</strong> · Appetite: <strong>{activeHandover.appetiteStatus}</strong>
                  </p>
                  {activeHandover.newSymptomsNotes && (
                    <p className="text-[11px] text-amber-900 mt-0.5">
                      <strong>Observation:</strong> "{activeHandover.newSymptomsNotes}"
                    </p>
                  )}
                  {activeHandover.specialPrecautionsToday && (
                    <p className="text-[11px] text-rose-900 font-semibold mt-0.5">
                      <strong>Precaution:</strong> {activeHandover.specialPrecautionsToday}
                    </p>
                  )}
                </div>
              </div>

              {activeHandover.status === 'pending_acknowledgement' && (
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => helperAcknowledgeHandover(activeHandover.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-xs"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Acknowledge</span>
                  </button>
                  <button
                    onClick={() => setShowDeclineModal(true)}
                    className="px-2 py-1 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-[11px] font-semibold hover:bg-rose-100"
                  >
                    Decline Care
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GPS VISIT CHECK-IN MODULE (With Check-in Method Indicator) */}
        <div className="bg-white p-4 border-b border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">
                  Caretaker Presence Status
                </span>
                {checkInMethod === 'basic_phone_missed_call' && (
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full font-bold">
                    Checked in via Basic Phone
                  </span>
                )}
                {checkInMethod === 'gps' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full font-bold">
                    Checked in via GPS
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#38223A] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-[#EE8267]" />
                <span>Green Glen Layout, Apt 402, Bellandur</span>
              </p>
              <span className="text-[11px] text-gray-500">
                {helperCheckedIn ? `Arrived at ${helperCheckInTime}` : 'Not checked in yet'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewBasicPhone(true)}
                className="px-3 py-2 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                title="Switch to basic phone keypad"
              >
                Missed Call
              </button>
              <button
                onClick={() => helperCheckInToggle()}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  helperCheckedIn
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{helperCheckedIn ? 'Check Out' : 'GPS Check In'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ASSIGNED CARE TASKS FEED */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#38223A]">
              Assigned Tasks for Today ({tasks.length})
            </h3>
            <button
              onClick={() => setShowProblemModal(true)}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-gray-700">
                        {task.scheduledTime}
                      </span>
                      <span className="text-gray-300">·</span>
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                    <h4 className="font-bold text-sm text-[#38223A] mt-0.5">{task.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{task.instructions}</p>
                    {task.portionOrDistance && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-[#EE8267]">
                        Target: {task.portionOrDistance}
                      </span>
                    )}
                  </div>
                </div>

                {/* HELPER ACTION BUTTONS */}
                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Mark Done button (Creates "Likely" status, NOT confirmed!) */}
                    <button
                      disabled={task.helperMarkedDone}
                      onClick={() => helperMarkTaskDone(task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                        task.helperMarkedDone
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-[#FFF0E6] text-[#EE8267] hover:bg-[#F3D7EA] border border-[#EE8267]/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{task.helperMarkedDone ? 'Marked Done' : 'Mark Done'}</span>
                    </button>

                    {/* Submit Evidence button (Elevates to Confirmed!) */}
                    <button
                      onClick={() => {
                        setActiveTaskForEvidence(task);
                        setEvidenceType('photo');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EE8267] text-white hover:bg-[#E26D50] flex items-center gap-1 shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>+ Evidence (Verify)</span>
                    </button>
                  </div>

                  {task.evidence.length > 0 && (
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ {task.evidence.length} evidence attached
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SIMULATED WHATSAPP CHAT STREAM */}
          <div className="pt-3 border-t border-gray-300 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block text-center">
              Caregiver & Pet Parent Chat
            </span>
            <div className="space-y-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'helper' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-2.5 text-xs shadow-xs ${
                      msg.sender === 'helper'
                        ? 'bg-[#DCF8C6] text-[#38223A] rounded-tr-xs'
                        : 'bg-white text-[#38223A] rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-gray-400 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Type update to Neha..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                className="flex-1 px-3 py-2 rounded-2xl bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#075E54]"
              />
              <button
                onClick={handleSendChat}
                className="p-2 rounded-2xl bg-[#075E54] text-white hover:bg-[#064e46]"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DECLINE HANDOVER MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-2 border-b border-rose-100">
              <XCircle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base text-rose-900">
                Safely Decline Assignment
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              If handling precautions cannot be met or the pet appears dangerously unwell/aggressive, caregivers may safely decline without penalty.
            </p>
            <div className="space-y-2 text-xs">
              <label className="block font-semibold">Select Reason</label>
              <select
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200"
              >
                <option value="Pet is exhibiting severe aggression / safety hazard">Pet is exhibiting severe aggression / safety hazard</option>
                <option value="Pet appears dangerously lethargic / medical emergency">Pet appears dangerously lethargic / medical emergency</option>
                <option value="Safety harness / equipment damaged">Safety harness / equipment damaged</option>
                <option value="Caregiver sudden illness / emergency">Caregiver sudden illness / emergency</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Decline & Alert Owner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE SUBMISSION MODAL */}
      {activeTaskForEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold uppercase text-[#EE8267]">
                  Submit Proof of Care
                </span>
                <h3 className="font-heading font-bold text-base text-[#38223A]">
                  {activeTaskForEvidence.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskForEvidence(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Evidence Type Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setEvidenceType('photo')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border ${
                  evidenceType === 'photo'
                    ? 'bg-[#EE8267] text-white border-[#EE8267]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>
              <button
                onClick={() => setEvidenceType('voice')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border ${
                  evidenceType === 'voice'
                    ? 'bg-[#EE8267] text-white border-[#EE8267]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Note</span>
              </button>
              <button
                onClick={() => setEvidenceType('code')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border ${
                  evidenceType === 'code'
                    ? 'bg-[#EE8267] text-white border-[#EE8267]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Care Code</span>
              </button>
            </div>

            {/* PHOTO EVIDENCE */}
            {evidenceType === 'photo' && (
              <div className="space-y-3 text-xs">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={BRUNO_PHOTO}
                    alt="Captured preview"
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    GPS & Timestamp Watermark: 12.9254° N, 77.6749° E
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Photo Caption</label>
                  <input
                    type="text"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    placeholder="e.g. Bruno happily finished his morning walk"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* VOICE NOTE */}
            {evidenceType === 'voice' && (
              <div className="space-y-3 text-xs text-center p-4 bg-[#FFF9F3] rounded-2xl border border-gray-200">
                <div className="w-16 h-16 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] flex items-center justify-center mx-auto">
                  <Mic className="w-8 h-8" />
                </div>
                {isRecordingVoice ? (
                  <div className="space-y-1">
                    <p className="font-bold text-rose-600 animate-pulse">
                      Recording Audio... {voiceSeconds}s / 5s
                    </p>
                    <p className="text-[11px] text-gray-500">Say your update for the pet parent</p>
                  </div>
                ) : (
                  <button
                    onClick={handleStartVoice}
                    className="px-4 py-2 rounded-xl bg-[#A78BFA] text-white font-semibold"
                  >
                    Hold to Record Audio Clip
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Summary text of voice note..."
                  value={evidenceCaption}
                  onChange={(e) => setEvidenceCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-left"
                />
              </div>
            )}

            {/* SECURITY CARE CODE */}
            {evidenceType === 'code' && (
              <div className="space-y-3 text-xs text-center p-4 bg-[#FFF0E6] rounded-2xl border border-[#EE8267]/30">
                <Key className="w-8 h-8 text-[#EE8267] mx-auto" />
                <div>
                  <h4 className="font-bold text-[#38223A]">Enter Household Security Code</h4>
                  <p className="text-[11px] text-gray-600">
                    Given by Neha Kapoor (Default demo code is <strong>4829</strong>)
                  </p>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="4829"
                  value={securityCodeInput}
                  onChange={(e) => setSecurityCodeInput(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#EE8267] font-mono text-center tracking-widest text-lg font-bold bg-white text-[#38223A]"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTaskForEvidence(null)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEvidence}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
              >
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROBLEM / INCIDENT REPORTING MODAL */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-2 border-b border-rose-100">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base text-rose-900">
                Report Care Incident / Problem
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'urgent'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setProblemSeverity(sev)}
                      className={`py-1.5 rounded-xl capitalize font-semibold border ${
                        problemSeverity === sev
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bruno refused kibble / slight right paw limp"
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Observation</label>
                <textarea
                  rows={3}
                  placeholder="Describe exact signs, time observed, and what you did..."
                  value={problemDesc}
                  onChange={(e) => setProblemDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowProblemModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReportProblem}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
