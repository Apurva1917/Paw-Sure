import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { Phone, ShieldAlert, Heart, AlertOctagon, Printer, Share2 } from 'lucide-react';

export const EmergencyCardView: React.FC = () => {
  const { activePet } = usePawsure();

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Emergency Health Pass
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            {activePet.name}’s 24/7 Emergency Card
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Designed for 1-tap dialing by pet sitters, neighbors, or emergency veterinarians.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(
                  `EMERGENCY PET CARD for ${activePet.name} (${activePet.breed}):\n- Primary Vet: ${activePet.primaryVet.clinic} (${activePet.primaryVet.phone})\n- 24/7 Animal Hospital: Cessna Lifeline (+91 80 4115 9999)\n- Allergies: ${activePet.allergies.join(', ') || 'None'}\n- Parent: ${activePet.emergencyContacts[0]?.name} (${activePet.emergencyContacts[0]?.phone})`
                );
                alert('Copied emergency protocol text to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Card</span>
          </button>
        </div>
      </div>

      {/* Main Red Alert Card */}
      <div className="rounded-3xl bg-rose-600 text-white p-6 shadow-xl border-4 border-rose-300 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activePet.photo}
              alt={activePet.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-rose-200">
                Official Pet Emergency Pass
              </span>
              <h2 className="font-heading text-2xl font-bold">{activePet.name}</h2>
              <p className="text-xs text-rose-100">
                {activePet.breed} · {activePet.weightKg} kg · {activePet.sex}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-rose-200 block">Canine Blood Type</span>
            <span className="text-lg font-mono font-bold">DEA 1.1 (+)</span>
          </div>
        </div>

        {/* 1-Tap Vet Callout */}
        <div className="bg-white rounded-2xl p-4 text-[#38223A] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-600 block">
              24/7 Emergency Animal Hospital
            </span>
            <h3 className="font-heading font-bold text-base">
              {activePet.primaryVet.clinic}
            </h3>
            <p className="text-xs text-gray-500">{activePet.primaryVet.address}</p>
          </div>
          <a
            href={`tel:${activePet.primaryVet.phone}`}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Call 24/7 ICU ({activePet.primaryVet.phone})</span>
          </a>
        </div>

        {/* Critical Allergies & Handling Warnings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-rose-700/60 p-3 rounded-2xl border border-rose-400">
            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-200 block mb-1">
              Critical Allergies
            </span>
            <p className="font-semibold text-rose-50">
              {activePet.allergies.length > 0 ? activePet.allergies.join(', ') : 'No known drug allergies'}
            </p>
          </div>
          <div className="bg-rose-700/60 p-3 rounded-2xl border border-rose-400">
            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-200 block mb-1">
              National Pet Poison Control
            </span>
            <a href="tel:+918022019900" className="font-semibold text-rose-50 hover:underline">
              +91 80 2201 9900 (Helpline)
            </a>
          </div>
        </div>

        {/* Emergency Contacts List */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20 space-y-2">
          <span className="font-bold uppercase text-[10px] tracking-wider text-rose-200 block">
            Authorized Family Contacts
          </span>
          <div className="space-y-2">
            {activePet.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between text-xs py-1 border-b border-white/10 last:border-0"
              >
                <div>
                  <span className="font-bold block">{contact.name}</span>
                  <span className="text-[11px] text-rose-200">{contact.relation}</span>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="px-3 py-1 rounded-xl bg-white text-rose-600 font-bold hover:bg-rose-100 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
