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
 <div id="official-location-card" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 relative overflow-hidden font-battambang">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
 <div className="flex items-center gap-2 mb-1">
 <MapPin className="w-5 h-5 text-gray-600" />
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
              ព័ត៌មានទីតាំងផ្លូវការរបស់វត្ត
            </h2>
          </div>
 <p className="text-xs sm:text-sm text-gray-500">
            កូអរដោនេ GPS ផ្លូវការដែលបានផ្ទៀងផ្ទាត់ដោយផ្ទាល់
          </p>
        </div>

        {/* Verification Status Badge */}
        <div>
          {hasCoords ? (
            settings.location_verified ? (
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
 <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
                <span>ទីតាំងបានផ្ទៀងផ្ទាត់ផ្លូវការ</span>
              </div>
            ) : (
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300">
 <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                <span>ទីតាំងមិនទាន់បានផ្ទៀងផ្ទាត់</span>
              </div>
            )
          ) : (
 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300">
 <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>ទីតាំងផ្លូវការមិនទាន់បានកំណត់</span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate Display Grid */}
 <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Latitude Card */}
 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
 <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
            Latitude (រយៈទទឹង)
          </span>
 <span className="font-mono text-base sm:text-lg font-semibold text-gray-800 mt-1 block">
            {hasCoords && settings.latitude !== null ? settings.latitude.toFixed(6) : '---'}
          </span>
        </div>

        {/* Longitude Card */}
 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
 <span className="text-xs font-medium text-gray-500 block uppercase tracking-wider">
            Longitude (រយៈបណ្តោយ)
          </span>
 <span className="font-mono text-base sm:text-lg font-semibold text-gray-800 mt-1 block">
            {hasCoords && settings.longitude !== null ? settings.longitude.toFixed(6) : '---'}
          </span>
        </div>
      </div>

      {/* Official Address Section */}
 <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm">
 <div className="flex items-start gap-2.5">
 <Building2 className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
 <div className="flex-1">
 <span className="font-semibold text-gray-700 block text-xs uppercase tracking-wider">
              អាសយដ្ឋានវត្ត
            </span>
            {addressParts.length > 0 ? (
 <p className="text-gray-800 mt-1 font-medium leading-relaxed">
                {addressParts.join(' ')}
              </p>
            ) : (
 <p className="text-gray-400 italic text-xs mt-1">
                មិនទាន់មានការកំណត់អាសយដ្ឋានលម្អិត (អាចកំណត់ក្នុង Admin)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verification Date & Admin Notes */}
      {settings.location_verified && settings.verified_at && (
 <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
 <Calendar className="w-3.5 h-3.5 text-gray-400" />
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
 className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-98 text-white font-medium text-sm transition cursor-pointer min-h-[44px]"
            >
 <Navigation className="w-4 h-4 text-gray-200" />
              <span>ទៅកាន់វត្ត (Google Maps)</span>
            </a>

            <button
              id="copy-coords-btn"
              type="button"
              onClick={handleCopy}
 className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition cursor-pointer active:scale-95 min-h-[44px]"
            >
 {copied ? <Check className="w-3.5 h-3.5 text-gray-800" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
              <span>{copied ? 'បានចម្លងកូអរដោនេរួចរាល់' : 'ចម្លងកូអរដោនេ'}</span>
            </button>
          </>
        ) : (
 <div className="w-full text-center py-2 text-xs text-gray-500">
            ប៊ូតុងនាំផ្លូវនឹងដំណើរការដោយស្វ័យប្រវត្តិ នៅពេលអ្នកគ្រប់គ្រងបញ្ចូលកូអរដោនេ GPS ផ្លូវការ។
          </div>
        )}
      </div>
    </div>
  );
};
