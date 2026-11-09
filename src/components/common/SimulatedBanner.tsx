import React from 'react';
import { Info } from 'lucide-react';

interface SimulatedBannerProps {
  label: string;
  className?: string;
}

export const SimulatedBanner: React.FC<SimulatedBannerProps> = ({ label, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0E6] border border-[#EE8267]/30 text-[#38223A] text-xs ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-[#EE8267] shrink-0" />
      <span className="font-medium text-[11px] text-[#38223A]/90">
        <strong className="text-[#EE8267]">Simulated Demo:</strong> {label}
      </span>
    </div>
  );
};
