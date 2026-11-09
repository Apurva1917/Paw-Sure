import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Calendar,
  PawPrint,
  Clock,
  Search,
  Users,
  ShieldAlert,
  Activity,
  History,
  Heart,
  FileText,
  Gift,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenRegister }) => {
  const { role, activePet, logout, auth } = usePawsure();

  const navLinks = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'handover', label: 'Daily Handover', icon: FileText },
    { id: 'pets', label: 'Pet Profile', icon: PawPrint },
    { id: 'routine', label: 'Routine', icon: Clock },
    { id: 'rewards', label: 'Rewards & Pilot', icon: Gift },
    { id: 'find-cover', label: 'Find Cover', icon: Search },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'emergency', label: 'Emergency', icon: ShieldAlert },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <>
      {/* Top Bar (Adheres to Top Bar Contract: Brand — Nav Links — Action) */}
      <header className="sticky top-0 z-40 bg-[#FFF9F3]/95 backdrop-blur-md border-b border-[#EE8267]/20 px-4 sm:px-6 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand title, one line */}
          <button
            onClick={() => onSelectTab('today')}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#EE8267] to-[#A78BFA] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold tracking-tight text-[#38223A] block leading-none">
                Pawsure
              </span>
              <span className="text-[10px] text-[#EE8267] font-semibold tracking-wider uppercase block mt-0.5">
                Be sure, whoever's caring
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Nav Links */}
          {role === 'owner' && (
            <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[#38223A]/80">
              {navLinks.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className={`whitespace-nowrap transition-colors py-1 ${
                      isActive
                        ? 'text-[#EE8267] border-b-2 border-[#EE8267]'
                        : 'hover:text-[#38223A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Zone 3: 1 Primary Action (PWA Install or Emergency / Register) */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton compact />
            {role === 'owner' && (
              <>
                <button
                  onClick={() => onSelectTab('emergency')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">Emergency Pass</span>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 from Mobile touch app design) */}
      {role === 'owner' && (
        <nav
          aria-label="Mobile Bottom Navigation"
          className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-2 pb-safe"
        >
          <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
            {[
              { id: 'today', label: 'Today', icon: Calendar },
              { id: 'handover', label: 'Handover', icon: FileText },
              { id: 'pets', label: 'Profile', icon: PawPrint },
              { id: 'rewards', label: 'Rewards', icon: Gift },
              { id: 'emergency', label: 'Emergency', icon: ShieldAlert }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                    isActive ? 'text-[#EE8267]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {tab.label}
                  </span>
                  {isActive && <span className="w-1 h-1 rounded-full bg-[#EE8267] mt-0.5" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};
