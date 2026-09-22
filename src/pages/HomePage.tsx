import React from 'react';
import { TempleSettings, GalleryPhoto } from '../types/temple';
import { HeroSection } from '../components/temple/HeroSection';
import { OfficialLocationCard } from '../components/temple/OfficialLocationCard';
import { TempleMap } from '../components/map/TempleMap';
import { EntranceRoadInfo } from '../components/temple/EntranceRoadInfo';
import { VisualGallery } from '../components/temple/VisualGallery';
import { ContactSection } from '../components/temple/ContactSection';
import { ShareLocationCard } from '../components/temple/ShareLocationCard';
import { QRCodeCard } from '../components/temple/QRCodeCard';
import { PWAFeatureCard } from '../components/temple/PWAFeatureCard';
import { isValidCoordinates, getGoogleMapsNavigationUrl } from '../utils/navigation';
import { Navigation, MapPin, Compass } from 'lucide-react';

interface HomePageProps {
  settings: TempleSettings;
  gallery: GalleryPhoto[];
}

export const HomePage: React.FC<HomePageProps> = ({ settings, gallery }) => {
  const coverPhoto = gallery.find((p) => p.is_cover)?.image_url || gallery[0]?.image_url;
  const hasCoords = isValidCoordinates(settings.latitude, settings.longitude);

  return (
 <div className="space-y-8 py-6">
      {/* 1. Hero / Location CTA Section */}
      <HeroSection
        templeNameKm={settings.temple_name_km}
        templeNameEn={settings.temple_name_en}
        descriptionKm={settings.description_km}
        latitude={settings.latitude}
        longitude={settings.longitude}
        isVerified={settings.location_verified}
        coverImage={coverPhoto}
      />

      {/* 2. Official Location Card */}
      <OfficialLocationCard settings={settings} />

      {/* 3. Interactive Map Section */}
 <section id="homepage-map-section" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 font-battambang">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-5">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <MapPin className="w-5 h-5" />
            </div>
            <div>
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
                ផែនទីទីតាំងផ្លូវការរបស់វត្ត
              </h2>
 <p className="text-xs text-gray-500">
                ពិនិត្យមើលទីតាំងផ្ទាល់ និងចម្ងាយពីកន្លែងដែលអ្នកកំពុងនៅ
              </p>
            </div>
          </div>

          {hasCoords && settings.latitude !== null && settings.longitude !== null && (
            <a
              href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
              target="_blank"
              rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-500 hover:bg-gray-600 text-white text-xs sm:text-sm font-medium transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
 <Navigation className="w-4 h-4 text-gray-200" />
              <span>បើកផ្លូវ Google Maps</span>
            </a>
          )}
        </div>

        <TempleMap
          latitude={settings.latitude}
          longitude={settings.longitude}
          templeNameKm={settings.temple_name_km}
          isVerified={settings.location_verified}
          height="450px"
          showUserLocationToggle={true}
        />
      </section>

      {/* 4. Road & Entrance Information */}
      <EntranceRoadInfo settings={settings} />

      {/* 5. Visual Identification Gallery */}
      <VisualGallery photos={gallery} />

      {/* 6. Contact Temple */}
      <ContactSection settings={settings} />

      {/* 7. Share Location & QR Code (Orderly 2-Column Grid) */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShareLocationCard settings={settings} />
        <QRCodeCard settings={settings} />
      </div>

      {/* 8. PWA Mobile App Card */}
      <PWAFeatureCard />
    </div>
  );
};
