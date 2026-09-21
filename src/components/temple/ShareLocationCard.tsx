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
    <section id="share-location-card" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
      <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
            ចែករំលែកទីតាំងវត្ត
          </h2>
          <p className="text-xs text-stone-500">
            ចែករំលែកទៅកាន់មិត្តភក្តិ ក្រុមគ្រួសារ ឬបណ្តាញសង្គម ដើម្បីងាយស្រួលធ្វើដំណើរមកកាន់វត្ត
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {copyMsg && (
        <div
          id="share-success-toast"
          className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{copyMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Main Share Button */}
        <button
          id="web-share-btn"
          type="button"
          onClick={handleNativeShare}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Share2 className="w-4 h-4" />
          <span>ចែករំលែកទីតាំង</span>
        </button>

        {/* Copy Google Maps URL */}
        <button
          id="copy-maps-link-btn"
          type="button"
          onClick={handleCopyMapsLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm border border-stone-300 transition active:scale-95 cursor-pointer min-h-[44px]"
        >
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>ចម្លងតំណភ្ជាប់ Google Maps</span>
        </button>

        {/* Copy Website URL */}
        <button
          id="copy-web-link-btn"
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm border border-stone-300 transition active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Link2 className="w-4 h-4 text-stone-600" />
          <span>ចម្លងតំណភ្ជាប់គេហទំព័រ</span>
        </button>
      </div>

      {/* Share coordinates directly */}
      {hasCoords && settings.latitude !== null && settings.longitude !== null && (
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <span>កូអរដោនេផ្លូវការ៖ {settings.latitude.toFixed(6)}, {settings.longitude.toFixed(6)}</span>
          <button
            onClick={handleCopyCoordinates}
            className="text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-4 cursor-pointer"
          >
            ចម្លងកូអរដោនេ
          </button>
        </div>
      )}
    </section>
  );
};
