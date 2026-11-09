import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Sparkles,
  HelpCircle,
  X,
  FastForward,
  RotateCcw
} from 'lucide-react';

export const DemoScenarioRunner: React.FC<{ onNavigateOwnerTab?: (tab: string) => void }> = ({
  onNavigateOwnerTab
}) => {
  const { demoStep, runDemoStep, resetDemoData, role, setRole } = usePawsure();
  const [isOpen, setIsOpen] = useState(true);

  const scenarioSteps = [
    {
      num: 1,
      title: '1. Neha logs in',
      desc: 'Owner authenticates with simulated phone & OTP.',
      role: 'owner',
      tab: 'today'
    },
    {
      num: 2,
      title: '2. Daily health handover updated',
      desc: 'Neha records Bruno scratching right ear & harness precaution.',
      role: 'owner',
      tab: 'handover'
    },
    {
      num: 3,
      title: '3. Sunita acknowledges care instructions',
      desc: 'Caretaker reviews daily diffs & accepts session.',
      role: 'helper',
      tab: ''
    },
    {
      num: 4,
      title: '4. Sunita checks in via basic-phone mode',
      desc: 'Simulates toll-free missed call on 1800-PAWSURE.',
      role: 'helper',
      tab: ''
    },
    {
      num: 5,
      title: '5. Visit arrival logged (Task proof absent)',
      desc: 'System verifies arrival; task remains Unverified.',
      role: 'owner',
      tab: 'today'
    },
    {
      num: 6,
      title: '6. Task proof becomes overdue (+45m)',
      desc: 'Clock advances; task turns Not Confirmed.',
      role: 'owner',
      tab: 'today'
    },
    {
      num: 7,
      title: '7. Neha receives missed-care alert',
      desc: 'Active escalation banner alerts pet parent.',
      role: 'owner',
      tab: 'today'
    },
    {
      num: 8,
      title: '8. Neha arranges backup care',
      desc: 'Alert acknowledged; backup circle notified.',
      role: 'owner',
      tab: 'friends'
    },
    {
      num: 9,
      title: '9. Admin reviews incident & audit timeline',
      desc: 'Ops staff inspects telephony log & escalation ladder.',
      role: 'admin',
      tab: ''
    },
    {
      num: 10,
      title: '10. Task verified via IVR & rewards update',
      desc: 'Sunita enters code 4829 on IVR; points unlocked.',
      role: 'owner',
      tab: 'rewards'
    }
  ];

  const handleStepClick = (stepNum: number) => {
    runDemoStep(stepNum);
    const target = scenarioSteps[stepNum - 1];
    if (target?.tab && onNavigateOwnerTab && target.role === 'owner') {
      onNavigateOwnerTab(target.tab);
    }
  };

  const handleNext = () => {
    const nextStep = demoStep >= 10 ? 1 : demoStep + 1;
    handleStepClick(nextStep);
  };

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50">
      <div className="bg-[#38223A] text-white rounded-3xl p-4 shadow-2xl border border-white/20 backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-left"
          >
            <span className="p-1 rounded-lg bg-[#EE8267] text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-heading font-bold text-xs block leading-tight text-white">
                Interactive 10-Step Demo Runner
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                Step {demoStep} of 10 Active
              </span>
            </div>
            {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400 ml-1" /> : <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                resetDemoData();
                handleStepClick(1);
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
              title="Reset Demo to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="px-2.5 py-1 rounded-full bg-[#EE8267] hover:bg-[#E26D50] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
            {scenarioSteps.map((s) => {
              const isCurrent = s.num === demoStep;
              const isCompleted = s.num < demoStep;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => handleStepClick(s.num)}
                  className={`w-full text-left p-2 rounded-2xl transition flex items-start gap-2.5 text-xs ${
                    isCurrent
                      ? 'bg-[#EE8267] text-white font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-white/10 text-white/80 hover:bg-white/15'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                      isCurrent
                        ? 'bg-white text-[#EE8267] font-bold'
                        : isCompleted
                        ? 'bg-emerald-400 text-black'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {isCompleted ? '✓' : s.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold">{s.title}</p>
                    <p className={`text-[10px] truncate ${isCurrent ? 'text-white/90' : 'text-gray-400'}`}>
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
