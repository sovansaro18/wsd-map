import React, { useState } from 'react';
import { TempleSettings } from '../../types/temple';
import { isValidCoordinates, getGoogleMapsNavigationUrl } from '../../utils/navigation';
import { Share2, Copy, Check, ExternalLink, Link2, MapPin } from 'lucide-react';

interface ShareLocationCardProps {
  settings: TempleSettings;
}

export const ShareLocationCard: React.FC<ShareLocationCardProps> = ({ settings }) => {
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  const websiteUrl = window.location.origin;
  const mapsUrl = hasCoords && settings.latitude !== null && settings.longitude !== null
    ? getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)
    : websiteUrl;

  const showToast = (msg: string) => {
    setCopyMsg(msg);
    setTimeout(() => setCopyMsg(null), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: settings.temple_name_km,
          text: `ទីតាំង និងទិសដៅផ្លូវការទៅកាន់ ${settings.temple_name_km}:`,
          url: mapsUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    showToast('បានចម្លងតំណភ្ជាប់គេហទំព័ររួចរាល់');
  };

  const handleCopyMapsLink = () => {
    navigator.clipboard.writeText(mapsUrl);
    showToast('បានចម្លងទីតាំងរួចរាល់');
  };

  const handleCopyCoordinates = () => {
    if (hasCoords && settings.latitude !== null && settings.longitude !== null) {
      navigator.clipboard.writeText(`${settings.latitude.toFixed(6)}, ${settings.longitude.toFixed(6)}`);
      showToast('បានចម្លងកូអរដោនេរួចរាល់');
    }
  };

  return (
 <section id="share-location-card" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 font-battambang">
      {/* Header */}
 <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <Share2 className="w-5 h-5" />
        </div>
        <div>
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide leading-tight">
            ចែករំលែកទីតាំងវត្ត
          </h2>
 <p className="text-xs text-gray-500 mt-0.5">
            ចែករំលែកទិសដៅ និងតំណភ្ជាប់ផ្លូវការទៅកាន់បណ្តាញសង្គម ឬមិត្តភក្តិ
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {copyMsg && (
        <div
          id="share-success-toast"
 className="mb-4 p-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in"
        >
 <Check className="w-4 h-4 text-gray-700 shrink-0" />
          <span>{copyMsg}</span>
        </div>
      )}

      {/* Primary Action Button (Neutral Gray 50% - No pitch black) */}
      <button
        id="web-share-btn"
        type="button"
        onClick={handleNativeShare}
 className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 active:scale-98 text-white font-medium text-xs sm:text-sm transition cursor-pointer min-h-[44px] mb-4"
      >
 <Share2 className="w-4 h-4" />
        <span>ចុចដើម្បីចែករំលែកទីតាំង (Share)</span>
      </button>

      {/* Orderly Structured Link & Coordinates Box */}
 <div className="bg-gray-50 rounded-xl border border-gray-200 p-3.5 space-y-2.5">
        {/* Row 1: Google Maps Navigation Link */}
 <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-gray-200">
 <div className="flex items-center gap-2 min-w-0">
 <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
 <span className="text-xs text-gray-700 font-medium truncate">តំណភ្ជាប់ Google Maps</span>
          </div>
          <button
            id="copy-maps-link-btn"
            type="button"
            onClick={handleCopyMapsLink}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-medium border border-gray-300 transition cursor-pointer shrink-0"
          >
 <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>ចម្លង</span>
          </button>
        </div>

        {/* Row 2: Web App Link */}
 <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-gray-200">
 <div className="flex items-center gap-2 min-w-0">
 <Link2 className="w-4 h-4 text-gray-500 shrink-0" />
 <span className="text-xs text-gray-700 font-medium truncate">តំណភ្ជាប់គេហទំព័រវត្ត</span>
          </div>
          <button
            id="copy-web-link-btn"
            type="button"
            onClick={handleCopyLink}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-medium border border-gray-300 transition cursor-pointer shrink-0"
          >
 <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>ចម្លង</span>
          </button>
        </div>

        {/* Row 3: Official Coordinates */}
        {hasCoords && settings.latitude !== null && settings.longitude !== null && (
 <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-gray-200">
 <div className="flex items-center gap-2 min-w-0">
 <span className="text-[11px] text-gray-400 font-medium shrink-0">GPS:</span>
 <code className="text-xs font-mono text-gray-800 font-semibold truncate">
                {settings.latitude.toFixed(5)}, {settings.longitude.toFixed(5)}
              </code>
            </div>
            <button
              onClick={handleCopyCoordinates}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-xs font-medium border border-gray-300 transition cursor-pointer shrink-0"
            >
 <Copy className="w-3.5 h-3.5 text-gray-500" />
              <span>ចម្លងកូអរដោនេ</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
