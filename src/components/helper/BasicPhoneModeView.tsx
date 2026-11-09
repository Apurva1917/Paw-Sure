import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { StatusBadge } from '../common/StatusBadge';
import {
  PhoneCall,
  PhoneForwarded,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronLeft,
  Volume2
} from 'lucide-react';

export const BasicPhoneModeView: React.FC<{ onSwitchToSmartphone?: () => void }> = ({
  onSwitchToSmartphone
}) => {
  const {
    helper,
    activePet,
    tasks,
    helperSimulateMissedCall,
    helperSimulateIVREntry,
    ivrLogs,
    checkInMethod,
    helperCheckInTime,
    helperCheckedIn
  } = usePawsure();

  // Simulated Feature Phone State
  const [dialedInput, setDialedInput] = useState('1800-PAWSURE');
  const [activeCallStatus, setActiveCallStatus] = useState<
    'idle' | 'calling_missed' | 'missed_recorded' | 'ivr_connected'
  >('idle');
  const [ivrStep, setIvrStep] = useState<'menu' | 'enter_code' | 'verified' | 'failed'>('menu');
  const [selectedTaskNumber, setSelectedTaskNumber] = useState<number>(1);
  const [keypadCode, setKeypadCode] = useState('');
  const [ivrVoicePrompt, setIvrVoicePrompt] = useState(
    'Welcome to Pawsure Toll-Free IVR. Press 1 for Morning Walk. Press 2 for Breakfast. Press 3 for Midday Potty.'
  );

  const handleTriggerMissedCall = () => {
    setActiveCallStatus('calling_missed');
    setTimeout(() => {
      helperSimulateMissedCall();
      setActiveCallStatus('missed_recorded');
      setTimeout(() => setActiveCallStatus('idle'), 4000);
    }, 1500);
  };

  const handleStartIVR = () => {
    setActiveCallStatus('ivr_connected');
    setIvrStep('menu');
    setKeypadCode('');
    setIvrVoicePrompt('Pawsure IVR connected. Press 1 for Task #1. Press 2 for Task #2. Press 3 for Task #3.');
  };

  const handleKeypadPress = (digit: string) => {
    if (activeCallStatus === 'ivr_connected') {
      if (ivrStep === 'menu') {
        const taskNum = parseInt(digit, 10);
        if (taskNum >= 1 && taskNum <= tasks.length) {
          setSelectedTaskNumber(taskNum);
          setIvrStep('enter_code');
          setIvrVoicePrompt(`You selected Task #${taskNum}: ${tasks[taskNum - 1]?.title}. Please enter the 4-digit household code followed by #.`);
        }
      } else if (ivrStep === 'enter_code') {
        if (digit === '#') {
          // Submit code
          const success = helperSimulateIVREntry(selectedTaskNumber, keypadCode);
          if (success) {
            setIvrStep('verified');
            setIvrVoicePrompt(`Thank you! Task #${selectedTaskNumber} has been verified as Confirmed. Your call is now complete.`);
          } else {
            setIvrStep('failed');
            setIvrVoicePrompt('Incorrect code entered. Please retry or contact the pet parent.');
          }
        } else if (keypadCode.length < 6) {
          setKeypadCode((prev) => prev + digit);
        }
      }
    } else {
      setDialedInput((prev) => prev + digit);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-24">
      {/* Simulation Banner */}
      <SimulatedBanner
        label="Basic-Phone Mode (Missed Call & IVR Keypad). Telephony events are simulated locally without third-party telco dependencies."
      />

      {/* Mode Switch Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSwitchToSmartphone}
          className="text-xs font-bold text-[#EE8267] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Switch to Smartphone (WhatsApp View)</span>
        </button>

        <span className="text-[11px] font-mono bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
          Feature-Phone Telephony Mode
        </span>
      </div>

      {/* FEATURE PHONE HARDSHELL HARDWARE CONTAINER */}
      <div className="bg-[#2D2A32] text-white rounded-3xl p-6 shadow-2xl border-4 border-gray-700 max-w-md mx-auto space-y-5">
        {/* LCD Screen */}
        <div className="bg-[#A4C2A5] text-[#1B3022] p-4 rounded-2xl font-mono text-xs border-2 border-[#82A284] shadow-inner space-y-2">
          <div className="flex justify-between text-[10px] border-b border-[#82A284] pb-1">
            <span>PAWSURE TELEPHONY</span>
            <span>SIM 1 · BSNL</span>
          </div>

          <div className="min-h-16 flex flex-col justify-center">
            {activeCallStatus === 'idle' && (
              <div>
                <p className="font-bold text-sm">Standby: {helper.phone}</p>
                <p className="text-[11px]">Dial 1800-PAWSURE to check in</p>
                {helperCheckedIn && (
                  <p className="text-[10px] text-emerald-900 font-bold mt-1">
                    ✓ Arrival Recorded: {helperCheckInTime}
                  </p>
                )}
              </div>
            )}

            {activeCallStatus === 'calling_missed' && (
              <p className="font-bold text-sm animate-pulse">
                Dialing 1800-PAWSURE... (Giving 1 Ring)
              </p>
            )}

            {activeCallStatus === 'missed_recorded' && (
              <div className="text-emerald-950 font-bold">
                <p>Call disconnected after 1 ring.</p>
                <p className="text-[10px]">VISIT ARRIVAL CONFIRMED</p>
                <p className="text-[9px] text-gray-700 italic">Task proof still required!</p>
              </div>
            )}

            {activeCallStatus === 'ivr_connected' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#1B3022]" />
                  <span>IVR CALL CONNECTED</span>
                </div>
                <p className="text-[11px] leading-tight">{ivrVoicePrompt}</p>
                {ivrStep === 'enter_code' && (
                  <p className="text-base font-bold tracking-widest mt-1">
                    Code: {keypadCode || '_ _ _ _'}#
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons for Basic Phone */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTriggerMissedCall}
            disabled={activeCallStatus !== 'idle'}
            className="py-3 px-3 rounded-2xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Give Missed Call (Arrival)</span>
          </button>

          <button
            onClick={handleStartIVR}
            disabled={activeCallStatus === 'ivr_connected'}
            className="py-3 px-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <PhoneForwarded className="w-4 h-4" />
            <span>Call IVR (Task Code)</span>
          </button>
        </div>

        {/* TACTILE KEYPAD */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKeypadPress(k)}
              className="py-3.5 rounded-2xl bg-gray-800 text-white font-mono text-base font-bold hover:bg-gray-700 active:bg-gray-600 shadow-md transition-all active:scale-95 flex flex-col items-center justify-center"
            >
              <span>{k}</span>
            </button>
          ))}
        </div>

        {activeCallStatus === 'ivr_connected' && (
          <button
            onClick={() => setActiveCallStatus('idle')}
            className="w-full py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
          >
            End IVR Call
          </button>
        )}
      </div>

      {/* CRITICAL VERIFICATION RULES BREAKDOWN */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#38223A] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#EE8267]" />
          Pawsure Telephony Evidence Rules
        </h3>
        <ul className="space-y-2 text-xs text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <span>
              <strong>Missed Call = Visit Arrival Proof ONLY:</strong> A missed call proves Sunita’s presence at the household location, but does <em>not</em> confirm that tasks (e.g. food eaten or walk done) were executed.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
            <span>
              <strong>IVR Keypad Entry = Task Confirmation:</strong> By pressing the task number and entering the secret 4-digit code (e.g. <strong className="font-mono">4829</strong>), the task is elevated to <strong>Confirmed</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <span>
              <strong>Absence of Task Proof:</strong> If only arrival is recorded and task proof remains missing past the scheduled window, the task turns <strong>Not confirmed</strong> and alerts the owner.
            </span>
          </li>
        </ul>
      </div>

      {/* TELEPHONY ACTIVITY LEDGER */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-sm text-[#38223A]">
          Telephony Event Activity Log ({ivrLogs.length})
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {ivrLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 text-xs font-mono space-y-1"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="font-bold text-[#38223A]">{log.eventType.toUpperCase()}</span>
                <span>{log.timestamp}</span>
              </div>
              <p className="text-gray-700 font-sans text-xs">{log.statusText}</p>
              {log.recognizedAsVisitProofOnly && (
                <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold inline-block">
                  Visit Proof Only (Task Proof Absent)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
