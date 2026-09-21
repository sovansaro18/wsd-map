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
    <div id="map-page" className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-6 h-6 text-amber-700" />
              <h1 className="font-koulen text-2xl sm:text-3xl text-stone-900 tracking-wide">
                ផែនទី និងទិសដៅធ្វើដំណើរផ្លូវការ
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-battambang">
              ទីតាំងផ្ទាល់របស់ {settings.temple_name_km}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasCoords && settings.location_verified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ទីតាំងបានផ្ទៀងផ្ទាត់</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>{hasCoords ? 'ទីតាំងមិនទាន់បានផ្ទៀងផ្ទាត់' : 'ទីតាំងផ្លូវការមិនទាន់បានកំណត់'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {hasCoords && settings.latitude !== null && settings.longitude !== null ? (
            <>
              <a
                id="map-page-primary-nav-btn"
                href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow transition cursor-pointer active:scale-95 min-h-[44px]"
              >
                <Navigation className="w-4 h-4 text-amber-200" />
                <span>ទៅកាន់វត្ត (Google Maps)</span>
              </a>

              <button
                id="map-page-copy-coords-btn"
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm border border-stone-300 transition cursor-pointer active:scale-95 min-h-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                <span>{copied ? 'បានចម្លងរួចរាល់' : 'ចម្លងកូអរដោនេ'}</span>
              </button>

              <a
                href={getAppleMapsNavigationUrl(settings.latitude, settings.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm border border-stone-300 transition"
              >
                <ExternalLink className="w-4 h-4 text-stone-600" />
                <span>Apple Maps</span>
              </a>
            </>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-200 w-full">
              ទីតាំងផ្លូវការមិនទាន់បានកំណត់ដោយអ្នកគ្រប់គ្រងវត្តនៅឡើយទេ
            </div>
          )}
        </div>
      </div>

      {/* Main Full-Scale Map */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-3 sm:p-4">
        <TempleMap
          latitude={settings.latitude}
          longitude={settings.longitude}
          templeNameKm={settings.temple_name_km}
          isVerified={settings.location_verified}
          height="540px"
          showUserLocationToggle={true}
        />
      </div>

      {/* Map Information Callout Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <h3 className="font-koulen text-lg text-amber-900 mb-2">
            ព័ត៌មានលម្អិតអំពីទីតាំង
          </h3>
          <div className="space-y-1.5 text-xs sm:text-sm text-stone-700">
            <p>
              <strong className="text-stone-900">ឈ្មោះវត្ត៖</strong> {settings.temple_name_km}
            </p>
            <p>
              <strong className="text-stone-900">កូអរដោនេ៖</strong>{' '}
              {hasCoords && settings.latitude !== null && settings.longitude !== null
                ? `${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`
                : 'មិនទាន់បានកំណត់'}
            </p>
            {addressParts.length > 0 && (
              <p>
                <strong className="text-stone-900">អាសយដ្ឋាន៖</strong> {addressParts.join(' ')}
              </p>
            )}
          </div>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 text-xs text-stone-700 space-y-2">
          <h4 className="font-semibold text-amber-950 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-700" />
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
