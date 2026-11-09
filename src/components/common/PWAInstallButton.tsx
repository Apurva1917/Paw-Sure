import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-full font-medium transition active:scale-95 shadow-sm bg-[#EE8267] text-white hover:bg-[#E26D50] ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-2 text-sm'
        }`}
        title="Install Pawsure app on your device"
      >
        <Download className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-full border border-[#EE8267]/40 bg-white/80 text-[#38223A] font-medium transition hover:bg-[#FFF0E6] ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <Smartphone className={compact ? 'w-3 h-3 text-[#EE8267]' : 'w-3.5 h-3.5 text-[#EE8267]'} />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#FFF0E6]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-heading font-semibold text-base text-[#38223A]">Install Pawsure on iOS</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                1. Tap the <strong className="text-[#38223A]">Share icon</strong> (box with arrow up) in your Safari toolbar.<br />
                2. Scroll down and select <strong className="text-[#38223A]">Add to Home Screen</strong>.<br />
                3. Open Pawsure right from your home screen like a native pet care app.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-[#EE8267] py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#E26D50]"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
