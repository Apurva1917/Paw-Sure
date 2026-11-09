import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Check,
  Send,
  Users,
  Building2,
  AlertOctagon,
  Award,
  Sparkles,
  Phone,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';

export const FindCoverView: React.FC = () => {
  const {
    activePet,
    friends,
    facilityAudits,
    marketplaceListings,
    bookingRequests,
    submitBookingRequest,
    household
  } = usePawsure();

  const [activeTier, setActiveTier] = useState<'p0_friends' | 'p1_creches' | 'p2_helpers'>('p0_friends');
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 09:00 AM');
  const [selectedDuration, setSelectedDuration] = useState('Full Day');
  const [requestedId, setRequestedId] = useState<string | null>(null);

  // Filter listings
  const approvedCreches = facilityAudits.filter((f) => !f.safetyRedlineFailed && f.status === 'approved');
  const blockedCreches = facilityAudits.filter((f) => f.safetyRedlineFailed);

  const professionalHelpers = [
    {
      id: 'sit-1',
      name: 'Pooja Reddy',
      rating: 4.98,
      reviews: 64,
      experience: '5 yrs exp',
      distance: '0.8 km (HSR Sector 1)',
      rate: 600,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Certified Pet First Aid',
      kycStatus: 'Verified (Masked Aadhaar XXXX-XXXX-3829)',
      policeCheck: 'Clear (BLR-POL-88492)'
    },
    {
      id: 'sit-2',
      name: 'Vikram Joshi',
      rating: 4.92,
      reviews: 41,
      experience: '3 yrs exp',
      distance: '1.4 km (Bellandur)',
      rate: 550,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Large Dog Specialist',
      kycStatus: 'Verified (Masked Aadhaar XXXX-XXXX-9104)',
      policeCheck: 'Clear (BLR-POL-10923)'
    },
    {
      id: 'sit-3',
      name: 'Meera Nambiar',
      rating: 4.95,
      reviews: 78,
      experience: '6 yrs exp',
      distance: '1.9 km (Sarjapur)',
      rate: 700,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      badge: 'Veterinary Tech Student',
      kycStatus: 'Verified (Masked Aadhaar XXXX-XXXX-5521)',
      policeCheck: 'Clear (BLR-POL-77182)'
    }
  ];

  const handleBook = (providerName: string, id: string, type: 'creche' | 'professional_helper', rate: number) => {
    submitBookingRequest({
      householdId: household.id,
      ownerId: household.primaryOwnerId,
      petId: activePet.id,
      providerListingId: id,
      providerType: type,
      providerName,
      requestedDates: [selectedDate],
      totalInr: rate
    });
    setRequestedId(id);
    setTimeout(() => setRequestedId(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      <SimulatedBanner label="3-Tier Explore Care · P0 Free Friends · P1 Audited Crèches · P2 Professional KYC Helpers" />

      {/* Header & Tier Switcher */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Comprehensive Backup & Scheduled Care
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A] mt-0.5">
            Explore Care for {activePet.name}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Choose trusted neighbor exchanges (P0), 100-point audited crèches (P1), or vetted professional sitters (P2).
          </p>
        </div>

        {/* 3-Tier Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTier('p0_friends')}
            className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
              activeTier === 'p0_friends'
                ? 'bg-[#FFF0E6] border-[#EE8267] text-[#EE8267] shadow-xs'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-[#EE8267]/10 text-[#EE8267] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">P0: Friends Circle</span>
              <span className="text-[11px] opacity-80">Free parent-to-parent cover</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTier('p1_creches')}
            className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
              activeTier === 'p1_creches'
                ? 'bg-[#FFF0E6] border-[#EE8267] text-[#EE8267] shadow-xs'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">P1: Audited Crèches</span>
              <span className="text-[11px] opacity-80">100-Pt Rubric Gated (Grade A)</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTier('p2_helpers')}
            className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
              activeTier === 'p2_helpers'
                ? 'bg-[#FFF0E6] border-[#EE8267] text-[#EE8267] shadow-xs'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">P2: Pro Sitters</span>
              <span className="text-[11px] opacity-80">Aadhaar & Police KYC Vetted</span>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
              <option value="Overnight Boarding">Overnight Boarding</option>
            </select>
          </div>
        </div>
      </div>

      {/* TIER 1: P0 FRIENDS CIRCLE */}
      {activeTier === 'p0_friends' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">
              Trusted Pet Parent Neighbors in Your Circle ({friends.length} Available)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Free Community Exchange
            </span>
          </div>

          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#A78BFA]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-[#38223A]">
                      {friend.name}
                    </h3>
                    <span className="text-[10px] bg-[#FFF0E6] text-[#EE8267] px-2 py-0.5 rounded-full font-bold">
                      Parent of {friend.petName} ({friend.petBreed})
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {friend.phone} · {friend.locality} ({friend.distanceKm} km away)
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Available for emergency buddy cover</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${friend.phone}`}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-[#FFF9F3] border border-gray-200 text-[#38223A] text-xs font-bold hover:bg-[#FFF0E6] text-center"
                >
                  Call Directly
                </a>
                <button
                  onClick={() => handleBook(friend.name, friend.id, 'professional_helper', 0)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                    requestedId === friend.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#EE8267] text-white hover:bg-[#E26D50]'
                  }`}
                >
                  {requestedId === friend.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Buddy Cover</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIER 2: P1 AUDITED CRÈCHES */}
      {activeTier === 'p1_creches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">
              100-Point Physical Inspection Approved Facilities
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
              P1 Gated Marketplace
            </span>
          </div>

          {/* Approved Facilities */}
          {approvedCreches.map((creche) => (
            <div
              key={creche.id}
              className="bg-white rounded-3xl p-5 border border-purple-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-heading text-lg">
                    {creche.grade}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-[#38223A]">
                        {creche.facilityName}
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Grade {creche.grade} ({creche.totalScore}/100)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      Operator: {creche.operatorName} · {creche.locality} · Max {creche.capacityMaxPets} pets
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#EE8267] block">₹850 / day</span>
                    <span className="text-[10px] text-gray-400">Escrow Protected</span>
                  </div>
                  <button
                    onClick={() => handleBook(creche.facilityName, creche.id, 'creche', 850)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                      requestedId === creche.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-700 text-white hover:bg-purple-800'
                    }`}
                  >
                    {requestedId === creche.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Booked!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Book Daycare</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rubric Breakdown Pill */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[10px]">Double-Gate Safety</span>
                  <strong>{creche.safety20} / 20 pts</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Staff-to-Pet Ratio</span>
                  <strong>{creche.staff15} / 15 pts (1:4)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Vet On-Call</span>
                  <strong>{creche.vetSignOff.vetName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Safety Redlines</span>
                  <strong className="text-emerald-700">✓ Zero Failures</strong>
                </div>
              </div>
            </div>
          ))}

          {/* NEGATIVE FIXTURE: Gated / Blocked Crèche Displaying Safety Redline Failure */}
          {blockedCreches.map((creche) => (
            <div
              key={creche.id}
              className="bg-rose-50/60 rounded-3xl p-5 border-2 border-rose-300 shadow-xs space-y-2 opacity-85"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-rose-200 text-rose-800">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-base text-rose-950">
                        {creche.facilityName}
                      </h3>
                      <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                        SAFETY REDLINE BLOCKED
                      </span>
                    </div>
                    <p className="text-xs text-rose-900 mt-0.5">
                      Audited Score: {creche.totalScore}/100 · Gated from Public Listing
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-white border border-rose-300 text-rose-700 rounded-full text-xs font-bold">
                  Listing Prohibited
                </span>
              </div>

              <div className="p-3 bg-white/80 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
                <strong className="block text-[11px] font-bold">Audit Safety Violation:</strong>
                <p>
                  {creche.safetyRedlineReasons[0] || 'Road-facing exit gate single latch failed. Missing mandatory double airlock barrier.'}
                </p>
                <span className="text-[10px] text-gray-500 block italic">
                  * PRD v1.3 Rule: Any safety redline failure ALWAYS blocks marketplace listing irrespective of total score.
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIER 3: P2 PROFESSIONAL SITTERS */}
      {activeTier === 'p2_helpers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600">
              KYC-Verified Professional Caregivers ({professionalHelpers.length} Available)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              P2 Gated Sitters
            </span>
          </div>

          {professionalHelpers.map((sitter) => (
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
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{sitter.kycStatus}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    Police Ref: {sitter.policeCheck}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                <div className="sm:text-right">
                  <span className="text-xs font-bold text-[#EE8267] block">₹{sitter.rate} / visit</span>
                  <span className="text-[10px] text-gray-400">Escrow Held</span>
                </div>

                <button
                  onClick={() => handleBook(sitter.name, sitter.id, 'professional_helper', sitter.rate)}
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
                      <span>Book Sitter</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECENT BOOKING REQUESTS QUEUE (If any submitted) */}
      {bookingRequests.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#38223A]">
              Your Care Booking Inquiries ({bookingRequests.length})
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Demo Escrow</span>
          </div>

          <div className="space-y-2">
            {bookingRequests.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-2xl bg-[#FFF9F3] border border-gray-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#38223A] block">{b.providerName}</span>
                  <span className="text-gray-500 text-[11px]">
                    Dates: {b.requestedDates.join(', ')} · Total: ₹{b.totalInr}
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 block">
                    {b.status === 'requested_pending' ? 'Pending Acceptance' : b.status}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    {b.paymentStatus === 'SIMULATED_PENDING_ESCROW' ? 'Simulated Escrow' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
