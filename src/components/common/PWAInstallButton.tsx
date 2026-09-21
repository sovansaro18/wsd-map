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
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-800/80 hover:bg-amber-800 text-amber-100 hover:text-white px-5 py-3 text-sm font-semibold shadow-md transition-all active:scale-95 border border-amber-600/50 cursor-pointer min-h-[44px]"
        >
          <Smartphone className="w-4 h-4 text-amber-300" />
          <span>{label || 'ដំឡើង App លើទូរស័ព្ទ'}</span>
        </button>
      )}

      {variant === 'card' && (
        <button
          id="card-pwa-install-btn"
          type="button"
          onClick={handleClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition active:scale-98 cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-200" />
          <span>{label || 'ដំឡើងកម្មវិធីឥឡូវនេះ'}</span>
        </button>
      )}

      {variant === 'pill' && (
        <button
          id="pill-pwa-install-btn"
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-900/90 hover:bg-amber-800 text-amber-100 px-3 py-1 text-xs font-medium border border-amber-700/60 shadow-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>{label || 'ដំឡើង App'}</span>
        </button>
      )}

      {variant === 'header' && (
        <button
          id="header-pwa-install-btn"
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700/80 hover:bg-amber-700 text-amber-50 px-2.5 sm:px-3 py-1.5 text-xs font-semibold shadow-xs transition border border-amber-500/60 cursor-pointer min-h-[34px]"
          title="ដំឡើងកម្មវិធីលើទូរស័ព្ទ (Install PWA)"
        >
          <Download className="w-3.5 h-3.5 text-amber-200" />
          <span className="whitespace-nowrap">{label || 'ដំឡើង App'}</span>
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
