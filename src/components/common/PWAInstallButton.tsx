import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle, Smartphone } from 'lucide-react';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'card' | 'pill';
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', label }) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed into standalone mode, show verified active badge or null
  if (isInstalled) {
    if (variant === 'hero' || variant === 'card') {
      return (
 <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium">
 <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>កម្មវិធីបានដំឡើងរួចរាល់លើអេក្រង់ដើម</span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (!ok) {
        // Fallback to modal instructions if user didn't accept immediately
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'hero' && (
        <button
          id="hero-pwa-install-btn"
          type="button"
          onClick={handleClick}
 className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-medium border border-gray-300 transition active:scale-95 cursor-pointer"
        >
 <Smartphone className="w-3.5 h-3.5 text-gray-500" />
          <span>{label || 'ដំឡើង App លើទូរស័ព្ទ'}</span>
        </button>
      )}

      {variant === 'card' && (
        <button
          id="card-pwa-install-btn"
          type="button"
          onClick={handleClick}
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 text-xs font-medium transition active:scale-98 cursor-pointer"
        >
 <Download className="w-3.5 h-3.5 text-gray-200" />
          <span>{label || 'ដំឡើងកម្មវិធីឥឡូវនេះ'}</span>
        </button>
      )}

      {variant === 'pill' && (
        <button
          id="pill-pwa-install-btn"
          type="button"
          onClick={handleClick}
 className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 text-xs font-medium border border-gray-300 transition cursor-pointer"
        >
 <Download className="w-3.5 h-3.5 text-gray-500" />
          <span>{label || 'ដំឡើង App'}</span>
        </button>
      )}

      {variant === 'header' && (
        <button
          id="header-pwa-install-btn"
          type="button"
          onClick={handleClick}
 className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 text-xs font-medium border border-gray-300 transition cursor-pointer min-h-[34px] whitespace-nowrap shrink-0 active:scale-95 font-battambang"
          title="ដំឡើងកម្មវិធីលើទូរស័ព្ទ (Install PWA)"
        >
 <Download className="w-3.5 h-3.5 text-gray-500 shrink-0" />
 <span className="hidden sm:inline whitespace-nowrap">{label || 'ដំឡើង App'}</span>
        </button>
      )}

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        platform={platform}
        isInstallable={isInstallable}
        onDirectInstall={install}
      />
    </>
  );
};
