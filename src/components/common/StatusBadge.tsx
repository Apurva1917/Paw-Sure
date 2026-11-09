import React from 'react';
import { VerificationStatus } from '../../types/pawsure';
import { CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, size = 'md' }) => {
  const configs: Record<
    VerificationStatus,
    {
      label: string;
      colorClass: string;
      bgClass: string;
      borderClass: string;
      icon: React.ComponentType<{ className?: string }>;
      description: string;
    }
  > = {
    confirmed: {
      label: 'Confirmed',
      colorClass: 'text-[#10B981]',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-200',
      icon: CheckCircle2,
      description: 'GPS, photo or security code verified'
    },
    likely: {
      label: 'Likely (Unverified)',
      colorClass: 'text-[#D97706]',
      bgClass: 'bg-amber-50',
      borderClass: 'border-amber-200',
      icon: AlertTriangle,
      description: 'Helper marked done; photo proof pending'
    },
    not_confirmed: {
      label: 'Not confirmed',
      colorClass: 'text-[#EF4444]',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-200',
      icon: AlertCircle,
      description: 'Overdue or unacknowledged'
    },
    upcoming: {
      label: 'Upcoming',
      colorClass: 'text-[#8B5CF6]',
      bgClass: 'bg-purple-50',
      borderClass: 'border-purple-200',
      icon: Clock,
      description: 'Scheduled for later today'
    },
    matched: {
      label: 'Matched (Return Check)',
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      icon: CheckCircle2,
      description: 'Physical inspection upon owner return verified day care. Status: Matched (covered day, no points).'
    }
  };

  const conf = configs[status] || configs.upcoming;
  const Icon = conf.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${conf.bgClass} ${conf.borderClass} ${conf.colorClass} ${sizeClasses}`}
      title={conf.description}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{conf.label}</span>
    </span>
  );
};
