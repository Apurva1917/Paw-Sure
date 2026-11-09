import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { CaregiverCheatSheetModal } from './CaregiverCheatSheetModal';
import {
  PawPrint,
  Heart,
  Utensils,
  AlertTriangle,
  FileText,
  Key,
  ShieldCheck,
  Edit2,
  Calendar,
  Sparkles
} from 'lucide-react';

export const PetProfileView: React.FC<{ onOpenRegister: () => void }> = ({ onOpenRegister }) => {
  const { activePet, pets, setActivePetId } = usePawsure();
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (activePet.securityHomeCode && navigator.clipboard) {
      navigator.clipboard.writeText(activePet.securityHomeCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Pet Switcher Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-3xl border border-[#EE8267]/20 shadow-xs">
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
                  className="w-5 h-5 rounded-full object-cover border border-white"
                />
                <span>{p.name}</span>
              </button>
            );
          })}
          <button
            onClick={onOpenRegister}
            className="px-3 py-1.5 rounded-2xl border border-dashed border-[#EE8267] text-[#EE8267] text-xs font-semibold hover:bg-[#FFF0E6] shrink-0"
          >
            + Register Pet
          </button>
        </div>

        <button
          onClick={() => setShowCheatSheet(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF0E6] text-[#EE8267] text-xs font-semibold hover:bg-[#F3D7EA] transition shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Sitter Cheat Sheet</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-gradient-to-br from-[#FFF0E6] via-[#FFF9F3] to-[#F3D7EA]/30 rounded-3xl p-6 border border-[#EE8267]/20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activePet.photo}
              alt={activePet.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EE8267]">
                  {activePet.species === 'dog' ? 'Canine Profile' : 'Feline Profile'}
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Verified Active
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#38223A]">
                {activePet.name}
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                {activePet.breed} · {activePet.ageYears} yrs {activePet.ageMonths} mos · {activePet.weightKg} kg · {activePet.sex}
              </p>
              {activePet.microchipNumber && (
                <p className="text-[11px] font-mono text-gray-500 mt-1">
                  Microchip: #{activePet.microchipNumber}
                </p>
              )}
            </div>
          </div>

          {/* Daily Care Security Code */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EE8267]/30 shadow-xs text-center w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">
              Caregiver Entry Code
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="font-mono text-lg font-bold text-[#EE8267] tracking-wider">
                {activePet.securityHomeCode || '4829'}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                title="Copy care code"
              >
                <Key className="w-4 h-4 text-[#EE8267]" />
              </button>
            </div>
            {copiedCode && <span className="text-[10px] text-emerald-600 font-semibold block">Copied!</span>}
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Behavior & Temperament */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Heart className="w-4 h-4 text-[#A78BFA]" />
            <h2 className="font-heading font-bold text-sm text-[#38223A]">
              Temperament & Behavior
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="font-semibold text-gray-500 block text-[11px]">Personality:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activePet.temperament.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block text-[11px]">Likes & Joys:</span>
              <p className="text-gray-700">{activePet.likes.join(', ')}</p>
            </div>

            <div>
              <span className="font-semibold text-gray-500 block text-[11px]">Dislikes & Fears:</span>
              <p className="text-gray-700">{activePet.dislikes.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Aggression Triggers & Precautions */}
        <div className="bg-rose-50/50 rounded-3xl p-5 border border-rose-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="font-heading font-bold text-sm text-rose-900">
              Aggression Triggers & Handling
            </h2>
          </div>

          <div className="space-y-2 text-xs text-rose-900">
            <div>
              <strong className="block text-[11px] text-rose-800">Triggers to Avoid:</strong>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                {activePet.aggressionTriggers.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-rose-200">
              <strong className="block text-[11px] text-rose-800">Precautions for Caretaker:</strong>
              <p className="mt-0.5">{activePet.handlingPrecautions}</p>
            </div>
          </div>
        </div>

        {/* Food & Nutrition */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Utensils className="w-4 h-4 text-[#EE8267]" />
            <h2 className="font-heading font-bold text-sm text-[#38223A]">
              Food & Nutrition Plan
            </h2>
          </div>

          <div className="space-y-2 text-xs text-[#38223A]">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-[#FFF9F3]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Portion</span>
                <span className="font-semibold">{activePet.quantityPerMeal}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FFF9F3]">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Schedule</span>
                <span className="font-semibold">{activePet.feedingSchedule}</span>
              </div>
            </div>
            <p><strong>Diet:</strong> {activePet.foodPreferences}</p>
            <p className="text-rose-600"><strong>Restrictions:</strong> {activePet.feedingRestrictions}</p>
          </div>
        </div>

        {/* Medical & Primary Vet */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="font-heading font-bold text-sm text-[#38223A]">
              Medical & Primary Vet
            </h2>
          </div>

          <div className="space-y-2 text-xs text-[#38223A]">
            <div>
              <span className="font-semibold text-gray-500 block text-[11px]">Primary Vet:</span>
              <p className="font-semibold">{activePet.primaryVet.clinic} ({activePet.primaryVet.name})</p>
              <p className="text-gray-500 font-mono text-[11px]">{activePet.primaryVet.phone}</p>
            </div>

            {activePet.medications.length > 0 && (
              <div>
                <span className="font-semibold text-gray-500 block text-[11px]">Daily Medications:</span>
                {activePet.medications.map((m) => (
                  <p key={m.id} className="text-purple-700 font-medium">
                    • {m.name}: {m.dosage} ({m.frequency})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CaregiverCheatSheetModal
        pet={activePet}
        isOpen={showCheatSheet}
        onClose={() => setShowCheatSheet(false)}
      />
    </div>
  );
};
