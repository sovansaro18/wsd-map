import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Phone, Copy, Check, MapPin } from 'lucide-react';
import { TempleSettings } from '../../types/temple';
import { isValidCoordinates, getGoogleMapsNavigationUrl } from '../../utils/navigation';

interface HeroSectionProps {
  settings: TempleSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  const addressParts: string[] = [];
  if (settings.village_km) addressParts.push(`ភូមិ${settings.village_km}`);
  if (settings.commune_km) addressParts.push(`ឃុំ${settings.commune_km}`);
  if (settings.district_km) addressParts.push(`ស្រុក${settings.district_km}`);
  if (settings.province_km) addressParts.push(`ខេត្ត${settings.province_km}`);
  if (addressParts.length === 0 && settings.address_km) {
    addressParts.push(settings.address_km);
  }
  const fullAddress = addressParts.join(' ');

  const handleNavigate = () => {
    if (!hasCoords || settings.latitude === null || settings.longitude === null) return;
    const navUrl = getGoogleMapsNavigationUrl(settings.latitude, settings.longitude);
    try {
      window.open(navUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = navUrl;
    }
  };

  const handleCopyCoords = () => {
    if (hasCoords && settings.latitude !== null && settings.longitude !== null) {
      navigator.clipboard.writeText(`${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="hero-section" className="rounded-2xl bg-white text-gray-800 border border-gray-200 p-4 sm:p-7 font-battambang">
      <div className="max-w-xl mx-auto text-center">
        {/* Temple Visual Logo */}
        <div className="w-20 h-20 rounded-2xl bg-gray-50 p-2 border border-gray-200 mx-auto mb-3 flex items-center justify-center">
          <img
            src="/Logo.png"
            alt={settings.temple_name_km}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.svg';
            }}
          />
        </div>

        {/* Temple Name */}
        <h1 className="font-koulen text-2xl sm:text-3xl text-gray-800 tracking-wide">
          {settings.temple_name_km}
        </h1>
        {settings.temple_name_en && (
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase mt-0.5">
            {settings.temple_name_en}
          </p>
        )}

        {/* Address (if available) */}
        {fullAddress && (
          <div className="mt-2 text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1.5 font-battambang">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{fullAddress}</span>
          </div>
        )}

        {/* GPS Coordinates (Clean & Minimal) */}
        {hasCoords && settings.latitude !== null && settings.longitude !== null && (
          <div className="mt-3 inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-xs">
            <code className="font-rajdhani font-semibold text-sm tracking-wider text-gray-800">
              {settings.latitude.toFixed(5)}, {settings.longitude.toFixed(5)}
            </code>
            <button
              id="copy-coords-btn"
              type="button"
              onClick={handleCopyCoords}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition cursor-pointer ml-1"
              title="ចម្លងកូអរដោនេ"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-gray-800" />
                  <span className="text-[11px] text-gray-800 font-medium">បានចម្លង</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">ចម្លង</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button
            id="primary-navigate-cta-btn"
            type="button"
            onClick={handleNavigate}
            disabled={!hasCoords}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 active:scale-98 text-white font-medium text-xs sm:text-sm transition cursor-pointer min-h-[42px] disabled:opacity-50"
          >
            <Navigation className="w-4 h-4 text-gray-200" />
            <span className="font-koulen text-base tracking-wide">ទៅកាន់វត្ត (Google Maps)</span>
          </button>

          <Link
            to="/contact"
            id="secondary-contact-cta-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 active:scale-98 text-gray-700 font-medium text-xs sm:text-sm transition border border-gray-300 cursor-pointer min-h-[42px]"
          >
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="font-koulen text-base tracking-wide">ទំនាក់ទំនង</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
