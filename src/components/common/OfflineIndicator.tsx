import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-indicator-banner"
 className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 flex items-center justify-between gap-3 rounded-xl bg-gray-700/95 px-4 py-2.5 text-xs sm:text-sm font-medium text-white backdrop-blur-xs border border-gray-600 font-battambang"
    >
 <div className="flex items-center gap-2">
 <WifiOff className="w-4 h-4 text-gray-200" />
        <span>ដំណើរការក្រៅបណ្តាញ (Offline) — កំពុងប្រើប្រាស់ទិន្នន័យដែលបានរក្សាទុក</span>
      </div>
 <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
    </div>
  );
};
