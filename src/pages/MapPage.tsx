import React, { useState } from 'react';
import { TempleSettings } from '../types/temple';
import { TempleMap } from '../components/map/TempleMap';
import { isValidCoordinates, getGoogleMapsNavigationUrl, getGoogleMapsViewUrl, getAppleMapsNavigationUrl } from '../utils/navigation';
import { Navigation, MapPin, Copy, Check, ExternalLink, ShieldCheck, AlertCircle, Compass } from 'lucide-react';

interface MapPageProps {
  settings: TempleSettings;
}

export const MapPage: React.FC<MapPageProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  const handleCopy = () => {
    if (hasCoords && settings.latitude !== null && settings.longitude !== null) {
      navigator.clipboard.writeText(`${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const addressParts: string[] = [];
  if (settings.village_km) addressParts.push(`ភូមិ${settings.village_km}`);
  if (settings.commune_km) addressParts.push(`ឃុំ/សង្កាត់${settings.commune_km}`);
  if (settings.district_km) addressParts.push(`ស្រុក/ខណ្ឌ${settings.district_km}`);
  if (settings.province_km) addressParts.push(`ខេត្ត/រាជធានី${settings.province_km}`);
  if (addressParts.length === 0 && settings.address_km) addressParts.push(settings.address_km);

  return (
    <div id="map-page" className="space-y-6 py-4 w-full font-battambang">
      {/* Unified Map & Controls Container */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Top Header & Action Toolbar */}
 <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
 <div className="flex flex-wrap items-center gap-2 mb-1">
 <h1 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
                ផែនទី និងទិសដៅទៅកាន់វត្ត
              </h1>
              {hasCoords && settings.location_verified ? (
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 whitespace-nowrap">
 <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
                  <span>ទីតាំងផ្លូវការ</span>
                </span>
              ) : (
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-300 whitespace-nowrap">
 <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                  <span>{hasCoords ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : 'មិនទាន់កំណត់'}</span>
                </span>
              )}
            </div>
 <p className="text-xs sm:text-sm text-gray-500 font-battambang">
              {settings.temple_name_km}
            </p>
          </div>

          {/* Action Toolbar with clean 1-line buttons and White & Gray 50% theme */}
          {hasCoords && settings.latitude !== null && settings.longitude !== null ? (
 <div className="flex flex-wrap items-center gap-2">
              <a
                id="map-page-primary-nav-btn"
                href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
                target="_blank"
                rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-98 text-white font-medium text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
              >
 <Navigation className="w-4 h-4 text-white" />
 <span className="whitespace-nowrap">បើក Google Maps</span>
              </a>

              <button
                id="map-page-copy-coords-btn"
                type="button"
                onClick={handleCopy}
 className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition cursor-pointer active:scale-95 whitespace-nowrap"
              >
 {copied ? <Check className="w-4 h-4 text-gray-800" /> : <Copy className="w-4 h-4 text-gray-500" />}
 <span className="whitespace-nowrap">{copied ? 'បានចម្លង' : 'ចម្លងកូអរដោនេ'}</span>
              </button>

              <a
                href={getAppleMapsNavigationUrl(settings.latitude, settings.longitude)}
                target="_blank"
                rel="noopener noreferrer"
 className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition whitespace-nowrap"
              >
 <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>Apple Maps</span>
              </a>
            </div>
          ) : (
 <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-200">
              ទីតាំងផ្លូវការមិនទាន់បានកំណត់ដោយអ្នកគ្រប់គ្រងវត្តនៅឡើយទេ
            </div>
          )}
        </div>

        {/* The Map itself cleanly nested */}
 <div className="p-3 sm:p-4 bg-gray-50">
          <TempleMap
            latitude={settings.latitude}
            longitude={settings.longitude}
            templeNameKm={settings.temple_name_km}
            isVerified={settings.location_verified}
            height="500px"
            showUserLocationToggle={true}
          />
        </div>
      </div>

      {/* Map Information Callout Card */}
 <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
 <h3 className="font-koulen text-base sm:text-lg text-gray-800 mb-2">
            ព័ត៌មានលម្អិតអំពីទីតាំង
          </h3>
 <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 font-battambang">
            <p>
 <strong className="text-gray-800 font-medium">ឈ្មោះវត្ត៖</strong> {settings.temple_name_km}
            </p>
            <p>
 <strong className="text-gray-800 font-medium">កូអរដោនេ៖</strong>{' '}
              {hasCoords && settings.latitude !== null && settings.longitude !== null
                ? `${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`
                : 'មិនទាន់បានកំណត់'}
            </p>
            {addressParts.length > 0 && (
              <p>
 <strong className="text-gray-800 font-medium">អាសយដ្ឋាន៖</strong> {addressParts.join(' ')}
              </p>
            )}
          </div>
        </div>

 <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-600 space-y-2 font-battambang">
 <h4 className="font-medium text-gray-800 flex items-center gap-1.5">
 <MapPin className="w-4 h-4 text-gray-500" />
            <span>ការណែនាំអំពីការរុករក</span>
          </h4>
 <p className="leading-relaxed">
            ចុចលើប៊ូតុង &quot;ទៅកាន់វត្ត&quot; ដើម្បីបើកកម្មវិធី Google Maps។ ប្រព័ន្ធនឹងបញ្ជូនកូអរដោនេត្រង់ចំណុចវត្តតែម្តង ដោយមិនពឹងផ្អែកលើការវាយស្វែងរកឈ្មោះវត្តនោះឡើយ។
          </p>
        </div>
      </div>
    </div>
  );
};
