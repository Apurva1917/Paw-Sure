/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { StatusBadge } from '../common/StatusBadge';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  PawPrint,
  Clock,
  Calendar,
  XCircle,
  Award,
  FileText,
  DollarSign,
  Info,
  Check,
  Eye
} from 'lucide-react';

export const CrecheDashboard: React.FC = () => {
  const { auth, activePet } = usePawsure();
  const [activeTab, setActiveTab] = useState<'overview' | 'audit_rubric' | 'bookings' | 'daily_log'>('overview');

  // Simulated Booking Requests State
  const [bookings, setBookings] = useState([
    {
      id: 'book-1',
      petName: 'Bruno (Golden Retriever)',
      ownerName: 'Neha Kapoor',
      ownerPhone: '+91 98450 11223',
      dates: 'Tomorrow (Full Day Care, 09:00 AM - 07:00 PM)',
      specialNotes: 'Front-clip harness only; no cooked poultry bones.',
      status: 'pending' as 'pending' | 'accepted' | 'declined',
      totalInr: 850
    },
    {
      id: 'book-2',
      petName: 'Bella (Beagle)',
      ownerName: 'Aditya Nair',
      ownerPhone: '+91 98111 22334',
      dates: 'This Weekend (Sat - Sun Boarding)',
      specialNotes: 'Up to date with kennel cough vaccine.',
      status: 'accepted' as 'pending' | 'accepted' | 'declined',
      totalInr: 1700
    }
  ]);

  const handleAcceptBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'accepted' } : b))
    );
  };

  const handleDeclineBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'declined' } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#38223A] pb-24">
      {/* Top Banner */}
      <SimulatedBanner label="Crèche Facility Operations Portal · Desktop Dashboard · Gated P1 Marketplace Provider" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#EE8267] to-[#A78BFA] flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl font-bold text-[#38223A]">
                  Happy Paws Daycare & Pet Boarding
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Grade A Verified (93/100)
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Facility ID: <span className="font-mono font-semibold">creche-blr-01</span> · Koramangala 4th Block, Bengaluru · Manager: {auth.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FFF9F3] px-3 py-1.5 rounded-xl border border-gray-200 text-right">
              <span className="text-[10px] text-gray-400 font-semibold block uppercase">Current Occupancy</span>
              <span className="text-xs font-bold text-[#38223A]">11 / 16 Pets (68% Capacity)</span>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-right">
              <span className="text-[10px] text-emerald-700 font-semibold block uppercase">Marketplace Status</span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Public Listing
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="max-w-7xl mx-auto flex gap-4 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Facility Overview', icon: Building2 },
            { id: 'audit_rubric', label: 'Pawsure 100-Point Audit Rubric', icon: Award },
            { id: 'bookings', label: `Booking Requests (${bookings.filter((b) => b.status === 'pending').length})`, icon: Calendar },
            { id: 'daily_log', label: 'Resident Pets & Care Schedule', icon: PawPrint }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition ${
                  active
                    ? 'border-[#EE8267] text-[#EE8267] font-bold'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">Audit Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-heading text-emerald-600">93 / 100</span>
                  <span className="text-xs font-bold text-emerald-700">Grade A</span>
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">Annual audit valid until Oct 2027</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">Safety Redlines</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-heading text-emerald-600">0 Violations</span>
                </div>
                <span className="text-[10px] text-emerald-600 block mt-1">Double airlock gate verified</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">Daily Rate</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-heading text-[#38223A]">₹850</span>
                  <span className="text-xs text-gray-500">/ pet / day</span>
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">Includes 2 walks & sanitized play</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 block uppercase">Staffing Ratio</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-heading text-purple-600">1 : 4</span>
                  <span className="text-xs text-gray-500">caretakers</span>
                </div>
                <span className="text-[10px] text-gray-400 block mt-1">4 trained handlers on duty</span>
              </div>
            </div>

            {/* Marketplace Gating Status Callout */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Pawsure Marketplace Gating Clearance: APPROVED FOR PUBLIC LISTING</span>
              </div>
              <p className="text-emerald-900 leading-relaxed">
                Happy Paws Daycare has satisfied all Non-Negotiable Pawsure safety standards: 100-point physical audit score of 93 (Grade A), verified on-call emergency vet contract with Cessna Lifeline, staff background checks clear, and zero safety redline defects. Public owners can search, review, and request bookings.
              </p>
            </div>

            {/* Facility Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#38223A]">Facility Specifications</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Play Area Size</span>
                    <span className="font-semibold text-[#38223A]">3,500 sq ft sanitized turf + indoor AC hall</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Safety Features</span>
                    <span className="font-semibold text-emerald-700">Double air-lock magnetic gate, 24x7 CCTV</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Isolation Room</span>
                    <span className="font-semibold text-[#38223A]">Dedicated negative-pressure quarantine cubicle</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Primary On-Call Vet</span>
                    <span className="font-semibold text-[#38223A]">Dr. Vivek Menon (Cessna Lifeline Hospital)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#38223A]">Gating Comparison: Bark Haven Villa</h3>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Bark Haven Villa: BLOCKED BY REDLINE RULE</span>
                  </div>
                  <p className="text-rose-700 leading-relaxed text-[11px]">
                    Although Bark Haven scored 66/100 (Grade C), it failed the critical safety redline (single unlatched gate opens directly onto arterial road). Under Pawsure Rule 4, safety redline failures ALWAYS block marketplace listing irrespective of total score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 100-POINT AUDIT RUBRIC */}
        {activeTab === 'audit_rubric' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base font-bold text-[#38223A]">
                  Pawsure 100-Point Facility Audit Scorecard
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Audited by Priya Ramanathan (Senior Pawsure Veterinary Auditor) on 2026-10-20.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-heading text-emerald-600">93 / 100</span>
                <span className="text-xs text-emerald-700 block font-bold">Grade A (Certified)</span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: '1. Perimeter & Gate Safety', max: 20, score: 19, desc: 'Double magnetic safety airlock entrance, 6-ft chew-proof boundary fence, zero road-facing latch risks.' },
                { title: '2. Health & Veterinary Protocols', max: 15, score: 14, desc: 'Signed on-call SLA with 24x7 vet hospital, negative-pressure isolation room, strict vaccination mandate.' },
                { title: '3. Staff Training & Pet Ratio', max: 15, score: 14, desc: '1:4 handler-to-pet ratio, staff trained in canine CPR and multi-dog yard de-escalation.' },
                { title: '4. Physical Space & Play Zoning', max: 15, score: 14, desc: '3,500 sq ft shock-absorbent non-slip flooring, separate yards for small and large breeds.' },
                { title: '5. Sanitation & Hygiene Standards', max: 15, score: 14, desc: 'Hospital-grade pet-safe disinfectant every 4 hours, continuous air filtration exchange.' },
                { title: '6. Parent Transparency & Logging', max: 10, score: 9, desc: 'Hourly photo evidence updates, appetite notes, and opt-in webcam streaming.' },
                { title: '7. Owner Onboarding & Intake', max: 10, score: 9, desc: 'Mandatory 30-min temperament assessment before first overnight stay.' }
              ].map((category, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-gray-100 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#38223A]">{category.title}</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {category.score} / {category.max} pts
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-[#EE8267]"
                      style={{ width: `${(category.score / category.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">{category.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#38223A] block">Veterinary Inspection Sign-Off</span>
                <span className="text-gray-500">Dr. Vivek Menon, Cessna Lifeline Hospital (Reg: KVC-BLR-88412)</span>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Medical Clearance Signed
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-[#38223A]">
                Pending & Confirmed Bookings ({bookings.length})
              </h2>
              <span className="text-xs text-gray-500">
                Payment status: <strong className="text-purple-700 font-mono">SIMULATED_PENDING_ESCROW</strong>
              </span>
            </div>

            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#38223A]">{booking.petName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          booking.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'declined'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Parent: <strong className="text-[#38223A]">{booking.ownerName}</strong> ({booking.ownerPhone})
                    </p>
                    <p className="text-gray-600">
                      Dates: <strong className="text-[#38223A]">{booking.dates}</strong>
                    </p>
                    <p className="text-gray-500 italic">Special notes: "{booking.specialNotes}"</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#38223A]">₹{booking.totalInr}</span>
                      <span className="text-[10px] text-gray-400 block">Simulated Hold</span>
                    </div>

                    {booking.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptBooking(booking.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleDeclineBooking(booking.id)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-700 transition flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">Processed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DAILY LOG */}
        {activeTab === 'daily_log' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#38223A]">
              Today’s Facility Resident Care Log
            </h2>
            <p className="text-xs text-gray-500">
              Real-time daily schedule for 11 checked-in resident pets.
            </p>

            <div className="space-y-3">
              {[
                { time: '08:30 AM', task: 'Morning Health Inspection & Yard Play (Group A - Friendly Medium/Large)', status: 'Done', caretaker: 'Ramesh' },
                { time: '10:00 AM', task: 'Breakfast & Individual Kibble Bowls in Private Cubicles', status: 'Done', caretaker: 'Arjun' },
                { time: '01:00 PM', task: 'Midday Nap & Calming Music Session (Shaded Turf)', status: 'In Progress', caretaker: 'Deepa' },
                { time: '04:30 PM', task: 'Evening Agility & Brush Coat Session', status: 'Upcoming', caretaker: 'Ramesh' }
              ].map((log, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#EE8267] w-16">{log.time}</span>
                    <span className="text-[#38223A] font-medium">{log.task}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Assigned: {log.caretaker}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
