/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'owner' | 'helper' | 'creche_operator' | 'admin';

export type VerificationStatus = 'confirmed' | 'likely' | 'not_confirmed' | 'upcoming' | 'matched';

export type TaskCategory =
  | 'walk'
  | 'food'
  | 'medication'
  | 'potty'
  | 'play'
  | 'check_in'
  | 'tank_water'
  | 'cage_clean'
  | 'other';

export type EvidenceType = 'photo' | 'voice' | 'code' | 'gps' | 'note' | 'missed_call' | 'ivr_keypad' | 'owner_inspection';

export interface CareEvidence {
  id: string;
  type: EvidenceType;
  url?: string;
  caption?: string;
  timestamp: string;
  verifiedBy?: 'system' | 'admin' | 'owner';
  confidenceScore?: number; // 0 - 100
  isVisitProofOnly?: boolean; // When true: proves presence/arrival, but does NOT prove task completion!
  enteredCode?: string;
  isCurrentHomeCodeValid?: boolean;
  channelIdentifier?: string; // e.g. "photo_camera_hardware", "ivr_dtmf_telephony", "gps_geofence"
  details?: Record<string, unknown>;
}

export interface CareTask {
  id: string;
  householdId?: string;
  petId: string;
  title: string;
  category: TaskCategory;
  scheduledTime: string; // e.g. "08:00 AM"
  estimatedDurationMins: number;
  assignedToHelperId: string;
  assignedHelperName: string;
  status: VerificationStatus;
  helperMarkedDone: boolean;
  instructions: string;
  portionOrDistance?: string;
  evidence: CareEvidence[];
  securityCodeRequired?: boolean;
  notes?: string;
  completedAt?: string;
  overdueMinutes?: number;
  // SLA Escalation Configuration (Configurable per task)
  escalationRules?: {
    reminderMinutesAfterDue: number; // e.g. 15 (4:15 PM)
    ownerAlertMinutesAfterDue: number; // e.g. 30 (4:30 PM)
    backupAlertMinutesAfterDue: number; // e.g. 60 (5:00 PM)
    friendFinderMinutesAfterDue: number; // e.g. 75 (5:15 PM)
    isS1Urgent: boolean; // S1 urgent contacts owner and backup immediately
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  address?: string;
  is24HourEmergency?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  prescribedBy: string;
  lastUpdatedDate?: string;
  active: boolean;
}

export interface HealthRecord {
  id: string;
  type: 'vaccine' | 'deworming' | 'flea_tick' | 'vet_checkup';
  title: string;
  dateAdministered: string;
  nextDueDate: string;
  vetClinic: string;
  status: 'valid' | 'due_soon' | 'overdue';
}

export type SpeciesType = 'dog' | 'cat' | 'rabbit' | 'guinea_pig' | 'bird' | 'fish' | 'other';

export interface DogSpecifics {
  walkLeashType?: 'Front-clip harness' | 'Standard collar' | 'Martingale' | 'Slip lead';
  pottyFrequencyDaily?: number;
  crateTrained?: boolean;
  dogParkTolerance?: 'Loves other dogs' | 'Selective' | 'Prefers humans only' | 'Reactive on leash';
}

export interface CatSpecifics {
  litterBoxType?: 'Clumping clay' | 'Silica crystal' | 'Wood pellet' | 'Open tray' | 'Covered box';
  litterScoopFrequency?: 'Twice daily' | 'Once daily' | 'Alternate days';
  indoorOnly?: boolean;
  balconySafetyMeshConfirmed?: boolean;
  scratchingPostLocation?: string;
}

export interface RabbitSpecifics {
  hayAccessType?: 'Unlimited Timothy Hay' | 'Alfalfa (Young only)' | 'Orchard Grass';
  timothyPelletsQuantity?: string;
  chewToysProvided?: boolean;
  giStasisMonitoringNotes?: string;
  cordProofingVerified?: boolean;
}

export interface GuineaPigSpecifics {
  vitaminCSupplement?: 'Daily bell pepper slices' | 'Liquid Vitamin C drops in syringe' | 'Oxbow Vitamin C tablet';
  hideyHutsCount?: number;
  beddingType?: 'Fleece liners' | 'Paper bedding' | 'Aspen shavings';
  freshVeggiesSchedule?: string;
}

export interface BirdSpecifics {
  cageCoverTime?: string;
  outOfCageFlightHours?: string;
  draftAvoidanceLocation?: string;
  dietMixSeedPellet?: '70% Pellets + 30% Seed/Veg' | 'Seed diet with fresh greens' | 'Nectar/Fruit blend';
  respiratoryCautionNotes?: string; // Birds are hypersensitive to non-stick pans/aerosols
}

export interface FishSpecifics {
  tankVolumeLiters?: number;
  waterTemperatureC?: number;
  filterBrand?: string;
  lightingTimerHours?: string;
  feedingPinchesCount?: number;
  waterConditionerNotes?: string;
}

export interface OtherSpeciesSpecifics {
  housingEnvironment?: string;
  humidityRequirements?: string;
  specialDietaryNeeds?: string;
  handlingRisksNotes?: string;
}

export interface Pet {
  id: string;
  householdId?: string;
  name: string;
  species: SpeciesType;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  sex: 'Male (Neutered)' | 'Male (Intact)' | 'Female (Spayed)' | 'Female (Intact)';
  photo: string;
  microchipNumber?: string;
  
  // Temperament & Handling
  likes: string[];
  dislikes: string[];
  temperament: string[];
  aggressionTriggers: string[];
  handlingPrecautions: string;
  biteHandlingRisks?: string;
  friendlyWithPeople?: boolean;
  friendlyWithAnimals?: boolean;
  
  // Feeding & Water
  foodPreferences: string;
  quantityPerMeal: string;
  feedingSchedule: string;
  feedingRestrictions: string;
  waterNeedsNotes?: string;
  
  // Medical
  allergies: string[];
  medicalConditions: string[];
  medications: Medication[];
  healthRecords: HealthRecord[];
  
  // Vet & Emergency
  primaryVet: {
    name: string;
    clinic: string;
    phone: string;
    address: string;
    emergency24x7Phone?: string;
  };
  emergencyContacts: EmergencyContact[];
  
  // Caregiver cheat sheet note
  caregiverNotesSummary: string;
  securityHomeCode?: string;

  // Species-specific extensions
  dogSpecifics?: DogSpecifics;
  catSpecifics?: CatSpecifics;
  rabbitSpecifics?: RabbitSpecifics;
  guineaPigSpecifics?: GuineaPigSpecifics;
  birdSpecifics?: BirdSpecifics;
  fishSpecifics?: FishSpecifics;
  otherSpecifics?: OtherSpeciesSpecifics;
}

// Household Entity
export interface Household {
  id: string;
  name: string;
  address: {
    apartmentNo: string;
    buildingName: string;
    locality: string;
    city: string;
    pincode: string;
  };
  primaryOwnerId: string;
  coOwners: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    relationship: 'spouse' | 'co_parent' | 'family' | 'roommate';
    inviteStatus: 'active' | 'pending_invite';
  }[];
  securityHomeCode: string;
  gateCode?: string;
  emergencyPasscode: string;
  createdAt: string;
  updatedAt: string;
}

// Daily Care Handover
export interface DailyCareHandover {
  id: string;
  householdId?: string;
  petId: string;
  date: string; // e.g. "2026-11-09"
  createdAt: string;
  version?: number;
  
  petHealthCondition: 'healthy' | 'minor_issue' | 'unwell';
  appetiteStatus: 'normal' | 'reduced' | 'increased' | 'refused';
  waterIntakeStatus: 'normal' | 'reduced' | 'increased';
  newSymptomsNotes: string;
  
  todayMedicationOverrides: string;
  todayFeedingNotes: string;
  todayWalkExerciseNotes: string;
  specialPrecautionsToday: string;
  
  vetGuidanceAcknowledged: boolean;
  status: 'pending_acknowledgement' | 'acknowledged' | 'declined';
  acknowledgedAt?: string;
  acknowledgedByHelperId?: string;
  declinedReason?: string;
  diffSummary: string[];
}

// Helper Care Assignment
export interface CareAssignment {
  id: string;
  householdId: string;
  petId: string;
  helperId: string;
  date: string;
  taskIds: string[];
  handoverId?: string;
  handoverVersionAcknowledged?: number;
  status: 'assigned' | 'acknowledged' | 'in_progress' | 'completed' | 'declined';
  declinedReason?: string;
  declinedAt?: string;
}

// Helper Consent Entity with Withdrawal/Pause Flow
export interface HelperConsent {
  helperId: string;
  agreed: boolean;
  version: string; // e.g. "v1.3-2026"
  timestamp: string;
  status: 'active' | 'paused' | 'withdrawn';
  withdrawnReason?: string;
  withdrawnAt?: string;
  noFacePhotoPolicyAgreed: boolean;
}

// Distinct Visit Signal vs Task Evidence
export interface VisitSignal {
  id: string;
  householdId: string;
  helperId: string;
  type: 'gps' | 'missed_call' | 'arrival_call' | 'exit_call' | 'gate_entry';
  timestamp: string;
  source: string; // e.g. "1800-PAWSURE" or "Browser Geolocation"
  confidenceScore: number;
  providerStatus: 'SIMULATED' | 'UNAVAILABLE' | 'VERIFIED';
  isExitSignal?: boolean;
}

// Owner Return Checklist and Dispute Workflow
export interface OwnerReturnCheck {
  id: string;
  householdId: string;
  petId: string;
  date: string;
  inspectedAt: string;
  waterBowlFilled: boolean;
  foodBowlMatchesPortion: boolean;
  dogReliefWalkNoted: boolean;
  petDemeanor: 'calm_happy' | 'anxious' | 'distressed';
  inspectionMatchesReportedTasks: boolean;
  disputeFlagged: boolean;
  disputeNotes?: string;
  disputeStatus?: 'none' | 'opened' | 'in_mediation' | 'resolved';
}

// Care Circle Friend (P0 Friends first, nearby member fallback feature-flagged)
export interface CareCircleFriend {
  id: string;
  ownerId: string;
  name: string;
  petName: string;
  petBreed: string;
  locality: string;
  distanceKm: number;
  phone: string;
  avatar: string;
  isP0OwnFriend: boolean;
  isNearbyMemberFallback: boolean; // Flagged disabled by default
  relationship: 'trusted_friend' | 'apartment_neighbor' | 'family';
  availableForEmergency: boolean;
}

export interface FriendFinderRequest {
  id: string;
  petId: string;
  ownerApproved: boolean; // Owner MUST approve before outbound dispatch
  approvedAt?: string;
  messageText: string;
  urgency: 'routine' | 'backup' | 'emergency';
  targetFriendIds: string[];
  createdAt: string;
  expiresAt: string; // Expire at 15 min
  reminderAt?: string; // Reminder at 8 min
  provisionalHoldUntil?: string; // Provisional hold 10 min
  searchClosesAt?: string; // Search closes 30m before task
  status: 'draft' | 'awaiting_owner_approval' | 'dispatched' | 'accepted' | 'expired';
  acceptedByFriendId?: string;
}

// Professional Caretaker Application (P2 Gated)
export interface ProviderApplication {
  id: string;
  applicantId: string;
  name: string;
  phone: string;
  type: 'professional_caretaker' | 'creche_facility';
  yearsExperience: number;
  speciesComfortableWith: SpeciesType[];
  skills: string[]; // e.g. ["Medication Administration", "First Aid", "Large Breeds"]
  languages: ('en' | 'hi' | 'kn' | 'ta')[];
  serviceAreaLocality: string;
  serviceRadiusKm: number;
  dailyRateInr: number;
  identityVerificationStatus: 'not_started' | 'pending' | 'needs_action' | 'checked' | 'rejected' | 'expired';
  backgroundCheckStatus: 'not_started' | 'pending' | 'checked' | 'rejected' | 'expired';
  references: {
    name: string;
    phone: string;
    petInfo: string;
    verified: boolean;
  }[];
  status: 'draft' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

// Crèche Facility Application & 100-Point Audit Rubric (P1 Gated)
export interface FacilityAudit {
  id: string;
  facilityId: string;
  facilityName: string;
  operatorName: string;
  operatorPhone: string;
  locality: string;
  capacityMaxPets: number;
  currentStaffCount: number;
  acceptedSpecies: SpeciesType[];
  auditDate: string;
  auditorId: string;
  version: string;
  
  // 100-Point Rubric Breakdown
  safety20: number; // max 20 (Double gate, fire, balcony mesh, hazard proofing)
  health15: number; // max 15 (Isolation quarantine room, vet on-call contract)
  staff15: number; // max 15 (Staff ratio 1:4, pet first aid certified)
  spacePlay15: number; // max 15 (Separated play zones, non-slip flooring)
  hygiene15: number; // max 15 (Daily disinfection protocol, fresh air exchange)
  transparency10: number; // max 10 (Daily video/photo logs, live cam access)
  ownerExperience10: number; // max 10 (Clear onboarding, emergency protocol)
  
  totalScore: number; // Sum 0 - 100
  grade: 'A' | 'B' | 'C' | 'ungraded'; // A: 85+, B: 70-84, C: 55-69, below 55: ungraded
  safetyRedlineFailed: boolean; // CRITICAL: If TRUE, ALWAYS blocks listing irrespective of total score!
  safetyRedlineReasons: string[];
  
  vetSignOff: {
    vetName: string;
    clinicName: string;
    signedAt: string;
    licenseNumber: string;
  };
  
  status: 'draft' | 'private_audit' | 'corrective_action' | 'under_review' | 'approved' | 'rejected' | 'expired';
  appealStatus?: 'none' | 'appealed' | 're_audit_scheduled';
  appealNotes?: string;
  expiresAt: string;
}

// Marketplace Listing (Gated)
export interface MarketplaceListing {
  id: string;
  providerId: string;
  providerType: 'creche' | 'professional_helper';
  title: string;
  locality: string;
  dailyRateInr: number;
  capacityAvailable: number;
  acceptedSpecies: SpeciesType[];
  auditGrade?: 'A' | 'B' | 'C';
  isEligibleForPublicListing: boolean; // Gated strictly on approved checks & zero redline failure
  safetyRedlineBlocked: boolean;
  status: 'gated_pending_audit' | 'active_listed' | 'suspended';
  description: string;
  amenities: string[];
  imageUrl?: string;
}

// Booking Request (P1 & P2 Gated, Payment simulated/unavailable)
export interface BookingRequest {
  id: string;
  householdId: string;
  ownerId: string;
  petId: string;
  providerListingId: string;
  providerType: 'creche' | 'professional_helper';
  providerName: string;
  requestedDates: string[];
  status: 'requested_pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  paymentStatus: 'UNAVAILABLE_NOT_CONNECTED' | 'SIMULATED_PENDING_ESCROW';
  totalInr: number;
  declinedReason?: string;
  createdAt: string;
}

// Rewards Ledger (PRD Pilot Specification)
export interface RewardsLedgerEntry {
  id: string;
  householdId: string;
  transactionType: 'earn_confirmed' | 'earn_likely' | 'hold_mismatch' | 'adjustment_reversal' | 'coupon_redemption';
  points: number; // e.g. +5 for confirmed/likely, -500 for coupon
  referenceTaskId?: string;
  reason: string;
  createdAt: string;
  expiresAt: string; // 6-month expiry
  isHeld: boolean; // Mismatches hold points up to 7 days
  heldUntil?: string;
  idempotencyKey: string;
}

// Notification Attempt with Idempotency and Delivery States
export interface NotificationAttempt {
  id: string;
  idempotencyKey: string;
  recipientPhone: string;
  recipientRole: Role;
  channel: 'sms' | 'whatsapp' | 'push' | 'ivr';
  messageType: 'task_due' | 'helper_reminder' | 'owner_missed_alert' | 'backup_alert' | 'friend_finder';
  status: 'queued' | 'sent' | 'delivered' | 'acknowledged' | 'failed';
  queuedAt: string;
  sentAt?: string;
  deliveredAt?: string; // Provider evidence timestamp
  acknowledgedAt?: string;
  providerEvidenceId?: string;
  payloadSummary: string;
}

// Helper Profile
export interface HelperProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  preferredLanguage: 'en' | 'hi' | 'kn' | 'ta';
  interfaceMode: 'smartphone' | 'basic_phone';
  identityVerificationStatus: 'verified' | 'pending' | 'review_required';
  maskedAadhaar: string; // e.g. "XXXX-XXXX-3829" - Never full Aadhaar in app
  policeBackgroundCheck: {
    status: 'clear' | 'pending' | 'flagged';
    certificateNumber: string;
    verifiedDate: string;
    issuingAuthority: string;
  };
  experienceYears: number;
  completedSitsCount: number;
  rating: number; // e.g. 4.96
  reviewCount: number;
  certifications: string[];
  references: {
    name: string;
    petInfo: string;
    locality: string;
    contactPhone: string;
    verified: boolean;
  }[];
  consentAgreed: boolean;
  consentTimestamp: string;
  status: 'active' | 'on_break' | 'review';
  liveLocation?: {
    lat: number;
    lng: number;
    label: string;
    lastUpdated: string;
  };
}

// Escalations Ladder
export type EscalationLadderStage =
  | 'task_due'
  | 'helper_reminder'
  | 'owner_missed_alert'
  | 'owner_acknowledged'
  | 'backup_notified'
  | 'find_cover_suggested'
  | 'resolved';

export interface EscalationTimelineEntry {
  stage: EscalationLadderStage;
  timestamp: string;
  status: 'delivered' | 'acknowledged' | 'actioned';
  note: string;
}

export interface EscalationItem {
  id: string;
  type: 'missed_task' | 'unconfirmed_care' | 'health_report' | 'dispute';
  title: string;
  householdName: string;
  petName: string;
  helperName: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved';
  details: string;
  actionRequired: string;
  currentStage: EscalationLadderStage;
  timeline: EscalationTimelineEntry[];
  simulatedOverdueMins: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: Role | 'system';
  action: string;
  details: string;
  category: 'verification' | 'safety' | 'auth' | 'task' | 'telephony' | 'rewards' | 'facility' | 'access';
  sensitiveDataAccessed?: boolean;
}

export interface CaregiverRating {
  id: string;
  taskId: string;
  householdId?: string;
  petName: string;
  ownerName: string;
  helperId?: string;
  ratingStars: number; // 1 - 5
  feedbackText: string;
  date: string;
  status: 'published' | 'disputed' | 'under_review';
  disputeNotes?: string;
}

export interface OwnerRewardAccount {
  pointsBalance: number;
  pendingPoints: number;
  lifetimeEarned: number;
  monthlyEarned?: number; // Capped at 125 / month per PRD
  pilotTier: 'Bronze Care' | 'Silver Paw' | 'Gold Guardian';
  vouchers: {
    id: string;
    partnerName: string;
    title: string;
    discountDesc: string;
    pointsCost: number; // e.g. 500 points -> ₹20 coupon
    claimed: boolean;
    promoCode?: string;
  }[];
}

export interface AuthUser {
  isAuthenticated: boolean;
  role: Role;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  facilityId?: string; // For Crèche operator
  mfaVerified?: boolean;
  preferredLanguage?: 'en' | 'hi' | 'kn' | 'ta';
  interfaceMode?: 'smartphone' | 'basic_phone';
}

export interface MissedCallOrIVRLog {
  id: string;
  helperPhone: string;
  helperName: string;
  eventType: 'missed_call' | 'ivr_task_selection' | 'ivr_code_entry';
  dialedNumber: string;
  timestamp: string;
  durationSeconds: number;
  selectedTaskTitle?: string;
  enteredCode?: string;
  recognizedAsVisitProofOnly: boolean;
  statusText: string;
}

export interface CaregiverReport {
  id: string;
  taskId?: string;
  petId: string;
  helperId: string;
  helperName: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'urgent';
  title: string;
  description: string;
  photoUrl?: string;
  status: 'open' | 'acknowledged' | 'resolved';
  adminNotes?: string;
}

export interface FriendContact {
  id: string;
  name: string;
  petName: string;
  petBreed: string;
  distanceKm: number;
  locality: string;
  availableForEmergency: boolean;
  phone: string;
  avatar: string;
  isSimulatedNearby: boolean;
}

export interface FriendFinderDraft {
  petId: string;
  messageText: string;
  targetRadiusKm: number;
  needDate: string;
  urgency: 'routine' | 'backup' | 'emergency';
  ownerApproved: boolean;
  sentAt?: string;
}
