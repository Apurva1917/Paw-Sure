import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { ShieldCheck, Star, MapPin, Calendar, Clock, Check, Send } from 'lucide-react';

export const FindCoverView: React.FC = () => {
  const { requestBackupCover } = usePawsure();
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 09:00 AM');
  const [selectedDuration, setSelectedDuration] = useState('Full Day');
  const [requestedId, setRequestedId] = useState<string | null>(null);

  const sitters = [
    {
      id: 'sit-1',
      name: 'Pooja Reddy',
      rating: 4.98,
      reviews: 64,
      experience: '5 yrs exp',
      distance: '0.8 km (HSR Sector 1)',
      rate: '₹600 / visit',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Certified First Aid'
    },
    {
      id: 'sit-2',
      name: 'Vikram Joshi',
      rating: 4.92,
      reviews: 41,
      experience: '3 yrs exp',
      distance: '1.4 km (Bellandur)',
      rate: '₹550 / visit',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Large Dog Specialist'
    },
    {
      id: 'sit-3',
      name: 'Meera Nambiar',
      rating: 4.95,
      reviews: 78,
      experience: '6 yrs exp',
      distance: '1.9 km (Sarjapur)',
      rate: '₹700 / visit',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Veterinary Student'
    }
  ];

  const handleBook = (sitterName: string, id: string) => {
    requestBackupCover(sitterName, `${selectedDate} (${selectedDuration})`);
    setRequestedId(id);
    setTimeout(() => setRequestedId(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <SimulatedBanner label="Nearby sitter discovery & dispatch are simulated demo features." />

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
          On-Demand Backup Sitter Network
        </span>
        <h1 className="font-heading text-xl font-bold text-[#38223A] mt-0.5">
          Find Verified Cover
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          When your primary caregiver is unavailable, book background-checked local sitters vetted with Pawsure KYC.
        </p>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Care Date & Time</label>
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Care Need</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200"
            >
              <option value="Single Walk (45 mins)">Single Walk (45 mins)</option>
              <option value="Half Day (4 hrs)">Half Day (4 hrs)</option>
              <option value="Full Day Care">Full Day Care</option>
              <option value="Overnight Sitting">Overnight Sitting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sitter Cards */}
      <div className="space-y-3">
        {sitters.map((sitter) => (
          <div
            key={sitter.id}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={sitter.avatar}
                alt={sitter.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#A78BFA]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-[#38223A]">
                    {sitter.name}
                  </h3>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                    {sitter.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  ★ <strong className="text-gray-800">{sitter.rating}</strong> ({sitter.reviews} reviews) · {sitter.experience}
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#EE8267]" />
                  <span>{sitter.distance}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
              <div className="sm:text-right">
                <span className="text-xs font-bold text-[#EE8267] block">{sitter.rate}</span>
                <span className="text-[10px] text-gray-400">All taxes included</span>
              </div>

              <button
                onClick={() => handleBook(sitter.name, sitter.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                  requestedId === sitter.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#EE8267] text-white hover:bg-[#E26D50]'
                }`}
              >
                {requestedId === sitter.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Request Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Cover</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
