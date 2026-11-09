import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { EscalationItem, EscalationLadderStage } from '../../types/pawsure';
import {
  AlertTriangle,
  Clock,
  Bell,
  CheckCircle2,
  Users,
  Compass,
  FastForward,
  ShieldAlert,
  X
} from 'lucide-react';

interface EscalationLadderModalProps {
  escalation: EscalationItem;
  isOpen: boolean;
  onClose: () => void;
}

export const EscalationLadderModal: React.FC<EscalationLadderModalProps> = ({
  escalation,
  isOpen,
  onClose
}) => {
  const {
    simulatedClock,
    advanceSimulatedTime,
    ownerAcknowledgeEscalation,
    ownerTriggerBackup,
    resolveEscalation
  } = usePawsure();

  if (!isOpen) return null;

  const ladderStages: { id: EscalationLadderStage; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'task_due', label: '1. Task Due', desc: 'Task window opens at scheduled time (01:30 PM)', icon: Clock },
    { id: 'helper_reminder', label: '2. Helper Reminder', desc: '15m elapsed: Automated SMS sent to Sunita', icon: Bell },
    { id: 'owner_missed_alert', label: '3. Owner Missed Alert', desc: '30m elapsed: Status becomes "Not confirmed", push alert to Neha', icon: AlertTriangle },
    { id: 'owner_acknowledged', label: '4. Owner Acknowledged', desc: 'Neha acknowledges care gap notification', icon: CheckCircle2 },
    { id: 'backup_notified', label: '5. Backup Circle Standby', desc: '45m-60m elapsed: Alert sent to nearby pet parents & sitters', icon: Users },
    { id: 'find_cover_suggested', label: '6. Find Cover Dispatched', desc: 'Automated booking broadcast to 3 nearby verified sitters', icon: Compass },
    { id: 'resolved', label: '7. Incident Resolved', desc: 'Care verified, backup arrived or owner intervened', icon: ShieldAlert }
  ];

  const currentStageIndex = ladderStages.findIndex((s) => s.id === escalation.currentStage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-rose-200 my-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="font-heading font-bold text-base text-[#38223A]">
                Missed-Care Escalation Ladder
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Target Task: {escalation.title} (Simulated Overdue: +{escalation.simulatedOverdueMins} mins)
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TIME ADVANCEMENT SIMULATION CONTROLS */}
        <div className="p-3.5 rounded-2xl bg-[#FFF0E6] border border-[#EE8267]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#38223A] flex items-center gap-1.5">
              <FastForward className="w-4 h-4 text-[#EE8267]" />
              <span>Advance Time to Test Escalation Ladder</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#EE8267]">
              Current Time: {simulatedClock}
            </span>
          </div>
          <p className="text-[11px] text-gray-600">
            Simulate time passage immediately without waiting in real time:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => advanceSimulatedTime(15)}
              className="flex-1 py-1.5 rounded-xl bg-white border border-[#EE8267] text-[#EE8267] text-xs font-bold hover:bg-[#FFF9F3]"
            >
              +15 Mins
            </button>
            <button
              onClick={() => advanceSimulatedTime(30)}
              className="flex-1 py-1.5 rounded-xl bg-white border border-[#EE8267] text-[#EE8267] text-xs font-bold hover:bg-[#FFF9F3]"
            >
              +30 Mins
            </button>
            <button
              onClick={() => advanceSimulatedTime(45)}
              className="flex-1 py-1.5 rounded-xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50]"
            >
              +45 Mins (Trigger Backup)
            </button>
          </div>
        </div>

        {/* 7-STAGE ESCALATION LADDER TIMELINE */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-500">
            7-Stage Escalation Ladder Progression
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {ladderStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isPast = idx < currentStageIndex || escalation.status === 'resolved';
              const isCurrent = idx === currentStageIndex && escalation.status !== 'resolved';

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-3 transition ${
                    isCurrent
                      ? 'bg-rose-50 border-rose-300 shadow-xs'
                      : isPast
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-gray-50/60 border-gray-100 opacity-60'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isCurrent
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#38223A]">{stage.label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                          isCurrent
                            ? 'bg-rose-200 text-rose-800'
                            : isPast
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCurrent ? 'ACTIVE NOW' : isPast ? 'COMPLETED' : 'QUEUED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OWNER & ADMIN ACTION CONTROLS */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2 text-xs">
          {escalation.status === 'active' && (
            <>
              {escalation.currentStage !== 'owner_acknowledged' && (
                <button
                  onClick={() => ownerAcknowledgeEscalation(escalation.id)}
                  className="flex-1 py-2.5 rounded-2xl bg-amber-500 text-black font-bold hover:bg-amber-400 shadow-xs"
                >
                  Step 4: Owner Acknowledge Alert
                </button>
              )}

              {escalation.currentStage !== 'find_cover_suggested' && (
                <button
                  onClick={() => ownerTriggerBackup(escalation.id)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#EE8267] text-white font-bold hover:bg-[#E26D50] shadow-xs"
                >
                  Step 6: Trigger Backup Sitter
                </button>
              )}

              <button
                onClick={() => {
                  resolveEscalation(escalation.id, 'Helper reached location; care verified.');
                  onClose();
                }}
                className="py-2.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
              >
                Resolve Incident
              </button>
            </>
          )}

          {escalation.status === 'resolved' && (
            <div className="w-full text-center text-xs text-emerald-700 font-bold bg-emerald-50 py-2 rounded-2xl border border-emerald-200">
              ✓ This escalation has been fully resolved and archived in the audit ledger.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
