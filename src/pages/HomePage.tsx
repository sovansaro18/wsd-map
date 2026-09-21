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
      <section id="homepage-map-section" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
                ផែនទីទីតាំងផ្លូវការរបស់វត្ត
              </h2>
              <p className="text-xs text-stone-500">
                ពិនិត្យមើលទីតាំងផ្ទាល់ និងចម្ងាយពីកន្លែងដែលអ្នកកំពុងនៅ
              </p>
            </div>
          </div>

          {hasCoords && settings.latitude !== null && settings.longitude !== null && (
            <a
              href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-amber-200" />
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

      {/* 4. Navigation Direct Callout */}
      {hasCoords && settings.latitude !== null && settings.longitude !== null && (
        <section id="mid-page-navigation-cta" className="rounded-2xl bg-stone-900 text-white p-6 sm:p-7 border border-amber-900/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>ទិសដៅធ្វើដំណើរដោយផ្ទាល់</span>
            </div>
            <h3 className="font-koulen text-xl sm:text-2xl text-amber-100">ចេញដំណើរទៅកាន់វត្ត</h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              បើកកម្មវិធី Google Maps នៅលើឧបករណ៍របស់អ្នក ដោយប្រើកូអរដោនេផ្លូវការដែលបានផ្ទៀងផ្ទាត់រួចរាល់។
            </p>
          </div>
          <a
            id="mid-navigate-btn"
            href={getGoogleMapsNavigationUrl(settings.latitude, settings.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-semibold text-base transition active:scale-98 shrink-0 cursor-pointer min-h-[46px]"
          >
            <Navigation className="w-4 h-4 text-amber-200" />
            <span className="font-koulen text-base tracking-wide">បើកផ្លូវធ្វើដំណើរ</span>
          </a>
        </section>
      )}

      {/* 5. Road & Entrance Information */}
      <EntranceRoadInfo settings={settings} />

      {/* 6. PWA Mobile App Card */}
      <PWAFeatureCard />

      {/* 7. Visual Identification Gallery */}
      <VisualGallery photos={gallery} />

      {/* 7. Contact Temple */}
      <ContactSection settings={settings} />

      {/* 8. Share Location */}
      <ShareLocationCard settings={settings} />

      {/* 9. QR Code */}
      <QRCodeCard settings={settings} />
    </div>
  );
};
