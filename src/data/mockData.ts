import {
  Pet,
  HelperProfile,
  CareTask,
  FriendContact,
  EscalationItem,
  AuditLogItem,
  DailyCareHandover,
  MissedCallOrIVRLog,
  OwnerRewardAccount,
  CaregiverRating
} from '../types/pawsure';

export const BRUNO_PHOTO = '/src/assets/images/pawsure_bruno_dog_1794051135301.jpg';
export const LUNA_PHOTO = '/src/assets/images/pawsure_luna_cat_1794051136127.jpg';
export const SUNITA_PHOTO = '/src/assets/images/pawsure_caregiver_walk_1794051136185.jpg';

export const DOG_BREEDS = [
  'Golden Retriever',
  'Indie / Indian Pariah Dog',
  'Labrador Retriever',
  'Beagle',
  'Shih Tzu',
  'German Shepherd',
  'Cocker Spaniel',
  'Pug',
  'Poodle',
  'Rottweiler',
  'Dachshund',
  'Siberian Husky',
  'French Bulldog',
  'Border Collie',
  'Indie Mixed Breed',
  'Mixed / Other Dog',
  'Unknown Breed'
];

export const CAT_BREEDS = [
  'Domestic Shorthair',
  'Indie / Indian Street Cat',
  'Persian',
  'Siamese',
  'Bengal',
  'Ragdoll',
  'British Shorthair',
  'Maine Coon',
  'Calico Tabby',
  'Indie Mixed Cat',
  'Mixed / Other Cat',
  'Unknown Breed'
];

export const RABBIT_BREEDS = [
  'Holland Lop',
  'Netherland Dwarf',
  'Mini Rex',
  'Lionhead',
  'Flemish Giant',
  'Indian Desi Domestic Rabbit',
  'English Angora',
  'Mixed Rabbit Breed',
  'Unknown Breed'
];

export const GUINEA_PIG_BREEDS = [
  'American Guinea Pig',
  'Abyssinian (Swirled coat)',
  'Peruvian (Long coat)',
  'Silkie / Sheltie',
  'Teddy',
  'Crested',
  'Mixed Guinea Pig Breed',
  'Unknown Breed'
];

export const BIRD_BREEDS = [
  'Budgerigar (Budgie)',
  'Cockatiel',
  'Lovebird',
  'Ring-necked Parakeet (Indie)',
  'Sun Conure',
  'Canary',
  'Zebra Finch',
  'African Grey Parrot',
  'Mixed / Other Bird',
  'Unknown Breed'
];

export const FISH_BREEDS = [
  'Betta (Siamese Fighting Fish)',
  'Guppy / Fancy Tail',
  'Goldfish (Oranda / Fantail)',
  'Neon Tetra',
  'Molly / Platy',
  'Angelfish',
  'Corydoras Catfish',
  'Cichlid (Freshwater)',
  'Mixed Community Aquarium',
  'Unknown Species'
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-bruno-1',
    name: 'Bruno',
    species: 'dog',
    breed: 'Golden Retriever',
    ageYears: 3,
    ageMonths: 6,
    weightKg: 31.5,
    sex: 'Male (Neutered)',
    photo: BRUNO_PHOTO,
    microchipNumber: '956000018392812',
    likes: [
      'Tennis ball fetch',
      'Ear scratches behind collar',
      'Chilled cucumber slices',
      'Gentle tummy rubs',
      'Mud puddles after rain'
    ],
    dislikes: [
      'Vacuum cleaner noise',
      'Pressure cooker whistle',
      'Being touched around rear paws',
      'Aggressive motorized skateboards'
    ],
    temperament: ['Eager to please', 'High food motivation', 'Affectionate', 'Gentle with kids'],
    aggressionTriggers: [
      'High-energy unleashed dogs lunging while Bruno is on short leash',
      'Taking high-value marrow bones away without trading for a treat'
    ],
    handlingPrecautions: 'Always use front-clip harness for evening walks. Never pull his tail. Give verbal cue "Wait" before opening apartment main door.',
    foodPreferences: 'Royal Canin Maxi Adult mixed with boiled bone broth & shredded chicken breast.',
    quantityPerMeal: '1.5 measuring cups (180g) kibble + 50g warm shredded chicken',
    feedingSchedule: 'Twice daily: 8:30 AM & 7:45 PM sharp. Fresh filtered water always refilled.',
    feedingRestrictions: 'Strictly NO onions, garlic, chocolate, grapes, raisins or cooked poultry bones.',
    waterNeedsNotes: 'Clean, filtered bowl refilled thrice daily. Drinks approx. 1.2 to 1.5 liters.',
    allergies: ['Slight sensitivity to artificial chicken byproduct meal', 'Pollen contact itch in monsoon'],
    medicalConditions: ['Mild hip laxity (managed with daily Glucosamine)'],
    medications: [
      {
        id: 'med-1',
        name: 'Glycoflex Plus Joint Chew',
        dosage: '1 chew tablet',
        frequency: 'Daily with breakfast',
        instructions: 'Give directly by hand before his morning kibble bowl.',
        prescribedBy: 'Dr. Vivek Menon',
        active: true
      }
    ],
    healthRecords: [
      {
        id: 'hr-1',
        type: 'vaccine',
        title: 'DHPPIL + Anti-Rabies Annual Booster',
        dateAdministered: '2026-08-14',
        nextDueDate: '2027-08-14',
        vetClinic: 'Cessna Lifeline Vet Hospital',
        status: 'valid'
      },
      {
        id: 'hr-2',
        type: 'deworming',
        title: 'Drontal Plus XL Dewormer',
        dateAdministered: '2026-10-01',
        nextDueDate: '2026-12-01',
        vetClinic: 'Cessna Lifeline Vet Hospital',
        status: 'due_soon'
      },
      {
        id: 'hr-3',
        type: 'flea_tick',
        title: 'Bravecto Chewable Tick Guard',
        dateAdministered: '2026-09-15',
        nextDueDate: '2026-12-15',
        vetClinic: 'Cessna Lifeline Vet Hospital',
        status: 'valid'
      }
    ],
    primaryVet: {
      name: 'Dr. Vivek Menon, BVSc',
      clinic: 'Cessna Lifeline Veterinary Hospital',
      phone: '+91 80 4115 1234',
      address: 'Outer Ring Road, Near Bellandur Junction, Bangalore 560103'
    },
    emergencyContacts: [
      {
        id: 'ec-1',
        name: 'Neha Kapoor (Mom)',
        relation: 'Primary Pet Parent',
        phone: '+91 98450 11223',
        address: 'Tower 4, Flat 402, Green Glen Layout, Bellandur, Bangalore'
      },
      {
        id: 'ec-2',
        name: 'Arjun Kapoor (Brother)',
        relation: 'Secondary Emergency Contact',
        phone: '+91 98450 99887',
        address: 'HSR Layout Sector 2, Bangalore'
      },
      {
        id: 'ec-3',
        name: 'Cessna 24/7 Emergency Vet ICU',
        relation: '24/7 Emergency Animal Hospital',
        phone: '+91 80 4115 9999',
        address: 'Bellandur Ring Road',
        is24HourEmergency: true
      }
    ],
    caregiverNotesSummary: 'Bruno is an easy-going 31.5kg Golden. Loves short walks in shaded park grass. Always confirm front-door lock latch is secured. If he barks at the doorbell, offer a treat to redirect to his bed.',
    securityHomeCode: '4829',
    dogSpecifics: {
      walkLeashType: 'Front-clip harness',
      pottyFrequencyDaily: 3,
      crateTrained: false,
      dogParkTolerance: 'Selective'
    }
  },
  {
    id: 'pet-luna-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Calico Tabby',
    ageYears: 2,
    ageMonths: 4,
    weightKg: 4.2,
    sex: 'Female (Spayed)',
    photo: LUNA_PHOTO,
    microchipNumber: '956000088219482',
    likes: ['Laser pointer', 'Window bird watching', 'Creamy salmon puree treats', 'Chin scratches'],
    dislikes: ['Strangers touching her belly', 'Car carriers', 'Water splashes'],
    temperament: ['Curious', 'Independent', 'Quiet companion'],
    aggressionTriggers: ['Being trapped in small closed space by unfamiliar person'],
    handlingPrecautions: 'Keep balcony safety mesh closed at all times. Check litter box daily.',
    foodPreferences: 'Sheba Salmon mousse wet food + 1/3 cup Purina Pro indoor dry kibble.',
    quantityPerMeal: 'Half pouch wet food in morning, dry kibble auto-dispenser in evening.',
    feedingSchedule: '9:00 AM wet food; dry nibbles throughout day.',
    feedingRestrictions: 'Strictly zero dairy/milk (causes upset stomach).',
    waterNeedsNotes: 'Uses cat drinking water fountain. Change filter weekly.',
    allergies: [],
    medicalConditions: ['None - healthy'],
    medications: [],
    healthRecords: [
      {
        id: 'hr-c1',
        type: 'vaccine',
        title: 'FVRCP Tri-cat Vaccine + Rabies',
        dateAdministered: '2026-07-20',
        nextDueDate: '2027-07-20',
        vetClinic: 'PetCare Center Bellandur',
        status: 'valid'
      }
    ],
    primaryVet: {
      name: 'Dr. Shruti Hegde',
      clinic: 'PetCare Clinic Bellandur',
      phone: '+91 80 4220 8811',
      address: 'Sarjapur Main Road, Bangalore'
    },
    emergencyContacts: [
      {
        id: 'ec-c1',
        name: 'Neha Kapoor',
        relation: 'Primary Pet Parent',
        phone: '+91 98450 11223'
      }
    ],
    caregiverNotesSummary: 'Luna hides under the master bed for the first 5 minutes of a visit. Do not reach under to grab her; let her come out on her own once treats are shaken.',
    securityHomeCode: '4829',
    catSpecifics: {
      litterBoxType: 'Clumping clay',
      litterScoopFrequency: 'Twice daily',
      indoorOnly: true,
      balconySafetyMeshConfirmed: true,
      scratchingPostLocation: 'Living room corner next to bay window'
    }
  }
];

export const INITIAL_HELPER: HelperProfile = {
  id: 'helper-sunita-1',
  name: 'Sunita Sharma',
  phone: '+91 98765 43210',
  avatar: SUNITA_PHOTO,
  preferredLanguage: 'hi', // Hindi preferred
  interfaceMode: 'smartphone', // Switchable to 'basic_phone'
  identityVerificationStatus: 'verified',
  maskedAadhaar: 'XXXX-XXXX-3829', // Explicitly masked demo format
  policeBackgroundCheck: {
    status: 'clear',
    certificateNumber: 'KA-BLR-2026-99182',
    verifiedDate: '2026-01-15',
    issuingAuthority: 'Karnataka State Police Verification Cell (Simulated)'
  },
  experienceYears: 4.5,
  completedSitsCount: 148,
  rating: 4.96,
  reviewCount: 92,
  certifications: [
    'Canine First Aid & CPR (PetPro India)',
    'Positive Reinforcement Dog Walking Certified',
    'Feline Low-Stress Handling Standard'
  ],
  references: [
    {
      name: 'Neha Kapoor',
      petInfo: 'Bruno (Golden Retriever, 3.5 yrs)',
      locality: 'Green Glen Layout, Bellandur',
      contactPhone: '+91 98450 11223',
      verified: true
    },
    {
      name: 'Dr. Ananya Sen',
      petInfo: 'Milo (Shih Tzu, 5 yrs)',
      locality: 'HSR Layout Sector 1',
      contactPhone: '+91 98112 33445',
      verified: true
    }
  ],
  consentAgreed: true,
  consentTimestamp: '2026-01-10T09:30:00Z',
  status: 'active',
  liveLocation: {
    lat: 12.9254,
    lng: 77.6749,
    label: 'Green Glen Layout, Bellandur',
    lastUpdated: '10 mins ago'
  }
};

export const INITIAL_TASKS: CareTask[] = [
  {
    id: 'task-1',
    petId: 'pet-bruno-1',
    title: 'Morning Walk & Play in Shaded Park',
    category: 'walk',
    scheduledTime: '07:30 AM',
    estimatedDurationMins: 45,
    assignedToHelperId: 'helper-sunita-1',
    assignedHelperName: 'Sunita Sharma',
    status: 'confirmed',
    helperMarkedDone: true,
    instructions: 'Use front-clip harness, carry poop bags, walk around Lake Park perimeter path. Keep Bruno off damp muddy banks.',
    portionOrDistance: '2.4 km completed (38 mins)',
    securityCodeRequired: false,
    evidence: [
      {
        id: 'ev-1',
        type: 'gps',
        caption: 'GPS perimeter check-in: Bellandur Lake Park trail',
        timestamp: '07:34 AM',
        verifiedBy: 'system',
        confidenceScore: 98
      },
      {
        id: 'ev-2',
        type: 'photo',
        url: SUNITA_PHOTO,
        caption: 'Bruno trotting happily on leash near the pine trees',
        timestamp: '08:08 AM',
        verifiedBy: 'system',
        confidenceScore: 96
      }
    ],
    completedAt: '08:12 AM',
    notes: 'Bruno was energetic and did potty twice. Drank 250ml water upon returning.'
  },
  {
    id: 'task-2',
    petId: 'pet-bruno-1',
    title: 'Breakfast Kibble + Joint Chew',
    category: 'food',
    scheduledTime: '08:30 AM',
    estimatedDurationMins: 15,
    assignedToHelperId: 'helper-sunita-1',
    assignedHelperName: 'Sunita Sharma',
    status: 'likely',
    helperMarkedDone: true,
    instructions: '1.5 cups Royal Canin Maxi + Glycoflex joint chew directly by hand before bowl. Ensure fresh clean water.',
    portionOrDistance: '1.5 cups kibble + 1 chew',
    securityCodeRequired: false,
    evidence: [
      {
        id: 'ev-3',
        type: 'voice',
        caption: 'Voice note: "Fed Bruno at 8:32 AM, he finished the joint chew eagerly."',
        timestamp: '08:35 AM',
        verifiedBy: 'system',
        confidenceScore: 78
      }
    ],
    completedAt: '08:35 AM',
    notes: 'Sunita tapped Done and sent voice note. Photo evidence was not captured yet.'
  },
  {
    id: 'task-3',
    petId: 'pet-bruno-1',
    title: 'Midday Potty & Hydration Check',
    category: 'potty',
    scheduledTime: '01:30 PM',
    estimatedDurationMins: 20,
    assignedToHelperId: 'helper-sunita-1',
    assignedHelperName: 'Sunita Sharma',
    status: 'not_confirmed',
    helperMarkedDone: false,
    instructions: 'Quick 10-min garden relief, check water bowl level, give a carrot snack.',
    portionOrDistance: '10 min quick potty relief',
    securityCodeRequired: true,
    evidence: [],
    notes: 'Scheduled for 1:30 PM. No task evidence uploaded. System escalation active.',
    overdueMinutes: 45
  },
  {
    id: 'task-4',
    petId: 'pet-bruno-1',
    title: 'Evening Walk & Sniffari',
    category: 'walk',
    scheduledTime: '05:30 PM',
    estimatedDurationMins: 45,
    assignedToHelperId: 'helper-sunita-1',
    assignedHelperName: 'Sunita Sharma',
    status: 'upcoming',
    helperMarkedDone: false,
    instructions: 'Avoid main gate traffic. Let him sniff grass patches. Check paws for small burrs upon return.',
    portionOrDistance: 'Target 2.0 km',
    securityCodeRequired: false,
    evidence: []
  },
  {
    id: 'task-5',
    petId: 'pet-bruno-1',
    title: 'Dinner (Chicken & Broth Mix)',
    category: 'food',
    scheduledTime: '07:45 PM',
    estimatedDurationMins: 20,
    assignedToHelperId: 'helper-sunita-1',
    assignedHelperName: 'Sunita Sharma',
    status: 'upcoming',
    helperMarkedDone: false,
    instructions: 'Warm 50g chicken in microwave for 10 seconds. Mix thoroughly with evening kibble.',
    portionOrDistance: '1.5 cups + 50g warm chicken',
    securityCodeRequired: true,
    evidence: []
  }
];

// Phase 3: Daily Handover Initial Data
export const INITIAL_HANDOVERS: DailyCareHandover[] = [
  {
    id: 'handover-bruno-today',
    petId: 'pet-bruno-1',
    date: '2026-11-07',
    createdAt: '07:10 AM Today',
    petHealthCondition: 'healthy',
    appetiteStatus: 'normal',
    waterIntakeStatus: 'normal',
    newSymptomsNotes: 'Bruno scratched his right ear twice yesterday evening. No odor or redness, but check gently.',
    todayMedicationOverrides: 'Standard Glycoflex joint chew with breakfast.',
    todayFeedingNotes: 'Warm the chicken broth for 10s extra as morning was slightly chilly.',
    todayWalkExerciseNotes: 'Stick to shaded lake trail. Avoid lawn with fresh sprinkler mud.',
    specialPrecautionsToday: 'Front-clip harness only; neighbor beagle is on walk around 7:45 AM.',
    vetGuidanceAcknowledged: false,
    status: 'acknowledged',
    acknowledgedAt: '07:22 AM Today',
    acknowledgedByHelperId: 'helper-sunita-1',
    diffSummary: [
      'Ear observation noted (scratching right ear)',
      'Front-clip harness strictly requested for lake trail'
    ]
  }
];

// Phase 4: Missed Call & IVR Activity Logs
export const INITIAL_IVR_LOGS: MissedCallOrIVRLog[] = [
  {
    id: 'ivr-log-1',
    helperPhone: '+91 98765 43210',
    helperName: 'Sunita Sharma',
    eventType: 'missed_call',
    dialedNumber: '1800-PAWSURE-BELLANDUR',
    timestamp: '07:34 AM Today',
    durationSeconds: 4,
    recognizedAsVisitProofOnly: true,
    statusText: 'Visit arrival registered via toll-free missed call. Note: Task proof still requires photo/code.'
  },
  {
    id: 'ivr-log-2',
    helperPhone: '+91 98765 43210',
    helperName: 'Sunita Sharma',
    eventType: 'ivr_code_entry',
    dialedNumber: '1800-PAWSURE',
    timestamp: '08:34 AM Today',
    durationSeconds: 28,
    selectedTaskTitle: 'Morning Walk (Task #1)',
    enteredCode: '4829',
    recognizedAsVisitProofOnly: false,
    statusText: 'IVR keypad entry: Task 1 confirmed with household security passcode.'
  }
];

export const INITIAL_FRIENDS: FriendContact[] = [
  {
    id: 'friend-1',
    name: 'Rahul Mukherji',
    petName: 'Rocky',
    petBreed: 'Indie Dog (Rescued)',
    distanceKm: 0.35,
    locality: 'Green Glen Layout, Tower 2',
    availableForEmergency: true,
    phone: '+91 99201 44556',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    isSimulatedNearby: true
  },
  {
    id: 'friend-2',
    name: 'Priya Sharma',
    petName: 'Bagel',
    petBreed: 'Beagle (2 yrs)',
    distanceKm: 0.6,
    locality: 'Sobha Hibiscus, Bellandur',
    availableForEmergency: true,
    phone: '+91 98450 77112',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
    isSimulatedNearby: true
  },
  {
    id: 'friend-3',
    name: 'Karan & Divya',
    petName: 'Simba',
    petBreed: 'Golden Retriever',
    distanceKm: 1.1,
    locality: 'Adarsh Palm Retreat',
    availableForEmergency: false,
    phone: '+91 98860 33441',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    isSimulatedNearby: true
  }
];

// Phase 5: Escalations with Ladder Timelines
export const INITIAL_ESCALATIONS: EscalationItem[] = [
  {
    id: 'esc-1',
    type: 'missed_task',
    title: 'Midday Potty & Hydration Check Overdue',
    householdName: 'Neha Kapoor (Tower 4, Apt 402)',
    petName: 'Bruno (Golden Retriever)',
    helperName: 'Sunita Sharma',
    timestamp: 'Today, 02:15 PM',
    severity: 'high',
    status: 'active',
    details: 'Scheduled time 01:30 PM. Elapsed: +45 mins without helper GPS check-in, photo or IVR code confirmation.',
    actionRequired: 'Automated helper reminder sent. Owner alert dispatched. Backup circle standby active.',
    currentStage: 'owner_missed_alert',
    simulatedOverdueMins: 45,
    timeline: [
      {
        stage: 'task_due',
        timestamp: '01:30 PM',
        status: 'delivered',
        note: 'Task window opened for 1:30 PM.'
      },
      {
        stage: 'helper_reminder',
        timestamp: '01:45 PM',
        status: 'delivered',
        note: 'Automated SMS & push reminder dispatched to Sunita (+91 98765 43210).'
      },
      {
        stage: 'owner_missed_alert',
        timestamp: '02:00 PM',
        status: 'delivered',
        note: 'Care gap alert sent to Neha. Status changed to "Not confirmed".'
      }
    ]
  },
  {
    id: 'esc-2',
    type: 'unconfirmed_care',
    title: 'Breakfast Task Evidence Incomplete (Status: Likely)',
    householdName: 'Neha Kapoor (Tower 4, Apt 402)',
    petName: 'Bruno (Golden Retriever)',
    helperName: 'Sunita Sharma',
    timestamp: 'Today, 08:35 AM',
    severity: 'medium',
    status: 'investigating',
    details: 'Helper marked task "Done" and sent voice clip, but no photo of the finished bowl or joint chew was attached.',
    actionRequired: 'Awaiting caregiver photo upload or owner manual sign-off.',
    currentStage: 'helper_reminder',
    simulatedOverdueMins: 0,
    timeline: [
      {
        stage: 'task_due',
        timestamp: '08:30 AM',
        status: 'delivered',
        note: 'Breakfast due.'
      },
      {
        stage: 'helper_reminder',
        timestamp: '08:35 AM',
        status: 'actioned',
        note: 'Helper marked Done; system flagged as "Likely" pending visual bowl proof.'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '07:34 AM',
    actor: 'Sunita Sharma',
    actorRole: 'helper',
    action: 'Basic-Phone Missed-Call Recorded',
    details: 'Missed-call received on 1800-PAWSURE from +91 98765 43210. Registered as Visit Arrival Evidence (Not Task Proof).',
    category: 'telephony'
  },
  {
    id: 'log-2',
    timestamp: '08:12 AM',
    actor: 'System AI Audit',
    actorRole: 'system',
    action: 'Task Auto-Confirmed',
    details: 'Morning Walk task verified as Confirmed via GPS trail match and timestamped leash photo.',
    category: 'verification'
  },
  {
    id: 'log-3',
    timestamp: '08:35 AM',
    actor: 'Sunita Sharma',
    actorRole: 'helper',
    action: 'Task Marked Done (Unverified)',
    details: 'Breakfast marked done with voice note only. Classified as "Likely" pending visual bowl evidence.',
    category: 'task'
  },
  {
    id: 'log-4',
    timestamp: '02:00 PM',
    actor: 'Pawsure Sentinel',
    actorRole: 'system',
    action: 'Escalation Ladder Stage 3 Triggered',
    details: 'Task "Midday Potty" overdue by 30 minutes. Status changed to "Not confirmed". Alert pushed to Neha.',
    category: 'safety'
  }
];

// Phase 6: Rewards & Ratings Initial Data
export const INITIAL_REWARDS: OwnerRewardAccount = {
  pointsBalance: 320,
  pendingPoints: 40, // 40 points pending from "Likely" or "Not confirmed" tasks
  lifetimeEarned: 1480,
  pilotTier: 'Gold Guardian',
  vouchers: [
    {
      id: 'v-1',
      partnerName: 'Heads Up For Tails (HUFT)',
      title: '₹250 Off on Healthy Pet Treats & Kibble',
      discountDesc: 'Valid on purchases above ₹999 at HUFT Bellandur or online.',
      pointsCost: 200,
      claimed: false,
      promoCode: 'PAWSURE-HUFT250'
    },
    {
      id: 'v-2',
      partnerName: 'Cessna Lifeline Pet Grooming',
      title: '20% Off Medicated Spa & Bath Session',
      discountDesc: 'Includes nail trimming, ear flush, and antibacterial coat bath.',
      pointsCost: 300,
      claimed: false,
      promoCode: 'PAWSURE-CESSNA20'
    },
    {
      id: 'v-3',
      partnerName: 'FreshWoof Organic Meal Prep',
      title: '₹150 Fresh Boiled Chicken Broth Sample Pack',
      discountDesc: 'Ready-to-serve preservative-free meal topper.',
      pointsCost: 150,
      claimed: true,
      promoCode: 'CLAIMED-PAW-881'
    }
  ]
};

export const INITIAL_CAREGIVER_RATINGS: CaregiverRating[] = [
  {
    id: 'rev-1',
    taskId: 'task-hist-1',
    petName: 'Bruno',
    ownerName: 'Neha Kapoor',
    ratingStars: 5,
    feedbackText: 'Sunita is exceptional. Follows the harness precautions strictly and Bruno always comes back calm and happy.',
    date: '2026-11-05',
    status: 'published'
  },
  {
    id: 'rev-2',
    taskId: 'task-hist-2',
    petName: 'Milo',
    ownerName: 'Dr. Ananya Sen',
    ratingStars: 5,
    feedbackText: 'Very punctual with the basic phone check-ins and handles Milo’s medicine time without any stress.',
    date: '2026-11-03',
    status: 'published'
  }
];
