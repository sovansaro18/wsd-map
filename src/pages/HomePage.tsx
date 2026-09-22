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
    <div className="space-y-4 sm:space-y-6 py-2 sm:py-4 w-full">
      {/* 1. Temple Identity & GPS Summary */}
      <HeroSection settings={settings} />

      {/* 2. Interactive Map (Edge-to-edge inside card, maximized view area) */}
      <section id="homepage-map-section" className="bg-white rounded-2xl border border-gray-200 overflow-hidden font-battambang">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 sm:px-5 sm:py-3 border-b border-gray-100">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h2 className="font-koulen text-lg sm:text-xl text-gray-800 tracking-wide">
            ផែនទីទីតាំង
          </h2>
        </div>

        <div className="w-full">
          <TempleMap
            latitude={settings.latitude}
            longitude={settings.longitude}
            templeNameKm={settings.temple_name_km}
            isVerified={settings.location_verified}
            height="560px"
            showUserLocationToggle={true}
          />
        </div>
      </section>

      {/* 3. Road & Entrance Directions (if configured) */}
      <EntranceRoadInfo settings={settings} />

      {/* 4. Contact Section */}
      <ContactSection settings={settings} />
    </div>
  );
};
