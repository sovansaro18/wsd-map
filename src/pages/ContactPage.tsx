import React from 'react';
import { TempleSettings } from '../types/temple';
import { ContactSection } from '../components/temple/ContactSection';
import { EntranceRoadInfo } from '../components/temple/EntranceRoadInfo';
import { HeroSection } from '../components/temple/HeroSection';

interface ContactPageProps {
  settings: TempleSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  return (
    <div id="contact-page" className="space-y-6 py-4 w-full font-battambang">
      {/* Temple Header with quick actions */}
      <HeroSection settings={settings} />

      {/* Direct Contact Channels */}
      <ContactSection settings={settings} />

      {/* Road / Entrance Info if configured */}
      <EntranceRoadInfo settings={settings} />
    </div>
  );
};
