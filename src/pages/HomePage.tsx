import React from 'react';
import { TempleSettings } from '../types/temple';
import { HeroSection } from '../components/temple/HeroSection';
import { TempleMap } from '../components/map/TempleMap';
import { EntranceRoadInfo } from '../components/temple/EntranceRoadInfo';
import { ContactSection } from '../components/temple/ContactSection';
import { MapPin } from 'lucide-react';

interface HomePageProps {
  settings: TempleSettings;
}

export const HomePage: React.FC<HomePageProps> = ({ settings }) => {
  return (
    <div className="space-y-6 py-4 w-full">
      {/* 1. Temple Identity & GPS Summary */}
      <HeroSection settings={settings} />

      {/* 2. Interactive Map */}
      <section id="homepage-map-section" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 font-battambang">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
            ផែនទីទីតាំង
          </h2>
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

      {/* 3. Road & Entrance Directions (if configured) */}
      <EntranceRoadInfo settings={settings} />

      {/* 4. Contact Section */}
      <ContactSection settings={settings} />
    </div>
  );
};
