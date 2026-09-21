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
    <section id="hero-section" className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl border border-amber-900/40">
      {/* Background Cover Overlay using official /BG.jpg */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={coverImage || '/BG.jpg'}
          alt={templeNameKm}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/BG.jpg';
          }}
          className="w-full h-full object-cover object-center brightness-40 contrast-110 scale-105 transition-transform duration-1000"
        />
        {/* Soft vignette gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/40" />
      </div>

      {/* Decorative Traditional Temple Ornament Subtle Top Accent */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

      <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-14 max-w-4xl mx-auto text-center">
        {/* Temple Visual Emblem / Logo without container background, enlarged */}
        <div className="mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 mb-5 flex items-center justify-center">
          <img
            src="/Logo.png"
            alt="Wat Snay Douch Logo"
            className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.svg';
            }}
          />
        </div>

        {/* Temple Name Headings */}
        <h1 className="font-koulen text-3xl sm:text-4xl md:text-5xl text-amber-200 tracking-wide drop-shadow-sm leading-tight">
          {templeNameKm}
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 font-medium tracking-wider uppercase mt-1 mb-4">
          {templeNameEn}
        </p>

        {/* Supporting Explanation */}
        <p className="text-sm sm:text-base text-stone-200 max-w-2xl mx-auto leading-relaxed font-battambang mb-8">
          ស្វែងរកទីតាំងវត្តបានយ៉ាងងាយស្រួល ចុចដើម្បីបើកផ្លូវទៅកាន់ទីតាំងវត្តពិតប្រាកដ ដោយប្រើប្រព័ន្ធ GPS ផ្លូវការ
          ដើម្បីជៀសវាងការវង្វេងផ្លូវ ឬទីតាំងមិនត្រឹមត្រូវលើបណ្តាញសង្គម។
        </p>

        {/* PRIMARY CTA & SECONDARY ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
          {/* 1. Primary Button: "ទៅកាន់វត្ត" */}
          <button
            id="primary-navigate-cta-btn"
            type="button"
            onClick={handleNavigate}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white font-bold text-base shadow transition cursor-pointer border border-amber-500/40 min-h-[48px]"
          >
            <Navigation className="w-5 h-5 text-amber-200" />
            <span className="font-koulen text-lg tracking-wide">ទៅកាន់វត្ត (បើកផែនទី)</span>
          </button>

          {/* 2. Secondary Button: "មើលផែនទី" */}
          <Link
            to="/map"
            id="secondary-view-map-cta-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-sm shadow transition border border-stone-700 cursor-pointer min-h-[48px]"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>មើលផែនទីលើវេបសាយ</span>
          </Link>
        </div>

        {/* PWA Install Quick Button */}
        <div className="mt-4 flex items-center justify-center">
          <PWAInstallButton variant="hero" />
        </div>

        {/* Secondary Coordinate Action Bar */}
        {hasCoords && latitude !== null && longitude !== null && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-300">
            <button
              id="copy-hero-coords-btn"
              type="button"
              onClick={handleCopyCoords}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition border border-stone-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'បានចម្លងកូអរដោនេរួចរាល់' : `កូអរដោនេ: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}</span>
            </button>

            <a
              href={getGoogleMapsViewUrl(latitude, longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>បើកក្នុង Google Maps</span>
            </a>
          </div>
        )}

        {/* Error Feedback if Coordinates Missing */}
        {navError && !hasCoords && (
          <div
            id="hero-nav-error-banner"
            className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs max-w-md mx-auto"
          >
            មិនអាចបើកទិសដៅបានទេ ពីព្រោះទីតាំងផ្លូវការមិនទាន់បានកំណត់ដោយអ្នកគ្រប់គ្រងវត្តនៅឡើយ។
          </div>
        )}
      </div>
    </section>
  );
};
