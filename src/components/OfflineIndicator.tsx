import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-banner"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-2xl backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-white animate-pulse" />
      <span>Offline Mode — Working with locally cached records.</span>
    </div>
  );
};
