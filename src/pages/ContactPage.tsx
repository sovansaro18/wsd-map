import React from 'react';
import { TempleSettings } from '../types/temple';
import { ContactSection } from '../components/temple/ContactSection';
import { EntranceRoadInfo } from '../components/temple/EntranceRoadInfo';
import { Phone, Navigation, MapPin } from 'lucide-react';
import { isValidCoordinates, getGoogleMapsNavigationUrl } from '../utils/navigation';

interface ContactPageProps {
  settings: TempleSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  return (
    <div id="contact-page" className="space-y-6 py-4 w-full font-battambang">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <Phone className="w-5 h-5" />
            </div>
            <div>
 <h1 className="font-koulen text-2xl sm:text-3xl text-gray-800 tracking-wide">
                ទំនាក់ទំនង និងការណែនាំផ្លូវ
              </h1>
 <p className="text-xs sm:text-sm text-gray-500 font-battambang">
                លេខទូរស័ព្ទ Telegram និងបណ្តាញទំនាក់ទំនងផ្លូវការរបស់ {settings.temple_name_km}
              </p>
            </div>
          </div>

          {hasCoords && settings.latitude !== null && settings.longitude !== null && (
            <a
              href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
              target="_blank"
              rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 active:scale-98 text-white font-medium text-xs sm:text-sm transition"
            >
 <Navigation className="w-4 h-4 text-gray-200" />
              <span>ទៅកាន់វត្ត (Google Maps)</span>
            </a>
          )}
        </div>
      </div>

      <ContactSection settings={settings} />

      <EntranceRoadInfo settings={settings} />
    </div>
  );
};
