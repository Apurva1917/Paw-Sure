import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { DailyCareHandover } from '../../types/pawsure';
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Heart,
  Utensils,
  Droplets,
  Compass,
  ShieldAlert,
  Phone,
  Sparkles,
  Edit3,
  Calendar,
  Send
} from 'lucide-react';

export const DailyCareHandoverView: React.FC = () => {
  const { activePet, activeHandover, createOrUpdateHandover, setRole } = usePawsure();

  const [isEditing, setIsEditing] = useState(!activeHandover);
  const [healthCondition, setHealthCondition] = useState<DailyCareHandover['petHealthCondition']>(
    activeHandover?.petHealthCondition || 'healthy'
  );
  const [appetite, setAppetite] = useState<DailyCareHandover['appetiteStatus']>(
    activeHandover?.appetiteStatus || 'normal'
  );
  const [waterIntake, setWaterIntake] = useState<DailyCareHandover['waterIntakeStatus']>(
    activeHandover?.waterIntakeStatus || 'normal'
  );
  const [newSymptoms, setNewSymptoms] = useState(
    activeHandover?.newSymptomsNotes || 'Bruno scratched his right ear twice yesterday evening. Check gently.'
  );
  const [todayFeeding, setTodayFeeding] = useState(
    activeHandover?.todayFeedingNotes || 'Warm chicken broth for 10s extra as morning was slightly chilly.'
  );
  const [todayWalk, setTodayWalk] = useState(
    activeHandover?.todayWalkExerciseNotes || 'Stick to shaded lake trail. Avoid lawn with fresh sprinkler mud.'
  );
  const [specialPrecautions, setSpecialPrecautions] = useState(
    activeHandover?.specialPrecautionsToday || 'Front-clip harness strictly requested; neighbor beagle walking around 7:45 AM.'
  );
  const [vetAcknowledged, setVetAcknowledged] = useState(activeHandover?.vetGuidanceAcknowledged ?? false);

  const handleSaveHandover = () => {
    createOrUpdateHandover({
      petHealthCondition: healthCondition,
      appetiteStatus: appetite,
      waterIntakeStatus: waterIntake,
      newSymptomsNotes: newSymptoms,
      todayFeedingNotes: todayFeeding,
      todayWalkExerciseNotes: todayWalk,
      specialPrecautionsToday: specialPrecautions,
      vetGuidanceAcknowledged: vetAcknowledged
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Daily Care Session Handover
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            {activePet.name}’s Handover Card (Today)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Record any overnight health changes, today’s specific diet overrides, and safety precautions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeHandover?.status === 'acknowledged' && (
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledged by Caretaker</span>
            </span>
          )}
          {activeHandover?.status === 'pending_acknowledgement' && (
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Awaiting Sitter Sign-off</span>
            </span>
          )}
          {activeHandover?.status === 'declined' && (
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Caretaker Declined</span>
            </span>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-2xl bg-[#FFF0E6] text-[#EE8267] text-xs font-bold hover:bg-[#F3D7EA] flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Notes</span>
            </button>
          )}
        </div>
      </div>

      {/* VET GUIDANCE BANNER (If pet is reported unwell or has minor issue) */}
      {(healthCondition === 'unwell' || healthCondition === 'minor_issue') && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-rose-100 text-rose-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-sm text-rose-900">
                Veterinary Advisory Guidance (Non-Diagnostic Notice)
              </h2>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Pawsure does not diagnose medical conditions. If {activePet.name} is showing sudden lethargy, refusal of water, continuous vomiting, or persistent pain, please reach out to your veterinarian immediately before leaving them in secondary care.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-rose-200">
            <a
              href={`tel:${activePet.primaryVet.phone}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Primary Vet ({activePet.primaryVet.phone})</span>
            </a>

            <div className="flex items-center gap-2 text-xs text-rose-900">
              <input
                type="checkbox"
                id="vetAckCheck"
                checked={vetAcknowledged}
                onChange={(e) => setVetAcknowledged(e.target.checked)}
                className="rounded text-rose-600"
              />
              <label htmlFor="vetAckCheck">
                I have noted this condition and accept responsibility for today's care assignment.
              </label>
            </div>
          </div>
        </div>
      )}

      {/* EDIT HANDOVER FORM */}
      {isEditing ? (
        <div className="bg-white rounded-3xl p-6 border border-[#EE8267]/20 shadow-sm space-y-5">
          <h2 className="font-heading font-bold text-base text-[#38223A] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#EE8267]" />
            Record Today’s Care Handover (Nov 7, 2026)
          </h2>

          <div className="space-y-4 text-xs">
            {/* Health Condition */}
            <div>
              <label className="block font-semibold mb-1">Health Condition Today</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'healthy', label: 'Healthy & Normal 🟢', desc: 'Active, bright eyes' },
                  { id: 'minor_issue', label: 'Minor Concern 🟡', desc: 'Slight itch or scratch' },
                  { id: 'unwell', label: 'Unwell / Needs Watch 🔴', desc: 'Requires vet vigilance' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHealthCondition(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      healthCondition === item.id
                        ? 'border-[#EE8267] bg-[#FFF0E6] text-[#38223A] font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="block text-xs">{item.label}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appetite & Water Intake */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Appetite Today</label>
                <select
                  value={appetite}
                  onChange={(e) => setAppetite(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="normal">Normal (Eats eagerly)</option>
                  <option value="reduced">Reduced (Ate half bowl)</option>
                  <option value="increased">Increased appetite</option>
                  <option value="refused">Refused breakfast</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Water Intake Today</label>
                <select
                  value={waterIntake}
                  onChange={(e) => setWaterIntake(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="reduced">Drinking less than usual</option>
                  <option value="increased">Drinking more frequently</option>
                </select>
              </div>
            </div>

            {/* Symptoms note */}
            <div>
              <label className="block font-semibold mb-1">New Symptoms / Behavioral Notes</label>
              <textarea
                rows={2}
                value={newSymptoms}
                onChange={(e) => setNewSymptoms(e.target.value)}
                placeholder="e.g. Scratched right ear twice yesterday evening. Check gently."
                className="w-full p-3 rounded-2xl border border-gray-200 text-xs"
              />
            </div>

            {/* Today's Feeding Notes */}
            <div>
              <label className="block font-semibold mb-1">Today's Specific Meal Instructions</label>
              <input
                type="text"
                value={todayFeeding}
                onChange={(e) => setTodayFeeding(e.target.value)}
                placeholder="e.g. Warm chicken broth for 10s extra as morning was chilly"
                className="w-full p-2.5 rounded-xl border border-gray-200"
              />
            </div>

            {/* Special Precautions */}
            <div>
              <label className="block font-semibold text-rose-700 mb-1">Special Precautions for Today</label>
              <input
                type="text"
                value={specialPrecautions}
                onChange={(e) => setSpecialPrecautions(e.target.value)}
                placeholder="e.g. Front-clip harness strictly requested; neighbor beagle walking around 7:45 AM"
                className="w-full p-2.5 rounded-xl border border-rose-200 bg-rose-50/40"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {activeHandover && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveHandover}
              className="flex-1 py-2.5 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save & Dispatch to Caretaker Sunita</span>
            </button>
          </div>
        </div>
      ) : (
        /* READ-ONLY DATED CARE HANDOVER CARD */
        <div className="bg-white rounded-3xl p-6 border border-[#EE8267]/20 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src={activePet.photo}
                alt={activePet.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#EE8267]"
              />
              <div>
                <h3 className="font-heading font-bold text-base text-[#38223A]">
                  {activePet.name} · Daily Care Handover
                </h3>
                <p className="text-xs text-gray-500">
                  Created at {activeHandover?.createdAt} · Assigned to Sunita Sharma
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Today's Health Rating</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {activeHandover?.petHealthCondition.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Overrides / Diff Strip */}
          {activeHandover?.diffSummary && activeHandover.diffSummary.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#FFF0E6] border border-[#EE8267]/30 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#EE8267] block">
                Today's Overrides from Permanent Profile (Diff)
              </span>
              <ul className="space-y-1 text-xs text-[#38223A]">
                {activeHandover.diffSummary.map((diff, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EE8267]" />
                    <span>{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Appetite & Water</span>
              <p><strong>Appetite:</strong> {activeHandover?.appetiteStatus}</p>
              <p><strong>Water Intake:</strong> {activeHandover?.waterIntakeStatus}</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Meal Customization</span>
              <p>{activeHandover?.todayFeedingNotes || 'Standard portions as per permanent routine.'}</p>
            </div>

            <div className="col-span-1 sm:col-span-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Special Precautions</span>
              <p className="text-rose-900 font-medium">{activeHandover?.specialPrecautionsToday}</p>
            </div>
          </div>

          {/* Caretaker Acknowledgement Status */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-gray-500 block">Caregiver Status:</span>
              <p className="font-bold text-[#38223A]">
                {activeHandover?.status === 'acknowledged'
                  ? `✓ Confirmed by Sunita at ${activeHandover.acknowledgedAt}`
                  : activeHandover?.status === 'declined'
                  ? `Declined: "${activeHandover.declinedReason}"`
                  : 'Pending Caregiver Acknowledgement before session starts'}
              </p>
            </div>

            <button
              onClick={() => setRole('helper')}
              className="px-4 py-2 rounded-2xl bg-[#075E54] text-white font-bold hover:bg-[#064e46] shadow-xs"
            >
              Switch to Helper to Acknowledge →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
