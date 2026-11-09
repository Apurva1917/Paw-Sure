import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Edit3
} from 'lucide-react';

export const FriendsCircleView: React.FC = () => {
  const {
    friends,
    activePet,
    friendFinderDraft,
    setFriendFinderDraft,
    ownerApproveAndSendFriendFinder
  } = usePawsure();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [editingDraft, setEditingDraft] = useState(false);
  const [draftText, setDraftText] = useState(friendFinderDraft.messageText);
  const [targetRadius, setTargetRadius] = useState(friendFinderDraft.targetRadiusKm);

  const handleOpenApproveModal = () => {
    setFriendFinderDraft((prev) => ({
      ...prev,
      messageText: draftText,
      targetRadiusKm: targetRadius
    }));
    setShowApprovalModal(true);
  };

  const handleApproveAndSend = () => {
    ownerApproveAndSendFriendFinder();
    setShowApprovalModal(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Simulation Disclosure */}
      <SimulatedBanner label="Nearby-member discovery & neighborhood network are simulated demo features." />

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Trusted Neighborhood Care Circle
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            Friends & Backup Sitters
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Pet parents within 2km of Green Glen Layout willing to step in for emergencies.
          </p>
        </div>

        <button
          onClick={handleOpenApproveModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] shadow-sm transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Broadcast Friend Finder</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block font-bold">Owner Approved & Dispatched!</strong>
            <span>Your backup request was sent to {friends.length} nearby pet parents within {targetRadius}km.</span>
          </div>
        </div>
      )}

      {/* FRIEND FINDER DRAFT CARD (OWNER APPROVAL MANDATORY) */}
      <div className="bg-gradient-to-br from-[#FFF0E6] to-[#FFF9F3] rounded-3xl p-5 border border-[#EE8267]/30 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#EE8267] text-white">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-[#38223A]">
                Friend Finder Broadcast Composer
              </h2>
              <span className="text-[11px] text-gray-500">
                Requires explicit owner approval before dispatch
              </span>
            </div>
          </div>

          <span
            className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
              friendFinderDraft.ownerApproved
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {friendFinderDraft.ownerApproved ? 'Approved & Sent' : 'Pending Owner Approval'}
          </span>
        </div>

        {/* Draft text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#38223A]">
              Message to Neighbors:
            </label>
            <button
              onClick={() => setEditingDraft(!editingDraft)}
              className="text-xs text-[#EE8267] font-semibold hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{editingDraft ? 'Done Editing' : 'Edit Text'}</span>
            </button>
          </div>

          {editingDraft ? (
            <textarea
              rows={3}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#EE8267] text-xs bg-white text-[#38223A]"
            />
          ) : (
            <p className="p-3.5 rounded-2xl bg-white border border-[#EE8267]/20 text-xs text-[#38223A] leading-relaxed">
              "{draftText}"
            </p>
          )}
        </div>

        {/* Radius selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EE8267]/20 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#EE8267]" />
            <span className="text-gray-600">Search Radius:</span>
            <select
              value={targetRadius}
              onChange={(e) => setTargetRadius(Number(e.target.value))}
              className="px-2.5 py-1 rounded-xl border border-gray-300 text-xs font-medium bg-white"
            >
              <option value={0.5}>Within 500m (Gated Society)</option>
              <option value={1.5}>Within 1.5 km (Bellandur)</option>
              <option value={3.0}>Within 3.0 km (Outer Ring Rd)</option>
            </select>
          </div>

          <button
            onClick={handleOpenApproveModal}
            className="px-4 py-2 rounded-2xl bg-[#38223A] text-white text-xs font-semibold hover:bg-black transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Review & Approve Broadcast</span>
          </button>
        </div>
      </div>

      {/* NEARBY PET PARENTS LIST */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-[#38223A]">
          Nearby Pet Parents Ready to Help ({friends.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white rounded-3xl p-4 border border-gray-100 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                />
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#38223A]">
                    {friend.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pet: {friend.petName} ({friend.petBreed})
                  </p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#EE8267]" />
                    <span>{friend.locality} ({friend.distanceKm} km)</span>
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                {friend.availableForEmergency ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold block">
                    Available
                  </span>
                ) : (
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium block">
                    Away
                  </span>
                )}
                <a
                  href={`tel:${friend.phone}`}
                  className="inline-flex items-center gap-1 text-xs text-[#EE8267] font-semibold hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OWNER APPROVAL MODAL (MANDATORY GATEWAY) */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="p-2.5 rounded-2xl bg-[#FFF0E6] text-[#EE8267]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-[#38223A]">
                  Approve Friend Finder
                </h3>
                <span className="text-xs text-gray-500">
                  Owner consent required prior to neighborhood dispatch
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F3] border border-[#EE8267]/20 text-xs text-[#38223A] space-y-2">
              <p className="font-semibold text-gray-700">Preview Broadcast Message:</p>
              <p className="italic bg-white p-2.5 rounded-xl border border-gray-200">
                "{draftText}"
              </p>
              <div className="flex justify-between pt-1 text-[11px] text-gray-500">
                <span>Target Radius: <strong>{targetRadius} km</strong></span>
                <span>Recipients: <strong>{friends.length} pet parents</strong></span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                By approving, you authorize Pawsure to notify selected verified pet parents in your immediate vicinity.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveAndSend}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
