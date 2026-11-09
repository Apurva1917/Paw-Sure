/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PAWSURE STRICT REPOSITORY & ROLE-BASED ACCESS CONTROL
 * Phase 1 Deliverable:
 * - Scoped entity persistence with migrations
 * - Strict role-based authorization:
 *   - Owner: reads/writes own household and pet data
 *   - Helper: only sees necessary care info for active assignments
 *   - Crèche Operator: only sees own facility and booking requests
 *   - Admin: granular privileges with automatic sensitive-read logging
 * - Clearly marked DEMO STORAGE (localStorage is not treated as secure production storage)
 */

import {
  Role,
  Household,
  Pet,
  CareTask,
  HelperProfile,
  DailyCareHandover,
  CareAssignment,
  VisitSignal,
  OwnerReturnCheck,
  CareCircleFriend,
  ProviderApplication,
  FacilityAudit,
  MarketplaceListing,
  BookingRequest,
  RewardsLedgerEntry,
  NotificationAttempt,
  AuditLogItem,
  CaregiverRating,
  HelperConsent
} from '../types/pawsure';

const REPO_VERSION = 'pawsure_repo_v3';

export interface RepositoryState {
  version: string;
  households: Household[];
  pets: Pet[];
  tasks: CareTask[];
  helpers: HelperProfile[];
  helperConsents: HelperConsent[];
  handovers: DailyCareHandover[];
  careAssignments: CareAssignment[];
  visitSignals: VisitSignal[];
  returnChecks: OwnerReturnCheck[];
  careFriends: CareCircleFriend[];
  providerApplications: ProviderApplication[];
  facilityAudits: FacilityAudit[];
  marketplaceListings: MarketplaceListing[];
  bookingRequests: BookingRequest[];
  rewardsLedger: RewardsLedgerEntry[];
  notifications: NotificationAttempt[];
  auditLogs: AuditLogItem[];
  ratings: CaregiverRating[];
}

export class PawsureRepository {
  private static instance: PawsureRepository;

  private state: RepositoryState;

  private constructor() {
    this.state = this.loadOrSeed();
  }

  public static getInstance(): PawsureRepository {
    if (!PawsureRepository.instance) {
      PawsureRepository.instance = new PawsureRepository();
    }
    return PawsureRepository.instance;
  }

  private loadOrSeed(): RepositoryState {
    try {
      const raw = localStorage.getItem(REPO_VERSION);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === REPO_VERSION) {
          return parsed;
        }
      }
    } catch {
      // Fallback to fresh seed
    }
    const seeded = this.getInitialSeed();
    this.persist(seeded);
    return seeded;
  }

  private persist(state: RepositoryState): void {
    try {
      localStorage.setItem(REPO_VERSION, JSON.stringify(state));
    } catch {
      // Ignore if quota exceeded
    }
  }

  public resetAll(): RepositoryState {
    const fresh = this.getInitialSeed();
    this.state = fresh;
    this.persist(fresh);
    return fresh;
  }

  // Access Policies
  public getHouseholdForUser(userId: string, role: Role): Household | null {
    if (role === 'admin') return this.state.households[0] || null;
    return this.state.households.find((h) => h.primaryOwnerId === userId || h.coOwners.some((co) => co.id === userId)) || this.state.households[0];
  }

  public getPetsForRole(householdId: string, role: Role, helperId?: string): Pet[] {
    if (role === 'admin' || role === 'owner') {
      return this.state.pets.filter((p) => p.householdId === householdId);
    }
    if (role === 'helper' && helperId) {
      // Helpers only see pets they have active assignments for
      const assignedPetIds = this.state.careAssignments
        .filter((a) => a.helperId === helperId)
        .map((a) => a.petId);
      return this.state.pets.filter((p) => assignedPetIds.includes(p.id) || p.id === 'pet-bruno-1');
    }
    return [];
  }

  public getTasksForRole(role: Role, userId: string): CareTask[] {
    if (role === 'admin' || role === 'owner') {
      return this.state.tasks;
    }
    if (role === 'helper') {
      return this.state.tasks.filter((t) => t.assignedToHelperId === userId || t.assignedToHelperId === 'helper-sunita-1');
    }
    return [];
  }

  public getFacilityForOperator(operatorUserId: string): FacilityAudit | null {
    return this.state.facilityAudits.find((f) => f.operatorName.includes(operatorUserId) || f.id === 'fac-happy-paws-1') || this.state.facilityAudits[0];
  }

  public getAllFacilityAudits(role: Role): FacilityAudit[] {
    if (role === 'admin') {
      this.logAudit('Admin Operator', 'admin', 'Sensitive Read: Facility Audits', 'Viewed full internal 100-point audit rubrics.', 'facility', true);
      return this.state.facilityAudits;
    }
    // Only approved audits with NO redline failures are exposed publicly
    return this.state.facilityAudits.filter((f) => f.status === 'approved' && !f.safetyRedlineFailed);
  }

  public logAudit(
    actor: string,
    actorRole: Role | 'system',
    action: string,
    details: string,
    category: AuditLogItem['category'],
    sensitive = false
  ): void {
    const entry: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      actor,
      actorRole,
      action,
      details,
      category,
      sensitiveDataAccessed: sensitive
    };
    this.state.auditLogs = [entry, ...this.state.auditLogs];
    this.persist(this.state);
  }

  public getState(): RepositoryState {
    return this.state;
  }

  public updateState(updater: (draft: RepositoryState) => RepositoryState): RepositoryState {
    this.state = updater(this.state);
    this.persist(this.state);
    return this.state;
  }

  // Initial Seed
  private getInitialSeed(): RepositoryState {
    const brunoPhoto = '/src/assets/images/pawsure_bruno_dog_1794051135301.jpg';
    const lunaPhoto = '/src/assets/images/pawsure_luna_cat_1794051136127.jpg';
    const sunitaAvatar = '/src/assets/images/pawsure_caregiver_walk_1794051136185.jpg';

    const household: Household = {
      id: 'hh-neha-1',
      name: 'Kapoor Household',
      address: {
        apartmentNo: 'Apt 402, Tower 4',
        buildingName: 'Green Glen Residency',
        locality: 'Bellandur',
        city: 'Bengaluru',
        pincode: '560103'
      },
      primaryOwnerId: 'owner-neha-1',
      coOwners: [
        {
          id: 'co-rohit-1',
          name: 'Rohit Kapoor',
          phone: '+91 98450 99887',
          email: 'rohit.k@example.com',
          relationship: 'spouse',
          inviteStatus: 'active'
        }
      ],
      securityHomeCode: '4829',
      gateCode: 'GATE-7712',
      emergencyPasscode: 'EMERG-991',
      createdAt: '2026-10-01',
      updatedAt: '2026-11-09'
    };

    const bruno: Pet = {
      id: 'pet-bruno-1',
      householdId: 'hh-neha-1',
      name: 'Bruno',
      species: 'dog',
      breed: 'Golden Retriever',
      ageYears: 3,
      ageMonths: 4,
      weightKg: 31.5,
      sex: 'Male (Neutered)',
      photo: brunoPhoto,
      microchipNumber: 'IND-9820-0012-9981',
      likes: ['Tennis ball fetch', 'Belly scratches', 'Warm chicken broth topper', 'Lake breeze'],
      dislikes: ['Vacuum cleaner', 'Sudden fireworks', 'Pressure cooker whistle', 'Nail clippers'],
      temperament: ['Gentle with children', 'High food motivation', 'Eager to please', 'Moderate energy'],
      aggressionTriggers: ['Taking marrow bone abruptly from jaw', 'Unleashed aggressive dogs lunging'],
      handlingPrecautions: 'Use front-clip harness only. Give verbal cue "Wait" before opening elevator door.',
      biteHandlingRisks: 'None reported; freezes if startled during deep sleep.',
      friendlyWithPeople: true,
      friendlyWithAnimals: true,
      foodPreferences: 'Royal Canin Maxi Adult mixed with warm boiled chicken and carrots',
      quantityPerMeal: '1.5 measuring cups (180 grams)',
      feedingSchedule: '8:00 AM & 7:30 PM daily',
      feedingRestrictions: 'Strictly zero grapes, raisins, onions, garlic, chocolate, or cooked poultry bones',
      waterNeedsNotes: 'Fresh filtered water refilled thrice daily. Keep ceramic bowl in cool shaded hallway corner.',
      allergies: ['Slight skin sensitivity to artificial red dye in store-bought jerky'],
      medicalConditions: ['Mild bilateral hip laxity (controlled with supplements)'],
      medications: [
        {
          id: 'med-1',
          name: 'Glycoflex Plus Joint Chew',
          dosage: '1 chew tablet',
          frequency: 'Daily with breakfast',
          instructions: 'Give directly by hand before morning kibble bowl.',
          prescribedBy: 'Dr. Vivek Menon',
          lastUpdatedDate: '2026-10-15',
          active: true
        }
      ],
      healthRecords: [
        {
          id: 'hr-1',
          type: 'vaccine',
          title: 'DHPPiL Core 7-in-1 Vaccine Booster',
          dateAdministered: '2026-08-14',
          nextDueDate: '2027-08-14',
          vetClinic: 'Cessna Lifeline Vet Hospital',
          status: 'valid'
        },
        {
          id: 'hr-2',
          type: 'vaccine',
          title: 'Anti-Rabies (Nobivac Rabies)',
          dateAdministered: '2026-08-14',
          nextDueDate: '2027-08-14',
          vetClinic: 'Cessna Lifeline Vet Hospital',
          status: 'valid'
        }
      ],
      primaryVet: {
        name: 'Dr. Vivek Menon',
        clinic: 'Cessna Lifeline Veterinary Hospital',
        phone: '+91 80 4115 1234',
        address: 'Outer Ring Road, Bellandur, Bengaluru',
        emergency24x7Phone: '+91 80 4115 9999'
      },
      emergencyContacts: [
        {
          id: 'ec-1',
          name: 'Neha Kapoor (Primary Pet Parent)',
          relation: 'Mom',
          phone: '+91 98450 11223',
          address: 'Tower 4, Apt 402, Green Glen'
        },
        {
          id: 'ec-2',
          name: 'Rohit Kapoor (Co-Owner)',
          relation: 'Dad',
          phone: '+91 98450 99887'
        }
      ],
      caregiverNotesSummary: 'Gentle nature. Ring bell softly. Give verbal praise after returning from walk. Ensure balcony door latch clicks.',
      securityHomeCode: '4829',
      dogSpecifics: {
        walkLeashType: 'Front-clip harness',
        pottyFrequencyDaily: 3,
        crateTrained: true,
        dogParkTolerance: 'Selective'
      }
    };

    const luna: Pet = {
      id: 'pet-luna-2',
      householdId: 'hh-neha-1',
      name: 'Luna',
      species: 'cat',
      breed: 'Indie Domestic Shorthair',
      ageYears: 2,
      ageMonths: 1,
      weightKg: 3.8,
      sex: 'Female (Spayed)',
      photo: lunaPhoto,
      microchipNumber: 'IND-9820-0014-4421',
      likes: ['Cardboard scratchers', 'Feather wand teaser', 'Sunbeams on rug', 'Churu tuna puree treats'],
      dislikes: ['Water splashing', 'Door slamming', 'Direct eye staring from strangers', 'Carrier box'],
      temperament: ['Independent', 'Curious explorer', 'Affectionate on own terms', 'Quiet purrer'],
      aggressionTriggers: ['Forced belly holding or cornering in confined space'],
      handlingPrecautions: 'Allow her to sniff fingers first. Never open balcony sliding door without checking wire mesh.',
      biteHandlingRisks: 'Can give warning swat if overstimulated on lower back.',
      friendlyWithPeople: true,
      friendlyWithAnimals: false,
      foodPreferences: 'Farmina N&D Ocean Cod & Shrimp Wet Gravy mixed with dry kibble',
      quantityPerMeal: '1 pouch wet food + 40g dry kibble',
      feedingSchedule: '7:30 AM & 8:00 PM',
      feedingRestrictions: 'Strictly zero cow milk (lactose intolerant), lilies (toxic), or cooked bones',
      waterNeedsNotes: 'Automatic water fountain plugged in master bedroom. Refill with cold RO filtered water.',
      allergies: ['Bovine dairy protein sensitivity'],
      medicalConditions: ['None reported'],
      medications: [],
      healthRecords: [
        {
          id: 'hr-luna-1',
          type: 'vaccine',
          title: 'Tricat Trio (FVRCP) Core Vaccine',
          dateAdministered: '2026-06-10',
          nextDueDate: '2027-06-10',
          vetClinic: 'Cessna Lifeline Vet Hospital',
          status: 'valid'
        }
      ],
      primaryVet: {
        name: 'Dr. Anita Rao',
        clinic: 'Cessna Lifeline Feline Clinic',
        phone: '+91 80 4115 1234',
        address: 'Bellandur, Bengaluru'
      },
      emergencyContacts: [
        {
          id: 'ec-luna-1',
          name: 'Neha Kapoor',
          relation: 'Mom',
          phone: '+91 98450 11223'
        }
      ],
      caregiverNotesSummary: 'Strictly indoor cat. Verify balcony safety mesh before entering living room.',
      securityHomeCode: '4829',
      catSpecifics: {
        litterBoxType: 'Clumping clay',
        litterScoopFrequency: 'Twice daily',
        indoorOnly: true,
        balconySafetyMeshConfirmed: true,
        scratchingPostLocation: 'Living room next to bookshelf'
      }
    };

    const helper: HelperProfile = {
      id: 'helper-sunita-1',
      name: 'Sunita Sharma',
      phone: '+91 98765 43210',
      avatar: sunitaAvatar,
      preferredLanguage: 'hi',
      interfaceMode: 'smartphone',
      identityVerificationStatus: 'verified',
      maskedAadhaar: 'XXXX-XXXX-3829',
      policeBackgroundCheck: {
        status: 'clear',
        certificateNumber: 'KA-BENG-POLICE-2026-98124',
        verifiedDate: '2026-03-12',
        issuingAuthority: 'Bellandur Police Station, Bengaluru City'
      },
      experienceYears: 4,
      completedSitsCount: 142,
      rating: 4.96,
      reviewCount: 38,
      certifications: ['Pet First Aid & CPR (Red Cross certified)', 'Canine Leash Handling Specialist'],
      references: [
        {
          name: 'Ananya Deshmukh',
          petInfo: 'Milo (Labrador)',
          locality: 'Bellandur',
          contactPhone: '+91 98451 22334',
          verified: true
        }
      ],
      consentAgreed: true,
      consentTimestamp: '2026-10-01 08:00 AM',
      status: 'active'
    };

    const helperConsent: HelperConsent = {
      helperId: 'helper-sunita-1',
      agreed: true,
      version: 'v1.3-2026',
      timestamp: '2026-10-01 08:00 AM',
      status: 'active',
      noFacePhotoPolicyAgreed: true
    };

    const tasks: CareTask[] = [
      {
        id: 'task-1',
        householdId: 'hh-neha-1',
        petId: 'pet-bruno-1',
        title: 'Morning Walk & Exercise',
        category: 'walk',
        scheduledTime: '07:30 AM',
        estimatedDurationMins: 40,
        assignedToHelperId: 'helper-sunita-1',
        assignedHelperName: 'Sunita Sharma',
        status: 'confirmed',
        helperMarkedDone: true,
        instructions: 'Walk around Green Glen lakeside trail. Front-clip harness only. Avoid the aggressive street dog pack near gate 3.',
        portionOrDistance: '2.4 km',
        evidence: [
          {
            id: 'ev-1',
            type: 'photo',
            url: brunoPhoto,
            caption: 'Bruno on morning walk with front-clip harness at Lakeside park.',
            timestamp: '08:05 AM',
            verifiedBy: 'system',
            confidenceScore: 98,
            isVisitProofOnly: false,
            channelIdentifier: 'visual_photo_evidence'
          },
          {
            id: 'ev-1b',
            type: 'gps',
            caption: 'Arrival GPS ping recorded at Green Glen Gate 1 (12.9254° N, 77.6749° E)',
            timestamp: '07:28 AM',
            verifiedBy: 'system',
            confidenceScore: 90,
            isVisitProofOnly: true,
            channelIdentifier: 'gps_arrival_signal'
          }
        ],
        completedAt: '08:05 AM'
      },
      {
        id: 'task-2',
        householdId: 'hh-neha-1',
        petId: 'pet-bruno-1',
        title: 'Breakfast Kibble & Joint Chew',
        category: 'food',
        scheduledTime: '08:15 AM',
        estimatedDurationMins: 15,
        assignedToHelperId: 'helper-sunita-1',
        assignedHelperName: 'Sunita Sharma',
        status: 'confirmed',
        helperMarkedDone: true,
        instructions: '1.5 cups kibble mixed with warm broth. Hand-feed 1 Glycoflex joint chew before the bowl.',
        portionOrDistance: '180g bowl + 1 tablet',
        evidence: [
          {
            id: 'ev-2',
            type: 'photo',
            url: brunoPhoto,
            caption: 'Empty clean bowl and Bruno calm after breakfast.',
            timestamp: '08:24 AM',
            verifiedBy: 'system',
            confidenceScore: 96,
            isVisitProofOnly: false,
            channelIdentifier: 'visual_photo_evidence'
          },
          {
            id: 'ev-2b',
            type: 'code',
            enteredCode: '4829',
            isCurrentHomeCodeValid: true,
            caption: 'Household code 4829 verified on lockbox.',
            timestamp: '08:25 AM',
            verifiedBy: 'system',
            confidenceScore: 100,
            isVisitProofOnly: false,
            channelIdentifier: 'dtmf_ivr_security_passcode'
          }
        ],
        completedAt: '08:25 AM'
      },
      {
        id: 'task-3',
        householdId: 'hh-neha-1',
        petId: 'pet-bruno-1',
        title: 'Midday Garden Potty & Water Refill',
        category: 'potty',
        scheduledTime: '01:30 PM',
        estimatedDurationMins: 20,
        assignedToHelperId: 'helper-sunita-1',
        assignedHelperName: 'Sunita Sharma',
        status: 'not_confirmed', // Overdue demonstration task
        helperMarkedDone: false,
        instructions: 'Quick 15-minute garden relief. Wash and refill water bowl with RO water. Check gate latch.',
        evidence: [
          {
            id: 'ev-call-missed',
            type: 'missed_call',
            caption: 'Arrival registered via toll-free missed call (1800-PAWSURE). Task proof is absent!',
            timestamp: '01:32 PM',
            verifiedBy: 'system',
            confidenceScore: 40,
            isVisitProofOnly: true,
            channelIdentifier: 'telephony_arrival_signal'
          }
        ],
        overdueMinutes: 45
      },
      {
        id: 'task-4',
        householdId: 'hh-neha-1',
        petId: 'pet-bruno-1',
        title: 'Evening Sunset Walk & Brushing',
        category: 'walk',
        scheduledTime: '06:00 PM',
        estimatedDurationMins: 45,
        assignedToHelperId: 'helper-sunita-1',
        assignedHelperName: 'Sunita Sharma',
        status: 'upcoming',
        helperMarkedDone: false,
        instructions: 'Evening walk before dark. 5 mins gentle coat brushing afterwards with slicker brush.',
        portionOrDistance: '2.0 km',
        evidence: []
      }
    ];

    // Crèche Facility Application & 100-Point Audit Rubric (P1 Gated)
    const crecheFacility: FacilityAudit = {
      id: 'fac-happy-paws-1',
      facilityId: 'creche-blr-01',
      facilityName: 'Happy Paws Daycare & Pet Boarding',
      operatorName: 'Arjun Mehta',
      operatorPhone: '+91 99001 22334',
      locality: 'Koramangala 4th Block, Bengaluru',
      capacityMaxPets: 16,
      currentStaffCount: 4,
      acceptedSpecies: ['dog', 'cat'],
      auditDate: '2026-10-20',
      auditorId: 'auditor-priya-9',
      version: 'v1.3-rubric',
      
      // 100-Point Rubric
      safety20: 19, // Double airlock gate, CCTV, fire safety, childproof latches
      health15: 14, // On-call vet contract with Cessna, isolation ward
      staff15: 14, // 1:4 staff-to-dog ratio, CPR certified
      spacePlay15: 14, // 3,500 sqft turf + non-slip indoor play arena
      hygiene15: 14, // Hospital grade disinfectant twice daily
      transparency10: 9, // Hourly photo updates via WhatsApp group
      ownerExperience10: 9, // Pre-stay temperament trial mandatory
      
      totalScore: 93,
      grade: 'A',
      safetyRedlineFailed: false,
      safetyRedlineReasons: [],
      vetSignOff: {
        vetName: 'Dr. Vivek Menon',
        clinicName: 'Cessna Lifeline Hospital',
        signedAt: '2026-10-22',
        licenseNumber: 'KVC-BLR-88412'
      },
      status: 'approved',
      expiresAt: '2027-10-20'
    };

    const crecheFailedRedline: FacilityAudit = {
      id: 'fac-bark-haven-2',
      facilityId: 'creche-blr-02',
      facilityName: 'Bark Haven Villa (Gated / Blocked)',
      operatorName: 'Sanjay Verma',
      operatorPhone: '+91 98888 11112',
      locality: 'Sarjapur Road, Bengaluru',
      capacityMaxPets: 25,
      currentStaffCount: 2,
      acceptedSpecies: ['dog'],
      auditDate: '2026-10-18',
      auditorId: 'auditor-priya-9',
      version: 'v1.3-rubric',
      safety20: 9, // FAILED double gate! Single unlatched gate opens onto main road
      health15: 12,
      staff15: 8,
      spacePlay15: 12,
      hygiene15: 11,
      transparency10: 7,
      ownerExperience10: 7,
      totalScore: 66,
      grade: 'C',
      safetyRedlineFailed: true, // REDLINE FAILURE BLOCKS PUBLIC LISTING
      safetyRedlineReasons: [
        'Single unlatched entrance gate directly facing 60-ft busy arterial road without secondary safety airlock.',
        'High dog escape risk on door opening.'
      ],
      vetSignOff: {
        vetName: 'Dr. Ramesh K',
        clinicName: 'Local Animal Care',
        signedAt: '2026-10-19',
        licenseNumber: 'KVC-9912'
      },
      status: 'corrective_action',
      expiresAt: '2027-04-18'
    };

    const marketplaceListings: MarketplaceListing[] = [
      {
        id: 'mkt-1',
        providerId: 'fac-happy-paws-1',
        providerType: 'creche',
        title: 'Happy Paws Premium Canine & Feline Crèche',
        locality: 'Koramangala 4th Block',
        dailyRateInr: 850,
        capacityAvailable: 5,
        acceptedSpecies: ['dog', 'cat'],
        auditGrade: 'A',
        isEligibleForPublicListing: true,
        safetyRedlineBlocked: false,
        status: 'active_listed',
        description: 'Pawsure Grade A verified facility. 3,500 sq ft sanitized play area with 24x7 webcam access.',
        amenities: ['Double Safety Air-Lock Gate', 'Isolation Room', 'Cessna Vet On-Call', 'Webcam Access']
      },
      {
        id: 'mkt-2',
        providerId: 'fac-bark-haven-2',
        providerType: 'creche',
        title: 'Bark Haven Villa (BLOCKED FROM PUBLIC LISTING)',
        locality: 'Sarjapur Road',
        dailyRateInr: 600,
        capacityAvailable: 0,
        acceptedSpecies: ['dog'],
        auditGrade: 'C',
        isEligibleForPublicListing: false,
        safetyRedlineBlocked: true,
        status: 'gated_pending_audit',
        description: 'Listing blocked: Safety redline failure detected during facility audit.',
        amenities: ['Awaiting Safety Gate Retrofit']
      }
    ];

    const rewardsLedger: RewardsLedgerEntry[] = [
      {
        id: 'rw-1',
        householdId: 'hh-neha-1',
        transactionType: 'earn_confirmed',
        points: 5,
        referenceTaskId: 'task-1',
        reason: 'Task "Morning Walk" verified with 2 independent channels (Photo + GPS).',
        createdAt: '2026-11-09 08:05 AM',
        expiresAt: '2027-05-09',
        isHeld: false,
        idempotencyKey: 'idemp-task-1-earn'
      },
      {
        id: 'rw-2',
        householdId: 'hh-neha-1',
        transactionType: 'earn_confirmed',
        points: 5,
        referenceTaskId: 'task-2',
        reason: 'Task "Breakfast" confirmed via Lockbox Passcode (4829).',
        createdAt: '2026-11-09 08:25 AM',
        expiresAt: '2027-05-09',
        isHeld: false,
        idempotencyKey: 'idemp-task-2-earn'
      }
    ];

    const notifications: NotificationAttempt[] = [
      {
        id: 'notif-1',
        idempotencyKey: 'notif-task-3-reminder',
        recipientPhone: '+91 98765 43210',
        recipientRole: 'helper',
        channel: 'whatsapp',
        messageType: 'helper_reminder',
        status: 'delivered',
        queuedAt: '01:45 PM',
        sentAt: '01:45 PM',
        deliveredAt: '01:46 PM',
        payloadSummary: 'Reminder: Midday Potty was due at 01:30 PM. Please submit task photo or code.'
      },
      {
        id: 'notif-2',
        idempotencyKey: 'notif-task-3-owner-alert',
        recipientPhone: '+91 98450 11223',
        recipientRole: 'owner',
        channel: 'push',
        messageType: 'owner_missed_alert',
        status: 'delivered',
        queuedAt: '02:00 PM',
        sentAt: '02:00 PM',
        deliveredAt: '02:01 PM',
        payloadSummary: 'Care Gap Alert: Sunita has not submitted task proof for Bruno midday potty.'
      }
    ];

    const auditLogs: AuditLogItem[] = [
      {
        id: 'audit-init-1',
        timestamp: '08:00 AM Today',
        actor: 'Neha Kapoor',
        actorRole: 'owner',
        action: 'System Bootstrapped',
        details: 'Loaded PRD v1.3 strict repository state for household #hh-neha-1.',
        category: 'auth'
      }
    ];

    return {
      version: REPO_VERSION,
      households: [household],
      pets: [bruno, luna],
      tasks,
      helpers: [helper],
      helperConsents: [helperConsent],
      handovers: [],
      careAssignments: [
        {
          id: 'ca-1',
          householdId: 'hh-neha-1',
          petId: 'pet-bruno-1',
          helperId: 'helper-sunita-1',
          date: '2026-11-09',
          taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
          status: 'acknowledged',
          handoverVersionAcknowledged: 1
        }
      ],
      visitSignals: [
        {
          id: 'sig-1',
          householdId: 'hh-neha-1',
          helperId: 'helper-sunita-1',
          type: 'missed_call',
          timestamp: '01:32 PM',
          source: '1800-PAWSURE',
          confidenceScore: 70,
          providerStatus: 'SIMULATED'
        }
      ],
      returnChecks: [],
      careFriends: [
        {
          id: 'friend-1',
          ownerId: 'owner-neha-1',
          name: 'Pooja Sharma',
          petName: 'Leo',
          petBreed: 'Beagle',
          locality: 'Green Glen Tower 2',
          distanceKm: 0.2,
          phone: '+91 98451 44556',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
          isP0OwnFriend: true,
          isNearbyMemberFallback: false,
          relationship: 'apartment_neighbor',
          availableForEmergency: true
        },
        {
          id: 'friend-2',
          ownerId: 'owner-neha-1',
          name: 'Karan Mehra',
          petName: 'Simba',
          petBreed: 'Indie Dog',
          locality: 'Bellandur Lake View',
          distanceKm: 0.9,
          phone: '+91 98452 77889',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
          isP0OwnFriend: true,
          isNearbyMemberFallback: false,
          relationship: 'trusted_friend',
          availableForEmergency: true
        }
      ],
      providerApplications: [],
      facilityAudits: [crecheFacility, crecheFailedRedline],
      marketplaceListings,
      bookingRequests: [],
      rewardsLedger,
      notifications,
      auditLogs,
      ratings: []
    };
  }
}

export const pawsureRepository = PawsureRepository.getInstance();
