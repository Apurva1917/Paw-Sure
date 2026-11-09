import React, { useState } from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { SimulatedBanner } from '../common/SimulatedBanner';
import {
  Gift,
  Award,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

export const RewardsAndRatingsView: React.FC = () => {
  const {
    rewards,
    claimVoucher,
    ratings,
    submitCaregiverReview,
    disputeCaregiverReview,
    helper,
    tasks
  } = usePawsure();

  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState('Sunita was punctual and Bruno loved the shaded park walk.');
  const [showDisputeModal, setShowDisputeModal] = useState<string | null>(null);
  const [disputeNotes, setDisputeNotes] = useState('');

  const completedTasks = tasks.filter((t) => t.status === 'confirmed');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedTasks[0]) {
      alert('Cannot rate: Only completed and verified tasks are eligible for performance reviews.');
      return;
    }
    submitCaregiverReview(completedTasks[0].id, ratingStars, feedbackText);
    setFeedbackText('');
    alert('Rating published and added to Sunita’s permanent caregiver record!');
  };

  const handleConfirmDispute = (reviewId: string) => {
    if (!disputeNotes.trim()) {
      alert('Please specify why this rating is being disputed.');
      return;
    }
    disputeCaregiverReview(reviewId, disputeNotes);
    setShowDisputeModal(null);
    setDisputeNotes('');
    alert('Review flagged for admin arbitration.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Simulation Banner */}
      <SimulatedBanner
        label="Capped Rewards Pilot & Partner Vouchers. Points are earned strictly on verified tasks and redeemed as simulated vouchers."
      />

      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EE8267]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EE8267]">
            Care Assurance Pilot
          </span>
          <h1 className="font-heading text-xl font-bold text-[#38223A]">
            Rewards, Recognition & Ratings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Earn pet wellness points for verified routines. Submit verified caregiver feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#FFF0E6] text-[#EE8267] font-bold px-3 py-1.5 rounded-full border border-[#EE8267]/30">
            Tier: {rewards.pilotTier}
          </span>
        </div>
      </div>

      {/* POINTS BALANCE STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-[#FFF0E6] to-[#FFF9F3] p-5 rounded-3xl border border-[#EE8267]/30 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#EE8267] block">
            Verified Points Balance
          </span>
          <span className="text-3xl font-bold text-[#38223A] block">{rewards.pointsBalance} pts</span>
          <p className="text-[11px] text-gray-500">Available to redeem for partner food vouchers</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-600 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Unconfirmed Points</span>
          </span>
          <span className="text-3xl font-bold text-amber-700 block">{rewards.pendingPoints} pts</span>
          <p className="text-[11px] text-gray-400">
            * Locked until tasks are verified with valid proof. Unconfirmed tasks earn 0 pts.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-purple-700 block flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Lifetime Earned</span>
          </span>
          <span className="text-3xl font-bold text-purple-900 block">{rewards.lifetimeEarned} pts</span>
          <p className="text-[11px] text-gray-500">Gold Guardian Pilot status maintained</p>
        </div>
      </div>

      {/* ELIGIBLE FOOD & GROOMING VOUCHERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-[#38223A] flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#EE8267]" />
              <span>Eligible Partner Vouchers (Capped Pilot)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Redeemable at authorized pet partners in Bellandur & HSR Layout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rewards.vouchers.map((v) => (
            <div
              key={v.id}
              className={`p-4 rounded-3xl border transition flex flex-col justify-between ${
                v.claimed
                  ? 'bg-gray-50 border-gray-200 opacity-70'
                  : 'bg-white border-gray-200/80 shadow-xs hover:border-[#EE8267]'
              }`}
            >
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#EE8267] block">
                  {v.partnerName}
                </span>
                <h3 className="font-bold text-xs text-[#38223A] leading-tight">{v.title}</h3>
                <p className="text-[11px] text-gray-500">{v.discountDesc}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between">
                <span className="font-bold text-xs text-[#38223A]">{v.pointsCost} Points</span>
                {v.claimed ? (
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    {v.promoCode}
                  </span>
                ) : (
                  <button
                    onClick={() => claimVoucher(v.id)}
                    className="px-3 py-1.5 rounded-xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] shadow-xs"
                  >
                    Redeem
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARETAKER PERFORMANCE & VERIFIED REVIEWS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-[#38223A] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Caregiver Recognition & Verified Reviews</span>
            </h2>
            <p className="text-xs text-gray-500">
              Only completed assignments verified with photo/passcode proof may be reviewed.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-gray-700">Sunita Sharma: ★ {helper.rating}</span>
            <span className="text-[10px] text-gray-400 block">{helper.completedSitsCount} verified sits</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleSubmitReview} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
          <h3 className="font-bold text-xs text-gray-700">Submit Verified Review for Today's Visit</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Star Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRatingStars(star)}
                className={`p-1 text-base ${star <= ratingStars ? 'text-amber-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            rows={2}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share feedback on handling, harness care, and punctuality..."
            className="w-full p-3 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#EE8267]"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-2xl bg-[#EE8267] text-white text-xs font-bold hover:bg-[#E26D50] shadow-xs"
          >
            Post Verified Review
          </button>
        </form>

        {/* Existing Reviews Feed */}
        <div className="space-y-2">
          {ratings.map((rev) => (
            <div key={rev.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#38223A]">{rev.ownerName}</span>
                  <span className="text-[11px] text-gray-400">· Pet: {rev.petName}</span>
                  <span className="text-amber-500 font-bold">{'★'.repeat(rev.ratingStars)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                  {rev.status === 'disputed' ? (
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded-full">
                      Disputed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDisputeModal(rev.id)}
                      className="text-[10px] text-gray-400 hover:text-rose-600 underline"
                    >
                      Dispute Review
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600">"{rev.feedbackText}"</p>
              {rev.disputeNotes && (
                <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-xl mt-1">
                  <strong>Dispute Note:</strong> {rev.disputeNotes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DISPUTE MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-heading font-bold text-base text-[#38223A]">
              Dispute Caregiver Review
            </h3>
            <p className="text-xs text-gray-500">
              Submit details for admin mediation if this rating misrepresents the completed session.
            </p>
            <textarea
              rows={3}
              value={disputeNotes}
              onChange={(e) => setDisputeNotes(e.target.value)}
              placeholder="State your objection and reference task evidence..."
              className="w-full p-3 rounded-2xl border border-gray-200 text-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDisputeModal(null)}
                className="flex-1 py-2.5 rounded-2xl border border-gray-300 text-xs font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDispute(showDisputeModal)}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
