import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Compass, Camera, CheckCircle2, MapPin } from 'lucide-react';
import { BRUNO_PHOTO, SUNITA_PHOTO } from '../../data/mockData';

export const CareHistoryView: React.FC = () => {
  const { activePet } = usePawsure();

  const historyLogs = [
    {
      id: 'h-1',
      date: 'Yesterday, Nov 6',
      visitsCount: 3,
      verifiedConfidence: '100% Confirmed',
      summary: 'All morning, midday and evening routines completed with full photo and GPS match.',
      items: [
        {
          time: '07:35 AM',
          title: 'Morning Park Trail Walk',
          distance: '2.8 km (42 mins)',
          helper: 'Sunita Sharma',
          status: 'confirmed' as const,
          photo: SUNITA_PHOTO,
          note: 'Pooped twice, drank plenty of water. Played fetch with tennis ball.'
        },
        {
          time: '01:30 PM',
          title: 'Midday Potty & Garden Sniff',
          distance: '0.6 km (18 mins)',
          helper: 'Sunita Sharma',
          status: 'confirmed' as const,
          note: 'Water bowl washed and refilled.'
        },
        {
          time: '07:45 PM',
          title: 'Dinner & Joint Supplement',
          distance: '1.5 cups kibble + chew',
          helper: 'Sunita Sharma',
          status: 'confirmed' as const,
          photo: BRUNO_PHOTO,
          note: 'Finished entire bowl in 5 minutes.'
        }
      ]
    },
    {
      id: 'h-2',
      date: 'Wednesday, Nov 5',
      visitsCount: 2,
      verifiedConfidence: '95% Confirmed',
      summary: 'Morning walk and evening care confirmed with GPS perimeter check.',
      items: [
        {
          time: '07:40 AM',
          title: 'Morning Walk & Lake View',
          distance: '2.5 km (36 mins)',
          helper: 'Sunita Sharma',
          status: 'confirmed' as const,
          photo: SUNITA_PHOTO,
          note: 'Friendly greetings with neighbor Beagle Bagel.'
        },
        {
          time: '07:50 PM',
          title: 'Dinner & Paw Cleaning',
          distance: '1.5 cups kibble',
          helper: 'Sunita Sharma',
          status: 'confirmed' as const,
          note: 'Paws cleaned with wet wipes after damp grass walk.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Historical Care Records
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            Care History & Audit Trail
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified logs, walk GPS tracks, and photo evidence recorded for {activePet.name}.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            98.4% Lifetime Verification Rate
          </span>
        </div>
      </div>

      {/* History Feed */}
      <div className="space-y-6">
        {historyLogs.map((log) => (
          <div key={log.id} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#EE8267]" />
                <h2 className="font-heading font-bold text-sm text-[#38223A]">{log.date}</h2>
                <span className="text-xs text-gray-500">· {log.visitsCount} visits</span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold">{log.verifiedConfidence}</span>
            </div>

            <div className="space-y-3">
              {log.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-4.5 border border-gray-100 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-500">{item.time}</span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <h3 className="font-heading font-bold text-sm text-[#38223A] mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Caregiver: {item.helper} · {item.distance}
                      </p>
                    </div>

                    {item.photo && (
                      <img
                        src={item.photo}
                        alt="Care evidence"
                        className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs"
                      />
                    )}
                  </div>

                  {item.note && (
                    <p className="text-xs text-gray-600 bg-[#FFF9F3] p-2.5 rounded-xl">
                      "{item.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
