import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Image, Phone, Navigation } from 'lucide-react';
import { isValidCoordinates, getGoogleMapsNavigationUrl } from '../../utils/navigation';

interface MobileBottomNavProps {
  latitude: number | null;
  longitude: number | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ latitude, longitude }) => {
  const location = useLocation();
  const hasCoords = isValidCoordinates(latitude, longitude);

  const tabs = [
    { label: 'ទំព័រដើម', path: '/', icon: Home },
    { label: 'ផែនទី', path: '/map', icon: Map },
    { label: 'រូបភាព', path: '/gallery', icon: Image },
    { label: 'ទំនាក់ទំនង', path: '/contact', icon: Phone },
  ];

  const handleNavigateClick = (e: React.MouseEvent) => {
    if (!hasCoords || latitude === null || longitude === null) {
      e.preventDefault();
      alert('ទីតាំងផ្លូវការមិនទាន់បានកំណត់ដោយអ្នកគ្រប់គ្រងវត្តនៅឡើយទេ');
    }
  };

  return (
    <div id="mobile-bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-stone-900/95 backdrop-blur-md border-t border-amber-900/40 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
                isActive ? 'text-amber-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </Link>
          );
        })}

        {/* Highlighted Direct Action on Mobile */}
        {hasCoords && latitude !== null && longitude !== null ? (
          <a
            href={getGoogleMapsNavigationUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavigateClick}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl bg-amber-700 text-white font-bold shadow-md active:scale-95 transition"
          >
            <Navigation className="w-5 h-5 text-amber-200" />
            <span className="text-[11px] mt-0.5">ទៅវត្ត</span>
          </a>
        ) : (
          <Link
            to="/map"
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl bg-stone-800 text-amber-300 font-medium"
          >
            <Map className="w-5 h-5 text-amber-400" />
            <span className="text-[11px] mt-0.5">មើលផែនទី</span>
          </Link>
        )}
      </div>
    </div>
  );
};
