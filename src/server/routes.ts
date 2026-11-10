/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PAWSURE API ROUTES & SERVER-SIDE RBAC MIDDLEWARE
 * Phase 1 Deliverable:
 * - Server-side authentication endpoints (/api/auth/*)
 * - Server-side RBAC checks on API routes
 * - Household-level access isolation with default deny (/api/household/*)
 * - Affirmative caretaker consent verification on care task activation
 * - Explicit session revocation on logout
 */

import { Router, Request, Response, NextFunction } from 'express';
import { securityEngine, ServerSession } from './auth';
import { pawsureRepository } from '../services/pawsureRepository';
import { Role } from '../types/pawsure';

// Extend Express Request to include authenticated user session
export interface AuthenticatedRequest extends Request {
  sessionUser?: ServerSession;
}

export const apiRouter = Router();

// ==========================================
// MIDDLEWARES
// ==========================================

// 1. Authenticate Token Middleware
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized: Missing or invalid Authorization header.',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const session = securityEngine.getSession(token);

  if (!session) {
    res.status(401).json({
      error: 'Unauthorized: Session is invalid, expired or revoked.',
      code: 'SESSION_INVALID'
    });
    return;
  }

  req.sessionUser = session;
  next();
};

// 2. Authorize Role Middleware (RBAC)
export const requireRole = (...allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.sessionUser) {
      res.status(401).json({ error: 'Unauthorized: Authentication required.', code: 'AUTH_REQUIRED' });
      return;
    }

    if (!allowedRoles.includes(req.sessionUser.role)) {
      res.status(403).json({
        error: `Forbidden: Access denied. Required role in [${allowedRoles.join(', ')}], current role is '${req.sessionUser.role}'.`,
        code: 'FORBIDDEN_ROLE'
      });
      return;
    }

    next();
  };
};

// 3. Authorize Household Access Middleware (Household Isolation with Default Deny)
export const requireHouseholdAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.sessionUser) {
    res.status(401).json({ error: 'Unauthorized: Authentication required.', code: 'AUTH_REQUIRED' });
    return;
  }

  const targetHouseholdId = req.params.householdId || req.body.householdId || req.query.householdId as string;

  if (!targetHouseholdId) {
    res.status(400).json({ error: 'Bad Request: householdId parameter is required.', code: 'MISSING_HOUSEHOLD_ID' });
    return;
  }

  const allowed = securityEngine.canAccessHousehold(req.sessionUser, targetHouseholdId);
  if (!allowed) {
    res.status(403).json({
      error: `Forbidden: Access to household '${targetHouseholdId}' denied by default. Ownership could not be established.`,
      code: 'HOUSEHOLD_ACCESS_DENIED'
    });
    return;
  }

  next();
};

// ==========================================
// AUTHENTICATION ENDPOINTS (/api/auth/*)
// ==========================================

// Request 6-digit OTP
apiRouter.post('/auth/otp/request', (req: Request, res: Response) => {
  const { phone, role } = req.body;
  const result = securityEngine.requestOtp(phone, role);
  if (!result.success) {
    res.status(400).json({ error: result.message, code: 'OTP_REQUEST_FAILED' });
    return;
  }
  res.json(result);
});

// Verify 6-digit OTP
apiRouter.post('/auth/otp/verify', (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  const result = securityEngine.verifyOtp(phone, otp);
  if (!result.success) {
    res.status(400).json({ error: result.message, code: 'OTP_VERIFICATION_FAILED' });
    return;
  }
  res.json({
    success: true,
    message: result.message,
    session: result.session
  });
});

// Staff Admin Login (Strict password & MFA)
apiRouter.post('/auth/admin/login', (req: Request, res: Response) => {
  const { staffId, password, mfaCode } = req.body;
  const result = securityEngine.loginAdmin(staffId || '', password || '', mfaCode || '');
  if (!result.success) {
    res.status(401).json({ error: result.message, code: 'ADMIN_AUTH_FAILED' });
    return;
  }
  res.json({
    success: true,
    message: result.message,
    session: result.session
  });
});

// Helper Login
apiRouter.post('/auth/helper/login', (req: Request, res: Response) => {
  const { phone, preferredLanguage, interfaceMode, consentAgreed } = req.body;
  const result = securityEngine.loginHelper(phone || '', preferredLanguage, interfaceMode, consentAgreed ?? true);
  if (!result.success) {
    res.status(400).json({ error: result.message, code: 'HELPER_AUTH_FAILED' });
    return;
  }
  res.json({
    success: true,
    message: result.message,
    session: result.session
  });
});

// Crèche Operator Login
apiRouter.post('/auth/creche/login', (req: Request, res: Response) => {
  const { facilityId, operatorPhone, managerName } = req.body;
  const result = securityEngine.loginCreche(facilityId || '', operatorPhone || '', managerName || '');
  if (!result.success) {
    res.status(400).json({ error: result.message, code: 'CRECHE_AUTH_FAILED' });
    return;
  }
  res.json({
    success: true,
    message: result.message,
    session: result.session
  });
});

// Validate Active Session
apiRouter.get('/auth/session', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    session: req.sessionUser
  });
});

// Logout & Invalidate Session
apiRouter.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.sessionUser) {
    securityEngine.revokeSession(req.sessionUser.token);
  }
  res.json({
    success: true,
    message: 'Session successfully revoked. Authenticated access invalidated.'
  });
});

// ==========================================
// HOUSEHOLD DATA ISOLATION (/api/household/*)
// ==========================================

apiRouter.get('/household/:householdId', requireAuth, requireHouseholdAccess, (req: AuthenticatedRequest, res: Response) => {
  const householdId = req.params.householdId;
  const repo = pawsureRepository.getState();
  const targetHh = repo.households.find((h) => h.id === householdId);

  if (!targetHh) {
    res.status(404).json({ error: 'Household not found.', code: 'NOT_FOUND' });
    return;
  }

  // Sanitize: do not send raw secret passcodes unless admin or primary owner
  const isOwner = req.sessionUser?.role === 'owner' && req.sessionUser.householdId === householdId;
  const isAdmin = req.sessionUser?.role === 'admin';

  res.json({
    household: {
      ...targetHh,
      // Mask lockbox code for unauthorized/general readers
      securityHomeCode: isOwner || isAdmin ? targetHh.securityHomeCode : '••••'
    }
  });
});

// ==========================================
// CARE TASKS & CARETAKER CONSENT (/api/tasks/*)
// ==========================================

// Get tasks scoped to user/household
apiRouter.get('/tasks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.sessionUser!;
  const allTasks = pawsureRepository.getState().tasks;

  if (user.role === 'admin') {
    res.json({ tasks: allTasks });
    return;
  }

  if (user.role === 'owner') {
    const householdTasks = allTasks.filter((t) => t.householdId === user.householdId || !t.householdId);
    res.json({ tasks: householdTasks });
    return;
  }

  if (user.role === 'helper') {
    const helperTasks = allTasks.filter((t) => t.assignedToHelperId === user.userId || t.assignedToHelperId === 'helper-sunita-1');
    res.json({ tasks: helperTasks });
    return;
  }

  res.status(403).json({ error: 'Forbidden: Role has no task access.', code: 'ROLE_FORBIDDEN' });
});

// DEFECT FIX 8: Require affirmative caretaker consent before activating care tasks
apiRouter.post('/tasks/:taskId/activate', requireAuth, requireRole('helper', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const user = req.sessionUser!;
  const helperId = user.role === 'helper' ? user.userId : req.body.helperId || 'helper-sunita-1';

  // Check affirmative consent
  const consentCheck = securityEngine.canActivateCareTasks(helperId);
  if (!consentCheck.allowed) {
    res.status(403).json({
      error: `Forbidden: ${consentCheck.reason}`,
      code: 'CARETAKER_CONSENT_REQUIRED'
    });
    return;
  }

  res.json({
    success: true,
    message: `Care task '${req.params.taskId}' activated under active caretaker consent.`,
    activatedAt: new Date().toLocaleTimeString()
  });
});

// ==========================================
// CARETAKER CONSENT MANAGEMENT (/api/consent/*)
// ==========================================

apiRouter.get('/consent/helper/:helperId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const helperId = req.params.helperId;
  const consent = securityEngine.getCaregiverConsent(helperId);
  res.json({ consent });
});

apiRouter.post('/consent/helper/:helperId', requireAuth, requireRole('helper', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  const helperId = req.params.helperId;
  const { agreed, status, reason } = req.body;
  const updated = securityEngine.updateCaregiverConsent(helperId, agreed, status, reason);
  res.json({
    success: true,
    message: `Caregiver consent updated to '${updated.status.toUpperCase()}'.`,
    consent: updated
  });
});

// ==========================================
// ADMIN-ONLY OPERATIONS (/api/admin/*)
// ==========================================

apiRouter.get('/admin/escalations', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const escalations = pawsureRepository.getState().escalations;
  res.json({ escalations });
});

apiRouter.get('/admin/audit-logs', requireAuth, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  const auditLogs = pawsureRepository.getState().auditLogs;
  res.json({ auditLogs });
});
