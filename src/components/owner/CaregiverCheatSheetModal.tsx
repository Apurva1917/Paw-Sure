import React from 'react';
import { Pet } from '../../types/pawsure';
import { X, ShieldAlert, Utensils, Heart, Phone, AlertCircle, Share2, Printer } from 'lucide-react';

interface CaregiverCheatSheetModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export const CaregiverCheatSheetModal: React.FC<CaregiverCheatSheetModalProps> = ({ pet, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#FFF9F3] p-6 shadow-2xl border border-[#EE8267]/20 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#38223A]/10">
          <div className="flex items-center gap-3">
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#EE8267] shadow-sm"
            />
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#EE8267]">
                Caregiver Quick Cheat Sheet
              </span>
              <h2 className="font-heading text-xl font-bold text-[#38223A]">
                {pet.name}’s Care Protocols
              </h2>
              <p className="text-xs text-[#38223A]/70">
                {pet.breed} · {pet.ageYears}y {pet.ageMonths}m · {pet.weightKg} kg · {pet.sex}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#38223A]/60 hover:text-[#38223A] hover:bg-[#FFF0E6] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Quick Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-[#FFF0E6] border border-[#EE8267]/30">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#EE8267] mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Sitter One-Minute Brief
            </h3>
            <p className="text-sm text-[#38223A] leading-relaxed">
              {pet.caregiverNotesSummary}
            </p>
          </div>

          {/* Aggression Triggers & Precautions (Crucial for safety!) */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Aggression Triggers & Handling Precautions
            </h3>
            <div className="space-y-2 text-xs text-[#38223A]">
              <div>
                <strong className="text-rose-900 block">Watch out for:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-rose-800">
                  {pet.aggressionTriggers.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-1 border-t border-rose-200/60">
                <strong className="text-rose-900">Handling Rule: </strong>
                <span>{pet.handlingPrecautions}</span>
              </div>
            </div>
          </div>

          {/* Feeding & Meals */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#38223A]/10 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA] mb-2 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#A78BFA]" />
              Feeding Instructions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#FFF9F3]">
                <span className="text-[#38223A]/60 block text-[10px] uppercase font-semibold">Portion Size</span>
                <span className="font-semibold text-[#38223A]">{pet.quantityPerMeal}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FFF9F3]">
                <span className="text-[#38223A]/60 block text-[10px] uppercase font-semibold">Timings</span>
                <span className="font-semibold text-[#38223A]">{pet.feedingSchedule}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#38223A]">
              <strong>Diet: </strong>{pet.foodPreferences}
            </p>
            <p className="mt-1 text-xs text-rose-600 font-medium">
              <strong>Strict Restrictions: </strong>{pet.feedingRestrictions}
            </p>
          </div>

          {/* Medical & Allergies */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#38223A]/10 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#38223A] mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Allergies & Current Medications
            </h3>
            {pet.allergies.length > 0 ? (
              <div className="text-xs mb-2">
                <span className="font-semibold text-rose-600">Allergies: </span>
                {pet.allergies.join(', ')}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-2">No known drug/food allergies.</p>
            )}

            {pet.medications.length > 0 ? (
              <div className="space-y-1.5">
                {pet.medications.map((m) => (
                  <div key={m.id} className="p-2 rounded-xl bg-purple-50 border border-purple-100 text-xs">
                    <div className="flex justify-between font-semibold text-[#38223A]">
                      <span>{m.name}</span>
                      <span className="text-[#8B5CF6]">{m.dosage}</span>
                    </div>
                    <p className="text-[11px] text-[#38223A]/70 mt-0.5">{m.instructions}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No active daily medications.</p>
            )}
          </div>

          {/* Emergency & Vet */}
          <div className="p-3.5 rounded-2xl bg-[#F3D7EA]/40 border border-[#F3D7EA]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#38223A] mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#EE8267]" />
              Emergency Vet & Parents
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#38223A]">{pet.primaryVet.clinic}</p>
                  <p className="text-[11px] text-[#38223A]/70">{pet.primaryVet.name}</p>
                </div>
                <a
                  href={`tel:${pet.primaryVet.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-[#EE8267] text-white font-medium hover:bg-[#E26D50] flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  Call Vet
                </a>
              </div>
              {pet.emergencyContacts.slice(0, 2).map((c) => (
                <div key={c.id} className="flex items-center justify-between pt-1 border-t border-[#38223A]/10 text-xs">
                  <div>
                    <span className="font-medium text-[#38223A]">{c.name}</span>
                    <span className="text-[10px] text-gray-500 block">{c.relation}</span>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="text-[#EE8267] font-semibold hover:underline"
                  >
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#38223A]/10 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(
                  `Pawsure Care Sheet for ${pet.name} (${pet.breed}):\n- Food: ${pet.quantityPerMeal} at ${pet.feedingSchedule}\n- Precautions: ${pet.handlingPrecautions}\n- Vet: ${pet.primaryVet.name} (${pet.primaryVet.phone})`
                );
                alert('Copied quick care sheet text to clipboard!');
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-white border border-[#38223A]/15 py-2.5 text-xs font-semibold text-[#38223A] hover:bg-[#FFF0E6] transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#EE8267] py-2.5 text-xs font-semibold text-white hover:bg-[#E26D50] transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
