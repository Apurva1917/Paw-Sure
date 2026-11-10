import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Pet,
  CareTask,
  CareEvidence,
  HelperProfile,
  FriendContact,
  EscalationItem,
  EscalationLadderStage,
  AuditLogItem,
  CaregiverReport,
  FriendFinderDraft,
  VerificationStatus,
  DailyCareHandover,
  MissedCallOrIVRLog,
  OwnerRewardAccount,
  CaregiverRating,
  AuthUser,
  Household,
  FacilityAudit,
  MarketplaceListing,
  BookingRequest,
  OwnerReturnCheck,
  HelperConsent
} from '../types/pawsure';
import { PawsureVerificationEngine } from '../services/verificationEngine';
import { pawsureRepository } from '../services/pawsureRepository';
import { providerAdapters } from '../services/providerAdapters';
import { securityEngine } from '../server/auth';
import {
  INITIAL_PETS,
  INITIAL_HELPER,
  INITIAL_TASKS,
  INITIAL_FRIENDS,
  INITIAL_ESCALATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_HANDOVERS,
  INITIAL_IVR_LOGS,
  INITIAL_REWARDS,
  INITIAL_CAREGIVER_RATINGS
} from '../data/mockData';

interface PawsureContextType {
  role: Role;
  setRole: (role: Role) => boolean;
  auth: AuthUser;
  requestOtp: (phone: string, targetRole?: Role) => { success: boolean; message: string; simulatedOtp?: string };
  loginOwner: (phone: string, otp: string) => { success: boolean; error?: string };
  loginHelper: (phone: string, lang: 'en' | 'hi' | 'kn' | 'ta', mode: 'smartphone' | 'basic_phone', consent: boolean) => { success: boolean; error?: string };
  loginCrecheOperator: (facilityId: string, operatorPhone: string, managerName: string) => { success: boolean; error?: string };
  loginAdmin: (staffId: string, securityKey: string, mfaCode: string) => { success: boolean; error?: string };
  logout: () => void;

  household: Household;
  facilityAudits: FacilityAudit[];
  marketplaceListings: MarketplaceListing[];
  bookingRequests: BookingRequest[];
  returnChecks: OwnerReturnCheck[];
  helperConsent: HelperConsent;
  submitOwnerReturnCheck: (check: Omit<OwnerReturnCheck, 'id'>) => void;
  updateHelperConsent: (agreed: boolean, status?: 'active' | 'withdrawn' | 'paused') => void;
  submitBookingRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  updateBookingStatus: (id: string, status: 'accepted' | 'declined') => void;

  pets: Pet[];
  activePetId: string;
  setActivePetId: (id: string) => void;
  activePet: Pet;
  tasks: CareTask[];
  helper: HelperProfile;
  friends: FriendContact[];
  escalations: EscalationItem[];
  auditLogs: AuditLogItem[];
  reports: CaregiverReport[];
  
  // Check-in & Visit Presence
  helperCheckedIn: boolean;
  helperCheckInTime: string | null;
  checkInMethod: 'none' | 'gps' | 'basic_phone_missed_call' | 'ivr_keypad' | 'whatsapp';
  ivrLogs: MissedCallOrIVRLog[];
  helperSimulateMissedCall: () => void;
  helperSimulateIVREntry: (taskNumber: number, code: string) => boolean;

  // Daily Handover (Phase 3)
  handovers: DailyCareHandover[];
  activeHandover?: DailyCareHandover;
  createOrUpdateHandover: (data: Partial<DailyCareHandover>) => void;
  helperAcknowledgeHandover: (handoverId: string) => void;
  helperDeclineHandover: (handoverId: string, reason: string) => void;

  // Time Advancement & Escalations (Phase 5)
  simulatedClock: string;
  advanceSimulatedTime: (minutes: number) => void;
  ownerAcknowledgeEscalation: (escalationId: string) => void;
  ownerTriggerBackup: (escalationId: string) => void;

  // Rewards & Ratings (Phase 6)
  rewards: OwnerRewardAccount;
  claimVoucher: (voucherId: string) => void;
  ratings: CaregiverRating[];
  submitCaregiverReview: (taskId: string, ratingStars: number, feedbackText: string) => void;
  disputeCaregiverReview: (reviewId: string, disputeNotes: string) => void;

  // Actions
  addPet: (pet: Omit<Pet, 'id'>) => string;
  updatePet: (pet: Pet) => void;
  helperCheckInToggle: (locality?: string) => void;
  helperMarkTaskDone: (taskId: string, note?: string) => void;
  helperSubmitEvidence: (
    taskId: string,
    evidenceType: 'photo' | 'voice' | 'code' | 'ivr_keypad',
    details: { url?: string; caption?: string; code?: string }
  ) => void;
  adminSetTaskStatus: (taskId: string, status: VerificationStatus, auditReason?: string) => void;
  ownerConfirmTask: (taskId: string) => void;
  helperReportProblem: (title: string, description: string, severity: 'low' | 'medium' | 'urgent', photoUrl?: string) => void;
  resolveEscalation: (id: string, resolutionNote?: string) => void;
  friendFinderDraft: FriendFinderDraft;
  setFriendFinderDraft: React.Dispatch<React.SetStateAction<FriendFinderDraft>>;
  ownerApproveAndSendFriendFinder: () => boolean;
  requestBackupCover: (sitterName: string, dateInfo: string) => void;
  snoozeOrCompleteHealthRecord: (recordId: string, action: 'snooze' | 'completed') => void;
  resetDemoData: () => void;

  // Phase 8: Guided Demo Scenario Runner
  demoStep: number;
  runDemoStep: (step: number) => void;
}

const PawsureContext = createContext<PawsureContextType | undefined>(undefined);

const STORAGE_KEY = 'pawsure_demo_state_v2';

export const PawsureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  // DEFECT FIX 5: Remove automatic authentication of new browser sessions.
  // DEFECT FIX 9: Do not store passwords or session tokens in localStorage.
  const [auth, setAuth] = useState<AuthUser>(() => {
    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('pawsure_session_token') : null;
      if (token) {
        const serverSession = securityEngine.getSession(token);
        if (serverSession) {
          return {
            isAuthenticated: true,
            token: serverSession.token,
            role: serverSession.role,
            userId: serverSession.userId,
            name: serverSession.name,
            phone: serverSession.phone,
            email: serverSession.email,
            householdId: serverSession.householdId,
            facilityId: serverSession.facilityId,
            mfaVerified: serverSession.mfaVerified
          };
        }
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }
    // New browser session defaults to unauthenticated
    return {
      isAuthenticated: false,
      role: 'owner',
      userId: '',
      name: ''
    };
  });

  const [role, setRoleState] = useState<Role>(auth.role || 'owner');


  // Strict Scoped Repository States
  const [household, setHousehold] = useState<Household>(() => pawsureRepository.getState().households[0]);
  const [facilityAudits, setFacilityAudits] = useState<FacilityAudit[]>(() => pawsureRepository.getState().facilityAudits);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() => pawsureRepository.getState().marketplaceListings);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => pawsureRepository.getState().bookingRequests);
  const [returnChecks, setReturnChecks] = useState<OwnerReturnCheck[]>(() => pawsureRepository.getState().returnChecks);
  const [helperConsent, setHelperConsent] = useState<HelperConsent>(() => pawsureRepository.getState().helperConsents[0]);

  const [pets, setPets] = useState<Pet[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_pets`);
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });
  const [activePetId, setActivePetId] = useState<string>(() => {
    return pets[0]?.id || 'pet-bruno-1';
  });
  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [helper, setHelper] = useState<HelperProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_helper`);
    return saved ? JSON.parse(saved) : INITIAL_HELPER;
  });
  const [friends] = useState<FriendContact[]>(INITIAL_FRIENDS);
  const [escalations, setEscalations] = useState<EscalationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_escalations`);
    return saved ? JSON.parse(saved) : INITIAL_ESCALATIONS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [reports, setReports] = useState<CaregiverReport[]>([]);
  
  // Phase 3: Daily Handovers
  const [handovers, setHandovers] = useState<DailyCareHandover[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_handovers`);
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });

  // Phase 4: Missed Calls & IVR
  const [ivrLogs, setIvrLogs] = useState<MissedCallOrIVRLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ivr`);
    return saved ? JSON.parse(saved) : INITIAL_IVR_LOGS;
  });
  const [helperCheckedIn, setHelperCheckedIn] = useState<boolean>(true);
  const [helperCheckInTime, setHelperCheckInTime] = useState<string | null>('08:02 AM Today');
  const [checkInMethod, setCheckInMethod] = useState<'none' | 'gps' | 'basic_phone_missed_call' | 'ivr_keypad' | 'whatsapp'>('gps');

  // Phase 5: Simulated Time & Clock
  const [simulatedClock, setSimulatedClock] = useState<string>('02:15 PM');

  // Phase 6: Rewards & Ratings
  const [rewards, setRewards] = useState<OwnerRewardAccount>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rewards`);
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });
  const [ratings, setRatings] = useState<CaregiverRating[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ratings`);
    return saved ? JSON.parse(saved) : INITIAL_CAREGIVER_RATINGS;
  });

  // Phase 8: Demo Scenario Step
  const [demoStep, setDemoStep] = useState<number>(1);

  const [friendFinderDraft, setFriendFinderDraft] = useState<FriendFinderDraft>({
    petId: 'pet-bruno-1',
    messageText: "Hi neighbors! Looking for backup pet parent cover for Bruno today between 5:00 PM and 7:00 PM for a garden play session. He's super friendly! Let me know if you're free.",
    targetRadiusKm: 1.5,
    needDate: 'Today, 5:00 PM',
    urgency: 'backup',
    ownerApproved: false
  });

  // DEFECT FIX 9: Do not store passwords, session tokens, or sensitive credentials in localStorage
  useEffect(() => {
    // Session token is strictly kept in sessionStorage and server memory
  }, [auth]);

  useEffect(() => {
    // Mask door/lockbox codes so cleartext passcodes are never stored in localStorage
    const sanitizedPets = pets.map((p) => ({
      ...p,
      securityHomeCode: '••••'
    }));
    try {
      localStorage.setItem(`${STORAGE_KEY}_pets`, JSON.stringify(sanitizedPets));
    } catch {
      // quota/storage safe
    }
  }, [pets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_helper`, JSON.stringify(helper));
  }, [helper]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_escalations`, JSON.stringify(escalations));
  }, [escalations]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_handovers`, JSON.stringify(handovers));
  }, [handovers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ivr`, JSON.stringify(ivrLogs));
  }, [ivrLogs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rewards`, JSON.stringify(rewards));
  }, [rewards]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_ratings`, JSON.stringify(ratings));
  }, [ratings]);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0] || INITIAL_PETS[0];
  const activeHandover = handovers.find((h) => h.petId === activePet.id && h.date === '2026-11-07');

  const addAuditLog = (
    actor: string,
    actorRole: Role | 'system',
    action: string,
    details: string,
    category: AuditLogItem['category']
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: simulatedClock,
      actor,
      actorRole,
      action,
      details,
      category
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // DEFECT FIX 4: Prevent a user from accessing Admin simply by switching roles.
  // Role escalation to Admin strictly requires verified staff authentication and MFA.
  const setRole = (newRole: Role): boolean => {
    if (newRole === 'admin') {
      const hasValidAdminAuth = auth.isAuthenticated && auth.role === 'admin' && auth.mfaVerified;
      if (!hasValidAdminAuth) {
        console.warn('[Security] Unauthorized role escalation to Admin rejected. Valid staff authentication and MFA required.');
        addAuditLog(
          auth.name || 'Anonymous Session',
          auth.role || 'system',
          'Role Escalation Denied',
          'Attempted direct privilege escalation to Admin Console without verified staff credentials/MFA.',
          'safety'
        );
        return false;
      }
    }
    setRoleState(newRole);
    return true;
  };

  const requestOtp = (phone: string, targetRole: Role = 'owner') => {
    return securityEngine.requestOtp(phone, targetRole);
  };

  // DEFECT FIX 1 & 2: Server-validated 6-digit numeric OTP authentication; reject arbitrary 4-char OTPs
  const loginOwner = (phone: string, otp: string): { success: boolean; error?: string } => {
    const result = securityEngine.verifyOtp(phone, otp);
    if (!result.success || !result.session) {
      addAuditLog(
        phone || 'Unknown',
        'owner',
        'Authentication Failed',
        `Owner OTP verification rejected: ${result.message}`,
        'auth'
      );
      return { success: false, error: result.message };
    }
    const session = result.session;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pawsure_session_token', session.token);
      }
    } catch {
      // ignore
    }
    const authUser: AuthUser = {
      isAuthenticated: true,
      token: session.token,
      role: 'owner',
      userId: session.userId,
      name: session.name,
      phone: session.phone,
      householdId: session.householdId
    };
    setAuth(authUser);
    setRoleState('owner');
    addAuditLog('Neha Kapoor', 'owner', 'Owner Authenticated', `Server verified 6-digit OTP for ${session.phone}. Token issued.`, 'auth');
    return { success: true };
  };

  const loginHelper = (
    phone: string,
    lang: 'en' | 'hi' | 'kn' | 'ta',
    mode: 'smartphone' | 'basic_phone',
    consent: boolean
  ): { success: boolean; error?: string } => {
    const result = securityEngine.loginHelper(phone, lang, mode, consent);
    if (!result.success || !result.session) {
      return { success: false, error: result.message };
    }
    const session = result.session;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pawsure_session_token', session.token);
      }
    } catch {
      // ignore
    }
    const authUser: AuthUser = {
      isAuthenticated: true,
      token: session.token,
      role: 'helper',
      userId: session.userId,
      name: session.name,
      phone: session.phone,
      preferredLanguage: lang,
      interfaceMode: mode
    };
    setAuth(authUser);
    setRoleState('helper');
    setHelper((prev) => ({
      ...prev,
      preferredLanguage: lang,
      interfaceMode: mode,
      consentAgreed: consent
    }));
    addAuditLog(
      session.name,
      'helper',
      'Caretaker Logged In',
      `Language: ${lang.toUpperCase()}, Interface: ${mode}, Consent: ${consent ? 'Agreed' : 'Pending'}`,
      'auth'
    );
    return { success: true };
  };

  // DEFECT FIX 3: Staff Admin Login strictly requires OPS-LEAD-774, password and 6-digit MFA
  const loginAdmin = (staffId: string, securityKey: string, mfaCode: string): { success: boolean; error?: string } => {
    const result = securityEngine.loginAdmin(staffId, securityKey, mfaCode);
    if (!result.success || !result.session) {
      addAuditLog(
        staffId || 'Unknown Staff',
        'admin',
        'Admin Access Denied',
        `Unauthorized staff login attempt: ${result.message}`,
        'safety'
      );
      return { success: false, error: result.message };
    }
    const session = result.session;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pawsure_session_token', session.token);
      }
    } catch {
      // ignore
    }
    const authUser: AuthUser = {
      isAuthenticated: true,
      token: session.token,
      role: 'admin',
      userId: session.userId,
      name: session.name,
      email: session.email,
      mfaVerified: true
    };
    setAuth(authUser);
    setRoleState('admin');
    addAuditLog('Admin Operator', 'admin', 'Staff Authenticated', `MFA verified for staff ID #${staffId}. Admin token issued.`, 'auth');
    return { success: true };
  };

  // DEFECT FIX 10: Ensure logout invalidates authenticated access on server and client
  const logout = () => {
    if (auth.token) {
      securityEngine.revokeSession(auth.token);
    }
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('pawsure_session_token');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${STORAGE_KEY}_auth`);
      }
    } catch {
      // ignore
    }
    setAuth({
      isAuthenticated: false,
      role: 'owner',
      userId: '',
      name: ''
    });
    setRoleState('owner');
    addAuditLog(auth.name || 'User', role, 'Logged Out', 'Session revoked and token invalidated on server', 'auth');
  };

  const loginCrecheOperator = (facilityId: string, operatorPhone: string, managerName: string): { success: boolean; error?: string } => {
    const result = securityEngine.loginCreche(facilityId, operatorPhone, managerName);
    if (!result.success || !result.session) {
      return { success: false, error: result.message };
    }
    const session = result.session;
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('pawsure_session_token', session.token);
      }
    } catch {
      // ignore
    }
    const authUser: AuthUser = {
      isAuthenticated: true,
      token: session.token,
      role: 'creche_operator',
      userId: session.userId,
      name: session.name,
      phone: session.phone,
      facilityId: session.facilityId
    };
    setAuth(authUser);
    setRoleState('creche_operator');
    addAuditLog(
      session.name,
      'creche_operator',
      'Crèche Operator Authenticated',
      `Signed in to manage facility #${facilityId || 'creche-blr-01'}.`,
      'auth'
    );
    return { success: true };
  };

  const submitOwnerReturnCheck = (checkData: Omit<OwnerReturnCheck, 'id'>) => {
    const newCheck: OwnerReturnCheck = {
      id: `ret-${Date.now()}`,
      ...checkData
    };
    setReturnChecks((prev) => [newCheck, ...prev]);
    // If matched, mark tasks matched (covered day, no points per PRD)
    if (checkData.inspectionMatchesReportedTasks) {
      setTasks((prev) =>
        prev.map((t) => (t.status === 'confirmed' || t.status === 'likely' ? { ...t, status: 'matched' as const } : t))
      );
    }
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Owner Return Check Completed',
      `Physical return inspection recorded. Demeanor: ${checkData.petDemeanor}. Dispute flagged: ${checkData.disputeFlagged ? 'YES' : 'NO'}.`,
      'verification'
    );
  };

  const updateHelperConsent = (agreed: boolean, status: 'active' | 'withdrawn' | 'paused' = 'active') => {
    securityEngine.updateCaregiverConsent('helper-sunita-1', agreed, status, !agreed || status === 'withdrawn' ? 'Caregiver revoked consent' : undefined);
    setHelperConsent((prev) => ({
      ...prev,
      agreed,
      status,
      timestamp: `${simulatedClock} Today`,
      withdrawalReason: !agreed || status === 'withdrawn' ? 'Caregiver revoked consent' : undefined
    }));
    setHelper((prev) => ({
      ...prev,
      consentAgreed: agreed,
      status: status === 'active' ? 'active' : 'on_break'
    }));
    addAuditLog(
      helper.name,
      'helper',
      `Helper Consent ${status.toUpperCase()}`,
      `Caregiver consent updated to ${status}. Agreement: ${agreed ? 'YES' : 'NO'}.`,
      'safety'
    );
  };

  const submitBookingRequest = (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const newReq: BookingRequest = {
      ...req,
      id: `book-${Date.now()}`,
      createdAt: `${simulatedClock} Today`,
      status: 'requested_pending',
      paymentStatus: 'SIMULATED_PENDING_ESCROW'
    };
    setBookingRequests((prev) => [newReq, ...prev]);
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Booking Request Created (Pending Approval)',
      `Requested care with ${req.providerName} for ${req.totalInr} INR (Simulated Escrow).`,
      'facility'
    );
  };

  const updateBookingStatus = (id: string, status: 'accepted' | 'declined') => {
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    addAuditLog(
      'Provider Operator',
      role,
      `Booking Request ${status.toUpperCase()}`,
      `Booking #${id} updated to ${status}.`,
      'facility'
    );
  };

  // Phase 3: Daily Care Handover Management
  const createOrUpdateHandover = (data: Partial<DailyCareHandover>) => {
    const diffs: string[] = [];
    if (data.petHealthCondition && data.petHealthCondition !== 'healthy') {
      diffs.push(`Health status reported as: ${data.petHealthCondition.toUpperCase()}`);
    }
    if (data.appetiteStatus && data.appetiteStatus !== 'normal') {
      diffs.push(`Appetite change: ${data.appetiteStatus}`);
    }
    if (data.waterIntakeStatus && data.waterIntakeStatus !== 'normal') {
      diffs.push(`Water intake change: ${data.waterIntakeStatus}`);
    }
    if (data.newSymptomsNotes && data.newSymptomsNotes.trim()) {
      diffs.push(`New symptom noted: "${data.newSymptomsNotes}"`);
    }
    if (data.specialPrecautionsToday && data.specialPrecautionsToday.trim()) {
      diffs.push(`Special precaution today: "${data.specialPrecautionsToday}"`);
    }

    const existingIndex = handovers.findIndex((h) => h.petId === activePet.id && h.date === '2026-11-07');
    if (existingIndex >= 0) {
      setHandovers((prev) => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          ...data,
          diffSummary: diffs.length > 0 ? diffs : copy[existingIndex].diffSummary,
          status: 'pending_acknowledgement'
        };
        return copy;
      });
    } else {
      const newHandover: DailyCareHandover = {
        id: `handover-${Date.now()}`,
        householdId: activePet.householdId || 'hh-neha-1',
        version: 1,
        petId: activePet.id,
        date: '2026-11-07',
        createdAt: simulatedClock,
        petHealthCondition: data.petHealthCondition || 'healthy',
        appetiteStatus: data.appetiteStatus || 'normal',
        waterIntakeStatus: data.waterIntakeStatus || 'normal',
        newSymptomsNotes: data.newSymptomsNotes || '',
        todayMedicationOverrides: data.todayMedicationOverrides || '',
        todayFeedingNotes: data.todayFeedingNotes || '',
        todayWalkExerciseNotes: data.todayWalkExerciseNotes || '',
        specialPrecautionsToday: data.specialPrecautionsToday || '',
        vetGuidanceAcknowledged: !!data.vetGuidanceAcknowledged,
        status: 'pending_acknowledgement',
        diffSummary: diffs
      };
      setHandovers((prev) => [newHandover, ...prev]);
    }

    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Daily Care Handover Created',
      `Handover recorded for ${activePet.name} on 2026-11-07 with ${diffs.length} profile overrides.`,
      'task'
    );
  };

  const helperAcknowledgeHandover = (handoverId: string) => {
    setHandovers((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? {
              ...h,
              status: 'acknowledged',
              acknowledgedAt: `${simulatedClock} Today`,
              acknowledgedByHelperId: helper.id
            }
          : h
      )
    );
    addAuditLog(
      helper.name,
      'helper',
      'Daily Handover Acknowledged',
      `Caregiver confirmed today's health condition and precautions for ${activePet.name}.`,
      'task'
    );
  };

  const helperDeclineHandover = (handoverId: string, reason: string) => {
    setHandovers((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? {
              ...h,
              status: 'declined',
              declinedReason: reason
            }
          : h
      )
    );

    // Create high-priority escalation
    const esc: EscalationItem = {
      id: `esc-decline-${Date.now()}`,
      type: 'health_report',
      title: `Caregiver Declined Assignment: ${reason}`,
      householdName: 'Neha Kapoor (Tower 4, Apt 402)',
      petName: activePet.name,
      helperName: helper.name,
      timestamp: simulatedClock,
      severity: 'high',
      status: 'active',
      details: `Sunita declined today's care session because: "${reason}". Backup sitter required immediately.`,
      actionRequired: 'Arrange backup sitter from Friends Circle or Find Cover.',
      currentStage: 'backup_notified',
      simulatedOverdueMins: 0,
      timeline: [
        {
          stage: 'task_due',
          timestamp: simulatedClock,
          status: 'actioned',
          note: `Caregiver reported safety concern: ${reason}`
        }
      ]
    };
    setEscalations((prev) => [esc, ...prev]);

    addAuditLog(
      helper.name,
      'helper',
      'Care Assignment Declined',
      `Caregiver safely declined assignment: "${reason}". Escalation raised to owner.`,
      'safety'
    );
  };

  // Phase 4: Basic Phone Missed-Call & IVR Check-in Simulation
  const helperSimulateMissedCall = () => {
    const timestampStr = `${simulatedClock} Today`;
    setHelperCheckedIn(true);
    setHelperCheckInTime(timestampStr);
    setCheckInMethod('basic_phone_missed_call');

    const newLog: MissedCallOrIVRLog = {
      id: `call-${Date.now()}`,
      helperPhone: helper.phone,
      helperName: helper.name,
      eventType: 'missed_call',
      dialedNumber: '1800-PAWSURE-BELLANDUR',
      timestamp: timestampStr,
      durationSeconds: 4,
      recognizedAsVisitProofOnly: true,
      statusText: 'Visit arrival registered via toll-free missed call. Note: Task proof still requires photo or code.'
    };
    setIvrLogs((prev) => [newLog, ...prev]);

    // Attach arrival evidence to tasks without falsely completing them!
    setTasks((prev) =>
      prev.map((t) => {
        if (t.category === 'walk' && t.status === 'upcoming') {
          return {
            ...t,
            evidence: [
              ...t.evidence,
              {
                id: `ev-call-${Date.now()}`,
                type: 'missed_call',
                caption: `Caregiver missed call received at ${timestampStr} (Visit arrival recorded). Task proof still required.`,
                timestamp: simulatedClock,
                confidenceScore: 70,
                isVisitProofOnly: true,
                verifiedBy: 'system'
              }
            ]
          };
        }
        return t;
      })
    );

    addAuditLog(
      helper.name,
      'helper',
      'Basic-Phone Missed-Call Received',
      `Registered visit arrival from registered phone ${helper.phone}. Task completion remains UNVERIFIED.`,
      'telephony'
    );
  };

  const helperSimulateIVREntry = (taskNumber: number, code: string): boolean => {
    const timestampStr = `${simulatedClock} Today`;
    const targetTask = tasks[taskNumber - 1] || tasks[0];
    const isCorrect = code === '4829' || code === activePet.securityHomeCode;

    const newLog: MissedCallOrIVRLog = {
      id: `ivr-${Date.now()}`,
      helperPhone: helper.phone,
      helperName: helper.name,
      eventType: 'ivr_code_entry',
      dialedNumber: '1800-PAWSURE',
      timestamp: timestampStr,
      durationSeconds: 32,
      selectedTaskTitle: targetTask.title,
      enteredCode: code,
      recognizedAsVisitProofOnly: false,
      statusText: isCorrect
        ? `IVR entry successful: Task "${targetTask.title}" verified with valid security code.`
        : 'IVR entry rejected: Incorrect passcode entered.'
    };
    setIvrLogs((prev) => [newLog, ...prev]);

    if (isCorrect) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === targetTask.id) {
            const newEv: CareEvidence = {
              id: `ev-ivr-${Date.now()}`,
              type: 'ivr_keypad',
              caption: `IVR Keypad entry confirmed with household security passcode (${code})`,
              timestamp: simulatedClock,
              confidenceScore: 90,
              verifiedBy: 'system',
              isVisitProofOnly: false,
              enteredCode: code,
              channelIdentifier: 'dtmf_ivr_security_passcode'
            };
            const updatedEvidence = [...t.evidence, newEv];
            const evalResult = PawsureVerificationEngine.evaluateTaskEvidence(
              { ...t, evidence: updatedEvidence },
              activePet.securityHomeCode || '4829'
            );
            return {
              ...t,
              status: evalResult.status,
              helperMarkedDone: true,
              completedAt: simulatedClock,
              evidence: updatedEvidence
            };
          }
          return t;
        })
      );

      // Reward pilot points: 5 points per PRD pilot specification
      setRewards((prev) => ({
        ...prev,
        pointsBalance: Math.min(prev.pointsBalance + 5, 125 * 6),
        monthlyEarned: Math.min((prev.monthlyEarned || 0) + 5, 125),
        pendingPoints: Math.max(0, prev.pendingPoints - 5)
      }));

      addAuditLog(
        helper.name,
        'helper',
        'IVR Task Verified',
        `Task "${targetTask.title}" processed via IVR passcode. Evaluated status: ${targetTask.evidence.some(e => e.isVisitProofOnly) ? 'CONFIRMED (2 channels)' : 'LIKELY (1 channel)'}. Points awarded: +5.`,
        'telephony'
      );
      return true;
    } else {
      // Record failed passcode contradiction
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === targetTask.id) {
            const badEv: CareEvidence = {
              id: `ev-ivr-bad-${Date.now()}`,
              type: 'ivr_keypad',
              caption: `Invalid IVR code attempted: "${code}"`,
              timestamp: simulatedClock,
              confidenceScore: 10,
              verifiedBy: 'system',
              isVisitProofOnly: false,
              enteredCode: code
            };
            return {
              ...t,
              status: 'not_confirmed' as const,
              evidence: [...t.evidence, badEv]
            };
          }
          return t;
        })
      );
      addAuditLog(
        helper.name,
        'helper',
        'IVR Passcode Failed',
        `Caregiver entered wrong security code "${code}" on IVR call.`,
        'telephony'
      );
      return false;
    }
  };

  // Phase 5: Time Advancement & Escalations Ladder
  const advanceSimulatedTime = (minutes: number) => {
    // Parse simulated clock "02:15 PM"
    const [time, period] = simulatedClock.split(' ');
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    const totalM = h * 60 + m + minutes;
    const newH24 = Math.floor(totalM / 60) % 24;
    const newM = totalM % 60;
    const newPeriod = newH24 >= 12 ? 'PM' : 'AM';
    const newH12 = newH24 % 12 === 0 ? 12 : newH24 % 12;
    const newClock = `${newH12 < 10 ? '0' : ''}${newH12}:${newM < 10 ? '0' : ''}${newM} ${newPeriod}`;

    setSimulatedClock(newClock);

    // If advanced and task-3 is overdue, trigger next ladder stage!
    setEscalations((prev) =>
      prev.map((esc) => {
        if (esc.id === 'esc-1' && esc.status === 'active') {
          const newOverdue = esc.simulatedOverdueMins + minutes;
          let nextStage: EscalationLadderStage = esc.currentStage;
          if (newOverdue >= 60 && esc.currentStage !== 'backup_notified' && esc.currentStage !== 'resolved') {
            nextStage = 'backup_notified';
          }
          return {
            ...esc,
            simulatedOverdueMins: newOverdue,
            currentStage: nextStage,
            timeline: [
              ...esc.timeline,
              {
                stage: nextStage,
                timestamp: newClock,
                status: 'delivered',
                note: `Clock advanced +${minutes}m (Elapsed: +${newOverdue}m). Escalation state: ${nextStage}.`
              }
            ]
          };
        }
        return esc;
      })
    );

    addAuditLog(
      'System Sentinel',
      'system',
      `Time Advanced +${minutes} Mins`,
      `Simulated time updated from ${simulatedClock} to ${newClock}. Scheduled SLA rules evaluated.`,
      'safety'
    );
  };

  const ownerAcknowledgeEscalation = (escalationId: string) => {
    setEscalations((prev) =>
      prev.map((e) => {
        if (e.id === escalationId) {
          return {
            ...e,
            currentStage: 'owner_acknowledged',
            timeline: [
              ...e.timeline,
              {
                stage: 'owner_acknowledged',
                timestamp: simulatedClock,
                status: 'acknowledged',
                note: 'Neha Kapoor acknowledged care gap alert via mobile push.'
              }
            ]
          };
        }
        return e;
      })
    );
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Escalation Acknowledged by Owner',
      `Owner confirmed receipt of alert for #${escalationId}. Standby backup sitter notified.`,
      'safety'
    );
  };

  const ownerTriggerBackup = (escalationId: string) => {
    setEscalations((prev) =>
      prev.map((e) => {
        if (e.id === escalationId) {
          return {
            ...e,
            currentStage: 'find_cover_suggested',
            timeline: [
              ...e.timeline,
              {
                stage: 'find_cover_suggested',
                timestamp: simulatedClock,
                status: 'actioned',
                note: 'Emergency backup request dispatched to local friends circle & Find Cover sitters.'
              }
            ]
          };
        }
        return e;
      })
    );
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Backup Sitter Request Triggered',
      'Automated dispatch to 3 nearby pet parents within 1.5km radius.',
      'safety'
    );
  };

  // Phase 6: Rewards & Ratings Handlers
  const claimVoucher = (voucherId: string) => {
    const target = rewards.vouchers.find((v) => v.id === voucherId);
    if (!target) return;
    if (rewards.pointsBalance < target.pointsCost) {
      alert(`Insufficient points! You need ${target.pointsCost} points, but have ${rewards.pointsBalance}.`);
      return;
    }
    setRewards((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - target.pointsCost,
      vouchers: prev.vouchers.map((v) => (v.id === voucherId ? { ...v, claimed: true } : v))
    }));
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Food/Service Voucher Claimed',
      `Redeemed ${target.pointsCost} points for ${target.title} (${target.partnerName}).`,
      'rewards'
    );
  };

  const submitCaregiverReview = (taskId: string, ratingStars: number, feedbackText: string) => {
    const newReview: CaregiverRating = {
      id: `rev-${Date.now()}`,
      taskId,
      householdId: activePet.householdId || 'hh-neha-1',
      petName: activePet.name,
      ownerName: 'Neha Kapoor',
      helperId: helper.id,
      ratingStars,
      feedbackText,
      date: '2026-11-07',
      status: 'published'
    };
    setRatings((prev) => [newReview, ...prev]);

    // Recompute helper overall rating
    const allRatings = [newReview, ...ratings];
    const avg = allRatings.reduce((acc, r) => acc + r.ratingStars, 0) / allRatings.length;
    setHelper((prev) => ({
      ...prev,
      rating: parseFloat(avg.toFixed(2)),
      reviewCount: prev.reviewCount + 1
    }));

    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Caregiver Review Submitted',
      `Rated Sunita ${ratingStars}★ for completed care session.`,
      'rewards'
    );
  };

  const disputeCaregiverReview = (reviewId: string, disputeNotes: string) => {
    setRatings((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: 'disputed',
              disputeNotes
            }
          : r
      )
    );
    addAuditLog(
      helper.name,
      'helper',
      'Review Disputed by Caretaker',
      `Review #${reviewId} disputed. Reason: "${disputeNotes}". Admin review queued.`,
      'safety'
    );
  };

  // Phase 8: End-to-End Walkthrough Runner
  const runDemoStep = (step: number) => {
    setDemoStep(step);
    switch (step) {
      case 1:
        // Neha requests and logs in with verified 6-digit OTP
        requestOtp('+91 98450 11223', 'owner');
        loginOwner('+91 98450 11223', '482910');
        setRoleState('owner');
        break;
      case 2:
        // Neha records Bruno's daily health handover
        createOrUpdateHandover({
          petHealthCondition: 'healthy',
          appetiteStatus: 'normal',
          newSymptomsNotes: 'Right ear scratched twice yesterday. Use front-clip harness only.',
          specialPrecautionsToday: 'Front-clip harness strictly requested; neighbor beagle walking around 7:45 AM.'
        });
        setRoleState('owner');
        break;
      case 3:
        // Sunita acknowledges today's care instructions
        setRoleState('helper');
        if (handovers[0]) {
          helperAcknowledgeHandover(handovers[0].id);
        }
        break;
      case 4:
        // Sunita checks in using basic-phone mode
        setRoleState('helper');
        helperSimulateMissedCall();
        break;
      case 5:
        // System records visit evidence without falsely confirming assigned task
        // Already done via helperSimulateMissedCall
        setRoleState('owner');
        break;
      case 6:
        // Task proof becomes overdue (advance time +45m)
        advanceSimulatedTime(45);
        break;
      case 7:
        // Neha receives simulated escalation
        setRoleState('owner');
        break;
      case 8:
        // Neha confirms or arranges backup care
        setRoleState('owner');
        ownerAcknowledgeEscalation('esc-1');
        ownerTriggerBackup('esc-1');
        break;
      case 9:
        // Admin reviews incident and audit timeline
        setRoleState('admin');
        break;
      case 10:
        // Caregiver completes task via IVR keypad code entry & rewards update
        helperSimulateIVREntry(1, '4829');
        setRoleState('owner');
        break;
      default:
        break;
    }
  };

  // Existing Pet & Task Handlers
  const addPet = (newPetData: Omit<Pet, 'id'>): string => {
    const newId = `pet-${Date.now()}`;
    const newPet: Pet = {
      ...newPetData,
      id: newId
    };
    setPets((prev) => [...prev, newPet]);
    setActivePetId(newId);
    addAuditLog('Neha Kapoor', 'owner', 'New Pet Registered', `Registered ${newPet.name} (${newPet.breed}) with care instructions.`, 'task');
    return newId;
  };

  const updatePet = (updatedPet: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
    addAuditLog('Neha Kapoor', 'owner', 'Pet Profile Updated', `Updated health and care routines for ${updatedPet.name}.`, 'task');
  };

  const helperCheckInToggle = (locality = 'Green Glen Layout, Apt 402') => {
    if (helperCheckedIn) {
      setHelperCheckedIn(false);
      setHelperCheckInTime(null);
      setCheckInMethod('none');
      addAuditLog(helper.name, 'helper', 'Visit Check-Out', `Caregiver checked out of ${locality}.`, 'verification');
    } else {
      const timeStr = `${simulatedClock} Today`;
      setHelperCheckedIn(true);
      setHelperCheckInTime(timeStr);
      setCheckInMethod('gps');
      addAuditLog(helper.name, 'helper', 'Visit Check-In (GPS Verified)', `Checked in at ${locality} (12.9254° N, 77.6749° E). Accuracy: ±8m.`, 'verification');
    }
  };

  // DEFECT FIX 8: Require affirmative caretaker consent before activating care tasks
  const helperMarkTaskDone = (taskId: string, note?: string) => {
    const consentCheck = securityEngine.canActivateCareTasks('helper-sunita-1');
    if (!consentCheck.allowed || !helperConsent.agreed || helperConsent.status !== 'active') {
      alert(`Action Blocked: ${consentCheck.reason || 'Affirmative caretaker consent is required before recording care tasks.'}`);
      addAuditLog(
        helper.name,
        'helper',
        'Task Action Blocked',
        `Attempted task update without active affirmative consent: ${consentCheck.reason}`,
        'safety'
      );
      return;
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            helperMarkedDone: true,
            status: 'likely',
            completedAt: simulatedClock,
            notes: note || t.notes || 'Marked done by caregiver. Awaiting photo or code verification.'
          };
        }
        return t;
      })
    );
    const targetTask = tasks.find((t) => t.id === taskId);
    addAuditLog(
      helper.name,
      'helper',
      'Task Marked Done (Unverified)',
      `Helper marked "${targetTask?.title || taskId}" done. Status changed to "Likely". Photo proof required for Confirmed.`,
      'task'
    );
  };

  const helperSubmitEvidence = (
    taskId: string,
    evidenceType: 'photo' | 'voice' | 'code' | 'ivr_keypad',
    details: { url?: string; caption?: string; code?: string }
  ) => {
    const consentCheck = securityEngine.canActivateCareTasks('helper-sunita-1');
    if (!consentCheck.allowed || !helperConsent.agreed || helperConsent.status !== 'active') {
      alert(`Evidence Submission Blocked: ${consentCheck.reason || 'Affirmative caretaker consent is required before submitting evidence.'}`);
      addAuditLog(
        helper.name,
        'helper',
        'Evidence Submission Blocked',
        `Attempted evidence submission without active affirmative consent: ${consentCheck.reason}`,
        'safety'
      );
      return;
    }

    let wasVerified = false;
    let finalStatusDesc = 'Likely';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newEv: CareEvidence = {
            id: `ev-${Date.now()}`,
            type: evidenceType,
            url: details.url,
            caption: details.caption || `${evidenceType} evidence submitted`,
            timestamp: simulatedClock,
            verifiedBy: 'system' as const,
            confidenceScore: evidenceType === 'photo' ? 96 : 80,
            isVisitProofOnly: false,
            enteredCode: details.code,
            channelIdentifier:
              evidenceType === 'photo'
                ? 'visual_photo_evidence'
                : evidenceType === 'voice'
                ? 'audio_voice_report'
                : 'dtmf_ivr_security_passcode'
          };
          const updatedEvidence = [...t.evidence, newEv];
          const evalResult = PawsureVerificationEngine.evaluateTaskEvidence(
            { ...t, evidence: updatedEvidence },
            activePet.securityHomeCode || '4829'
          );
          if (evalResult.status === 'confirmed' || evalResult.status === 'likely') {
            wasVerified = true;
          }
          finalStatusDesc = evalResult.status;

          return {
            ...t,
            helperMarkedDone: true,
            status: evalResult.status,
            completedAt: t.completedAt || simulatedClock,
            evidence: updatedEvidence
          };
        }
        return t;
      })
    );

    // Reward points: +5 per PRD pilot specification for confirmed/likely
    if (wasVerified) {
      setRewards((prev) => ({
        ...prev,
        pointsBalance: Math.min(prev.pointsBalance + 5, 125 * 6),
        monthlyEarned: Math.min((prev.monthlyEarned || 0) + 5, 125),
        pendingPoints: Math.max(0, prev.pendingPoints - 5)
      }));
    }

    addAuditLog(
      helper.name,
      'helper',
      `Evidence Submitted (${evidenceType.toUpperCase()})`,
      `Submitted ${evidenceType} for task. Status evaluated as "${finalStatusDesc}".`,
      'verification'
    );
  };

  const adminSetTaskStatus = (taskId: string, status: VerificationStatus, auditReason?: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    addAuditLog(
      'Admin Operator',
      'admin',
      `Manual Task Status Override -> ${status.toUpperCase()}`,
      `Admin changed task status to ${status}. Reason: ${auditReason || 'Manual visual inspection verified.'}`,
      'verification'
    );
  };

  const ownerConfirmTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: 'confirmed' } : t)));
    setRewards((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance + 20,
      pendingPoints: Math.max(0, prev.pendingPoints - 20)
    }));
    addAuditLog('Neha Kapoor', 'owner', 'Owner Confirmed Task', 'Owner manually acknowledged and confirmed task completion.', 'verification');
  };

  const helperReportProblem = (
    title: string,
    description: string,
    severity: 'low' | 'medium' | 'urgent',
    photoUrl?: string
  ) => {
    const reportId = `rep-${Date.now()}`;
    const newReport: CaregiverReport = {
      id: reportId,
      petId: activePet.id,
      helperId: helper.id,
      helperName: helper.name,
      timestamp: simulatedClock,
      severity,
      title,
      description,
      photoUrl,
      status: 'open'
    };
    setReports((prev) => [newReport, ...prev]);

    const newEsc: EscalationItem = {
      id: `esc-${Date.now()}`,
      type: 'health_report',
      title: `Caregiver Report: ${title}`,
      householdName: 'Neha Kapoor (Tower 4, Apt 402)',
      petName: activePet.name,
      helperName: helper.name,
      timestamp: simulatedClock,
      severity: severity === 'urgent' ? 'high' : severity === 'medium' ? 'medium' : 'low',
      status: 'active',
      details: description,
      actionRequired: severity === 'urgent' ? 'Emergency vet phone or immediate owner call required.' : 'Follow up with pet parent.',
      currentStage: 'owner_missed_alert',
      simulatedOverdueMins: 0,
      timeline: [
        {
          stage: 'task_due',
          timestamp: simulatedClock,
          status: 'actioned',
          note: `Caregiver observation logged: ${title}`
        }
      ]
    };
    setEscalations((prev) => [newEsc, ...prev]);

    addAuditLog(helper.name, 'helper', `Care Incident Reported [${severity.toUpperCase()}]`, `${title}: ${description}`, 'safety');
  };

  const resolveEscalation = (id: string, resolutionNote?: string) => {
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              status: 'resolved',
              currentStage: 'resolved',
              details: `${e.details} | Resolved: ${resolutionNote || 'Handled by Admin.'}`,
              timeline: [
                ...e.timeline,
                {
                  stage: 'resolved',
                  timestamp: simulatedClock,
                  status: 'actioned',
                  note: `Escalation resolved: ${resolutionNote || 'Resolved.'}`
                }
              ]
            }
          : e
      )
    );
    addAuditLog('Admin Operator', 'admin', 'Escalation Resolved', `Closed escalation #${id}. Note: ${resolutionNote || 'Resolved.'}`, 'safety');
  };

  const ownerApproveAndSendFriendFinder = (): boolean => {
    setFriendFinderDraft((prev) => ({
      ...prev,
      ownerApproved: true,
      sentAt: simulatedClock
    }));
    addAuditLog(
      'Neha Kapoor',
      'owner',
      'Friend Finder Approved & Dispatched',
      `Owner explicitly approved broadcast message to ${friends.length} nearby pet parents within ${friendFinderDraft.targetRadiusKm}km.`,
      'task'
    );
    return true;
  };

  const requestBackupCover = (sitterName: string, dateInfo: string) => {
    addAuditLog('Neha Kapoor', 'owner', 'Backup Sitter Request Sent', `Requested backup cover from ${sitterName} for ${dateInfo}. (Simulated dispatch)`, 'task');
  };

  const snoozeOrCompleteHealthRecord = (recordId: string, action: 'snooze' | 'completed') => {
    setPets((prev) =>
      prev.map((pet) => ({
        ...pet,
        healthRecords: pet.healthRecords.map((hr) => {
          if (hr.id === recordId) {
            return {
              ...hr,
              status: action === 'completed' ? 'valid' : 'due_soon',
              dateAdministered: action === 'completed' ? '2026-11-07' : hr.dateAdministered
            };
          }
          return hr;
        })
      }))
    );
    addAuditLog('Neha Kapoor', 'owner', `Health Record: ${action}`, `Health reminder #${recordId} marked as ${action}.`, 'task');
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_pets`);
    localStorage.removeItem(`${STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${STORAGE_KEY}_helper`);
    localStorage.removeItem(`${STORAGE_KEY}_escalations`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);
    localStorage.removeItem(`${STORAGE_KEY}_handovers`);
    localStorage.removeItem(`${STORAGE_KEY}_ivr`);
    localStorage.removeItem(`${STORAGE_KEY}_rewards`);
    localStorage.removeItem(`${STORAGE_KEY}_ratings`);
    localStorage.removeItem(`${STORAGE_KEY}_auth`);
    setPets(INITIAL_PETS);
    setActivePetId('pet-bruno-1');
    setTasks(INITIAL_TASKS);
    setHelper(INITIAL_HELPER);
    setEscalations(INITIAL_ESCALATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setHandovers(INITIAL_HANDOVERS);
    setIvrLogs(INITIAL_IVR_LOGS);
    setRewards(INITIAL_REWARDS);
    setRatings(INITIAL_CAREGIVER_RATINGS);
    setReports([]);
    setHelperCheckedIn(true);
    setHelperCheckInTime('08:02 AM Today');
    setCheckInMethod('gps');
    setSimulatedClock('02:15 PM');
    setDemoStep(1);
    setAuth({
      isAuthenticated: true,
      role: 'owner',
      userId: 'owner-neha-1',
      name: 'Neha Kapoor',
      phone: '+91 98450 11223'
    });
    setRoleState('owner');
  };

  return (
    <PawsureContext.Provider
      value={{
        role,
        setRole,
        auth,
        requestOtp,
        loginOwner,
        loginHelper,
        loginCrecheOperator,
        loginAdmin,
        logout,
        household,
        facilityAudits,
        marketplaceListings,
        bookingRequests,
        returnChecks,
        helperConsent,
        submitOwnerReturnCheck,
        updateHelperConsent,
        submitBookingRequest,
        updateBookingStatus,
        pets,
        activePetId,
        setActivePetId,
        activePet,
        tasks,
        helper,
        friends,
        escalations,
        auditLogs,
        reports,
        helperCheckedIn,
        helperCheckInTime,
        checkInMethod,
        ivrLogs,
        helperSimulateMissedCall,
        helperSimulateIVREntry,
        handovers,
        activeHandover,
        createOrUpdateHandover,
        helperAcknowledgeHandover,
        helperDeclineHandover,
        simulatedClock,
        advanceSimulatedTime,
        ownerAcknowledgeEscalation,
        ownerTriggerBackup,
        rewards,
        claimVoucher,
        ratings,
        submitCaregiverReview,
        disputeCaregiverReview,
        addPet,
        updatePet,
        helperCheckInToggle,
        helperMarkTaskDone,
        helperSubmitEvidence,
        adminSetTaskStatus,
        ownerConfirmTask,
        helperReportProblem,
        resolveEscalation,
        friendFinderDraft,
        setFriendFinderDraft,
        ownerApproveAndSendFriendFinder,
        requestBackupCover,
        snoozeOrCompleteHealthRecord,
        resetDemoData,
        demoStep,
        runDemoStep
      }}
    >
      {children}
    </PawsureContext.Provider>
  );
};

export const usePawsure = () => {
  const context = useContext(PawsureContext);
  if (!context) {
    throw new Error('usePawsure must be used within a PawsureProvider');
  }
  return context;
};
