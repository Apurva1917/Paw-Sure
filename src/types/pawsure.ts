export type Role = 'owner' | 'helper' | 'admin';

export type VerificationStatus = 'confirmed' | 'likely' | 'not_confirmed' | 'upcoming';

export type TaskCategory = 'walk' | 'food' | 'medication' | 'potty' | 'play' | 'check_in' | 'tank_water' | 'cage_clean';

export type EvidenceType = 'photo' | 'voice' | 'code' | 'gps' | 'note' | 'missed_call' | 'ivr_keypad';

export interface CareEvidence {
  id: string;
  type: EvidenceType;
  url?: string;
  caption?: string;
  timestamp: string;
  verifiedBy?: 'system' | 'admin' | 'owner';
  confidenceScore?: number; // 0 - 100
  isVisitProofOnly?: boolean; // When true: proves presence/arrival, but does NOT prove task completion!
  details?: Record<string, unknown>;
}

export interface CareTask {
  id: string;
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
  mirrorPreeningNotes?: string;
}

export interface FishSpecifics {
  tankVolumeLiters?: number;
  waterTemperatureC?: number;
  filterBrand?: string;
  lightingTimerHours?: string;
  feedingPinchesCount?: number;
}

export interface Pet {
  id: string;
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
  };
  emergencyContacts: EmergencyContact[];
  
  // Caregiver cheat sheet note
  caregiverNotesSummary: string;
  securityHomeCode?: string;

  // Species-specific extensions (Phase 2)
  dogSpecifics?: DogSpecifics;
  catSpecifics?: CatSpecifics;
  rabbitSpecifics?: RabbitSpecifics;
  guineaPigSpecifics?: GuineaPigSpecifics;
  birdSpecifics?: BirdSpecifics;
  fishSpecifics?: FishSpecifics;
}

// Phase 3: Daily Care Handover
export interface DailyCareHandover {
  id: string;
  petId: string;
  date: string; // "2026-11-07"
  createdAt: string;
  
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

// Phase 4: Missed Call & IVR Activity
export interface MissedCallOrIVRLog {
  id: string;
  helperPhone: string;
  helperName: string;
  eventType: 'missed_call' | 'ivr_task_selection' | 'ivr_code_entry';
  dialedNumber: string; // e.g. "1800-PAWSURE" or "+91 80 4911 0022"
  timestamp: string;
  durationSeconds: number;
  selectedTaskTitle?: string;
  enteredCode?: string;
  recognizedAsVisitProofOnly: boolean;
  statusText: string;
}

export interface HelperProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  preferredLanguage: 'en' | 'hi' | 'kn' | 'ta';
  interfaceMode: 'smartphone' | 'basic_phone';
  identityVerificationStatus: 'verified' | 'pending' | 'review_required';
  maskedAadhaar: string; // e.g. "XXXX-XXXX-3829" - Never full Aadhaar
  policeBackgroundCheck: {
    status: 'clear' | 'pending' | 'flagged';
    certificateNumber: string;
    verifiedDate: string;
    issuingAuthority: string;
  };
  experienceYears: number;
  completedSitsCount: number;
  rating: number; // 4.96
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

// Phase 5: Escalation Ladder
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
  category: 'verification' | 'safety' | 'auth' | 'task' | 'telephony' | 'rewards';
}

// Phase 6: Rewards & Ratings
export interface OwnerRewardAccount {
  pointsBalance: number;
  pendingPoints: number;
  lifetimeEarned: number;
  pilotTier: 'Bronze Care' | 'Silver Paw' | 'Gold Guardian';
  vouchers: {
    id: string;
    partnerName: string;
    title: string;
    discountDesc: string;
    pointsCost: number;
    claimed: boolean;
    promoCode?: string;
  }[];
}

export interface CaregiverRating {
  id: string;
  taskId: string;
  petName: string;
  ownerName: string;
  ratingStars: number; // 1 - 5
  feedbackText: string;
  date: string;
  status: 'published' | 'disputed' | 'under_review';
  disputeNotes?: string;
}

// Authentication Session State
export interface AuthUser {
  isAuthenticated: boolean;
  role: Role;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  mfaVerified?: boolean;
  preferredLanguage?: 'en' | 'hi' | 'kn' | 'ta';
  interfaceMode?: 'smartphone' | 'basic_phone';
}
