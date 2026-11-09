import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 flex items-center gap-2.5 rounded-2xl bg-[#38223A] text-white p-3 text-xs font-medium shadow-xl border border-white/10 animate-bounce">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EF4444] text-white shrink-0">
        <WifiOff className="w-4 h-4" />
      </span>
      <div>
        <p className="font-semibold">Offline Mode</p>
        <p className="text-gray-300 text-[11px]">Care routines & emergency card are cached offline.</p>
      </div>
    </div>
  );
};
