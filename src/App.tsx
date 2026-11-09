/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PawsureProvider, usePawsure } from './context/PawsureContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { Navbar } from './components/common/Navbar';
import { DemoScenarioRunner } from './components/common/DemoScenarioRunner';
import { LoginView } from './components/auth/LoginView';

// Owner Views
import { OwnerTodayDashboard } from './components/owner/OwnerTodayDashboard';
import { PetProfileView } from './components/owner/PetProfileView';
import { DailyCareHandoverView } from './components/owner/DailyCareHandoverView';
import { CareRoutineManager } from './components/owner/CareRoutineManager';
import { RewardsAndRatingsView } from './components/owner/RewardsAndRatingsView';
import { FindCoverView } from './components/owner/FindCoverView';
import { FriendsCircleView } from './components/owner/FriendsCircleView';
import { EmergencyCardView } from './components/owner/EmergencyCardView';
import { HealthRemindersView } from './components/owner/HealthRemindersView';
import { CareHistoryView } from './components/owner/CareHistoryView';
import { PetRegistrationWizard } from './components/owner/PetRegistrationWizard';

// Helper View
import { HelperWhatsAppView } from './components/helper/HelperWhatsAppView';

// Admin View
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { role, activePet, auth } = usePawsure();
  const [currentTab, setCurrentTab] = useState<string>('today');
  const [isRegisteringPet, setIsRegisteringPet] = useState<boolean>(false);

  // If user is logged out, show the 3-role login experience
  if (!auth.isAuthenticated) {
    return <LoginView />;
  }

  const handleRegistrationSuccess = (newPetId: string) => {
    setIsRegisteringPet(false);
    setCurrentTab('pets');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#EE8267', '#A78BFA', '#F3D7EA', '#10B981']
      });
    } catch {
      // Ignore if restricted
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] text-[#38223A] flex flex-col font-sans">
      {/* Role Switcher Bar (Dev Mode) */}
      <RoleSwitcher />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Phase 8: Interactive 10-Step Demo Scenario Runner */}
      <DemoScenarioRunner onNavigateOwnerTab={setCurrentTab} />

      {/* ROLE 1: PET OWNER EXPERIENCE (Mobile-First) */}
      {role === 'owner' && (
        <div className="flex-1 flex flex-col">
          <Navbar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setIsRegisteringPet(false);
              setCurrentTab(tab);
            }}
            onOpenRegister={() => setIsRegisteringPet(true)}
          />

          <main className="flex-1 px-4 sm:px-6 pt-5">
            {isRegisteringPet ? (
              <PetRegistrationWizard
                onSuccess={handleRegistrationSuccess}
                onCancel={() => setIsRegisteringPet(false)}
              />
            ) : (
              <>
                {currentTab === 'today' && (
                  <OwnerTodayDashboard
                    onNavigateTab={setCurrentTab}
                    onOpenRegisterWizard={() => setIsRegisteringPet(true)}
                  />
                )}
                {currentTab === 'handover' && <DailyCareHandoverView />}
                {currentTab === 'pets' && (
                  <PetProfileView onOpenRegister={() => setIsRegisteringPet(true)} />
                )}
                {currentTab === 'routine' && <CareRoutineManager />}
                {currentTab === 'rewards' && <RewardsAndRatingsView />}
                {currentTab === 'find-cover' && <FindCoverView />}
                {currentTab === 'friends' && <FriendsCircleView />}
                {currentTab === 'emergency' && <EmergencyCardView />}
                {currentTab === 'health' && <HealthRemindersView />}
                {currentTab === 'history' && <CareHistoryView />}
              </>
            )}
          </main>
        </div>
      )}

      {/* ROLE 2: HELPER / CARETAKER EXPERIENCE (WhatsApp & Basic Phone Mode) */}
      {role === 'helper' && (
        <div className="flex-1 flex flex-col px-3 sm:px-6 pt-4">
          <HelperWhatsAppView />
        </div>
      )}

      {/* ROLE 3: ADMIN DESKTOP DASHBOARD */}
      {role === 'admin' && (
        <div className="flex-1 flex flex-col">
          <AdminDashboard />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PawsureProvider>
      <AppContent />
    </PawsureProvider>
  );
}
