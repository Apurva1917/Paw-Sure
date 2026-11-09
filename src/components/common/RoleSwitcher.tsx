import React from 'react';
import { usePawsure } from '../../context/PawsureContext';
import { Role } from '../../types/pawsure';
import { User, HeartHandshake, Building2, ShieldCheck, RotateCcw, LogOut } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, resetDemoData, tasks, escalations, auth, logout } = usePawsure();

  const unconfirmedCount = tasks.filter((t) => t.status === 'not_confirmed').length;
  const activeEscalations = escalations.filter((e) => e.status === 'active').length;

  const roles: { id: Role; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'owner',
      label: 'Pet Owner',
      sub: 'Neha & Bruno',
      icon: User
    },
    {
      id: 'helper',
      label: 'Helper (Caretaker)',
      sub: 'Sunita (WhatsApp Demo)',
      icon: HeartHandshake
    },
    {
      id: 'creche_operator',
      label: 'Crèche Operator',
      sub: 'Happy Paws Daycare',
      icon: Building2
    },
    {
      id: 'admin',
      label: 'Admin Console',
      sub: 'Audits & Escalations',
      icon: ShieldCheck
    }
  ];

  return (
    <aside aria-label="Demo role selector" className="bg-[#38223A] text-white border-b border-white/10 px-3 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            DEMO ONLY
          </span>
          <span className="font-heading font-semibold text-white/90 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EE8267]"></span>
            Test Role:
          </span>
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#EE8267] text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                  {r.id === 'owner' && unconfirmedCount > 0 && (
                    <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {unconfirmedCount}
                    </span>
                  )}
                  {r.id === 'admin' && activeEscalations > 0 && (
                    <span className="bg-[#F59E0B] text-[#38223A] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {activeEscalations}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {auth.isAuthenticated && (
            <span className="hidden md:inline text-white/60 text-[11px]">
              Logged in as <strong className="text-white font-medium">{auth.name}</strong>
            </span>
          )}

          {auth.isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-[#EE8267] hover:text-white transition px-2 py-1 rounded hover:bg-white/10 text-[11px] font-medium border border-[#EE8267]/30"
              title="Test Login View (Phase 1 Auth Flow)"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out (Test Login)</span>
            </button>
          ) : (
            <span className="text-[#EE8267] font-semibold text-[11px] px-2 py-0.5 bg-[#EE8267]/20 rounded">
              Login View Active
            </span>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset demo state to initial tasks, Bruno & Sunita records?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1 text-white/70 hover:text-white transition px-2 py-1 rounded hover:bg-white/10 text-[11px]"
            title="Reset simulation data to default initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
