import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Map, ShieldCheck, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { isValidCoordinates, getGoogleMapsNavigationUrl, getGoogleMapsViewUrl } from '../../utils/navigation';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface HeroSectionProps {
  templeNameKm: string;
  templeNameEn: string;
  descriptionKm: string;
  latitude: number | null;
  longitude: number | null;
  isVerified: boolean;
  coverImage?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  templeNameKm,
  templeNameEn,
  descriptionKm,
  latitude,
  longitude,
  isVerified,
  coverImage,
}) => {
  const [copied, setCopied] = useState(false);
  const [navError, setNavError] = useState(false);
  const hasCoords = isValidCoordinates(latitude, longitude);

  const handleNavigate = () => {
    if (!hasCoords || latitude === null || longitude === null) {
      setNavError(true);
      return;
    }
    const navUrl = getGoogleMapsNavigationUrl(latitude, longitude);
    try {
      window.open(navUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback
      window.location.href = navUrl;
    }
  };

  const handleCopyCoords = () => {
    if (hasCoords && latitude !== null && longitude !== null) {
      navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
 <section id="hero-section" className="relative overflow-hidden rounded-2xl bg-white text-gray-800 border border-gray-200 p-6 sm:p-8">
      {/* Top Status Strip */}
 <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
 <div className="flex items-center gap-1.5">
          {isVerified ? (
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
 <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
              <span>ទីតាំងផ្លូវការរបស់វត្ត</span>
            </span>
          ) : (
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300">
 <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>ទីតាំងមិនទាន់ផ្ទៀងផ្ទាត់</span>
            </span>
          )}
        </div>

        <PWAInstallButton variant="pill" />
      </div>

      {/* Main Identity & Core Actions */}
 <div className="max-w-2xl mx-auto text-center">
        {/* Temple Visual Emblem */}
 <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-50 p-2.5 border border-gray-200 mx-auto mb-4 flex items-center justify-center">
          <img
            src="/Logo.png"
            alt="Wat Snay Douch Logo"
 className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.svg';
            }}
          />
        </div>

        {/* Temple Name */}
 <h1 className="font-koulen text-2xl sm:text-3xl md:text-4xl text-gray-800 tracking-wide">
          {templeNameKm}
        </h1>
 <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wider uppercase mt-1">
          {templeNameEn}
        </p>

        {/* Description */}
 <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed font-battambang mt-3 mb-6">
          ស្វែងរកទីតាំងវត្តពិតប្រាកដ និងទិសដៅធ្វើដំណើរតាមប្រព័ន្ធ GPS ផ្លូវការ ដើម្បីជៀសវាងការវង្វេងផ្លូវ
        </p>

        {/* Primary & Secondary Action Buttons (White & Gray 50% Palette) */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            id="primary-navigate-cta-btn"
            type="button"
            onClick={handleNavigate}
 className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-98 text-white font-medium text-xs sm:text-sm transition cursor-pointer min-h-[44px]"
          >
 <Navigation className="w-4 h-4 text-gray-200" />
 <span className="font-koulen text-base tracking-wide">ទៅកាន់វត្ត (បើកការនាំផ្លូវ)</span>
          </button>

          <Link
            to="/map"
            id="secondary-view-map-cta-btn"
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 active:scale-98 text-gray-700 font-medium text-xs sm:text-sm transition border border-gray-300 cursor-pointer min-h-[44px]"
          >
 <Map className="w-4 h-4 text-gray-500" />
            <span>ពិនិត្យផែនទី</span>
          </Link>
        </div>

        {/* Error Feedback if Coordinates Missing */}
        {navError && !hasCoords && (
          <div
            id="hero-nav-error-banner"
 className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-600 text-xs max-w-md mx-auto"
          >
            មិនអាចបើកទិសដៅបានទេ ពីព្រោះទីតាំងផ្លូវការមិនទាន់បានកំណត់ដោយអ្នកគ្រប់គ្រងវត្តនៅឡើយ។
          </div>
        )}
      </div>

      {/* Bottom Metadata Bar */}
      {hasCoords && latitude !== null && longitude !== null && (
 <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-battambang">
 <div className="flex items-center gap-2">
 <span className="text-gray-400">កូអរដោនេ GPS៖</span>
 <code className="font-mono text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 font-semibold">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </code>
            <button
              id="copy-hero-coords-btn"
              type="button"
              onClick={handleCopyCoords}
 className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition cursor-pointer"
              title="ចម្លងកូអរដោនេ"
            >
              {copied ? (
                <>
 <Check className="w-3.5 h-3.5 text-gray-800" />
 <span className="text-[11px] font-medium text-gray-800">បានចម្លង</span>
                </>
              ) : (
                <>
 <Copy className="w-3.5 h-3.5 text-gray-500" />
 <span className="text-[11px]">ចម្លង</span>
                </>
              )}
            </button>
          </div>

          <a
            href={getGoogleMapsViewUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            <span>បើកមើលក្នុង Google Maps</span>
 <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>
      )}
    </section>
  );
};
