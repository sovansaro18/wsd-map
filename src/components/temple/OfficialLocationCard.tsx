import React, { useState } from 'react';
import { TempleSettings } from '../../types/temple';
import { isValidCoordinates, getGoogleMapsNavigationUrl, toKhmerNumerals } from '../../utils/navigation';
import { MapPin, Navigation, Copy, Check, ShieldCheck, AlertCircle, Building2, Calendar } from 'lucide-react';

interface OfficialLocationCardProps {
  settings: TempleSettings;
}

export const OfficialLocationCard: React.FC<OfficialLocationCardProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  const handleCopy = () => {
    if (hasCoords && settings.latitude !== null && settings.longitude !== null) {
      const text = `${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Build address string cleanly based on available fields without inventing missing parts
  const addressParts: string[] = [];
  if (settings.village_km) addressParts.push(`ភូមិ${settings.village_km}`);
  if (settings.commune_km) addressParts.push(`ឃុំ/សង្កាត់${settings.commune_km}`);
  if (settings.district_km) addressParts.push(`ស្រុក/ខណ្ឌ${settings.district_km}`);
  if (settings.province_km) addressParts.push(`ខេត្ត/រាជធានី${settings.province_km}`);
  if (addressParts.length === 0 && settings.address_km) {
    addressParts.push(settings.address_km);
  }

  return (
    <div id="official-location-card" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 relative overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-600" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-amber-700" />
            <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
              ព័ត៌មានទីតាំងផ្លូវការរបស់វត្ត
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            កូអរដោនេ GPS ផ្លូវការដែលបានផ្ទៀងផ្ទាត់ដោយផ្ទាល់
          </p>
        </div>

        {/* Verification Status Badge */}
        <div>
          {hasCoords ? (
            settings.location_verified ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ទីតាំងបានផ្ទៀងផ្ទាត់ផ្លូវការ</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>ទីតាំងមិនទាន់បានផ្ទៀងផ្ទាត់</span>
              </div>
            )
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>ទីតាំងផ្លូវការមិនទាន់បានកំណត់</span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate Display Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Latitude Card */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Latitude (រយៈទទឹង)
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-stone-800 mt-1 block">
            {hasCoords && settings.latitude !== null ? settings.latitude.toFixed(6) : '---'}
          </span>
        </div>

        {/* Longitude Card */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
          <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
            Longitude (រយៈបណ្តោយ)
          </span>
          <span className="font-mono text-base sm:text-lg font-bold text-stone-800 mt-1 block">
            {hasCoords && settings.longitude !== null ? settings.longitude.toFixed(6) : '---'}
          </span>
        </div>
      </div>

      {/* Official Address Section */}
      <div className="mt-5 bg-amber-50/50 rounded-xl p-4 border border-amber-100/80 text-sm">
        <div className="flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-amber-950 block text-xs uppercase tracking-wider">
              អាសយដ្ឋានវត្ត
            </span>
            {addressParts.length > 0 ? (
              <p className="text-stone-800 mt-1 font-medium leading-relaxed">
                {addressParts.join(' ')}
              </p>
            ) : (
              <p className="text-stone-400 italic text-xs mt-1">
                មិនទាន់មានការកំណត់អាសយដ្ឋានលម្អិត (អាចកំណត់ក្នុង Admin)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Date & Admin Notes */}
      {settings.location_verified && settings.verified_at && (
        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>
            បានផ្ទៀងផ្ទាត់នៅថ្ងៃ: {toKhmerNumerals(new Date(settings.verified_at).toLocaleDateString('km-KH'))}
            {settings.verified_by && ` ដោយ: ${settings.verified_by}`}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {hasCoords && settings.latitude !== null && settings.longitude !== null ? (
          <>
            <a
              id="location-card-navigate-btn"
              href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-base shadow transition cursor-pointer"
            >
              <Navigation className="w-5 h-5 text-amber-200" />
              <span>ទៅកាន់វត្ត (Google Maps)</span>
            </a>

            <button
              id="copy-coords-btn"
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm border border-stone-300 transition cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
              <span>{copied ? 'បានចម្លងកូអរដោនេរួចរាល់' : 'ចម្លងកូអរដោនេ'}</span>
            </button>
          </>
        ) : (
          <div className="w-full text-center py-2 text-xs text-stone-500">
            ប៊ូតុងនាំផ្លូវនឹងដំណើរការដោយស្វ័យប្រវត្តិ នៅពេលអ្នកគ្រប់គ្រងបញ្ចូលកូអរដោនេ GPS ផ្លូវការ។
          </div>
        )}
      </div>
    </div>
  );
};
