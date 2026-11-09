import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { ShieldCheck, Clock, Check, Calendar, AlertCircle } from 'lucide-react';

export const HealthRemindersView: React.FC = () => {
  const { activePet, snoozeOrCompleteHealthRecord } = usePawsure();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Preventative Veterinary Health
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            Health & Preventive Reminders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Vaccination boosters, deworming cycles, and flea/tick tracking for {activePet.name}.
          </p>
        </div>

        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full">
          Up-to-Date
        </span>
      </div>

      {/* Health Records List */}
      <div className="space-y-3">
        {activePet.healthRecords.map((record) => {
          const isDueSoon = record.status === 'due_soon';
          return (
            <div
              key={record.id}
              className={`bg-white rounded-3xl p-5 border shadow-xs space-y-3 transition ${
                isDueSoon ? 'border-amber-300 bg-amber-50/20' : 'border-gray-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-2xl ${
                      isDueSoon
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-500">
                        {record.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isDueSoon
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isDueSoon ? 'Due Soon' : 'Valid & Up-to-date'}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#38223A] mt-0.5">
                      {record.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Administered: {record.dateAdministered} · Clinic: {record.vetClinic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => snoozeOrCompleteHealthRecord(record.id, 'snooze')}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Snooze 7d
                  </button>
                  <button
                    onClick={() => snoozeOrCompleteHealthRecord(record.id, 'completed')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Log Administered</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#EE8267]" />
                  <span>Next Due Date: <strong>{record.nextDueDate}</strong></span>
                </span>
                <span className="text-[11px] text-gray-400">Automatic push reminder enabled</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
