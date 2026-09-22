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

  const [showMissingModal, setShowMissingModal] = React.useState(false);

  const handleNavigateClick = (e: React.MouseEvent) => {
    if (!hasCoords || latitude === null || longitude === null) {
      e.preventDefault();
      setShowMissingModal(true);
    }
  };

  return (
    <>
      {showMissingModal && (
        <div
          id="mobile-nav-missing-coords-modal"
 className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowMissingModal(false)}
        >
          <div
 className="w-full max-w-sm rounded-2xl bg-white p-5 border border-gray-200 text-gray-800 text-center font-battambang"
            onClick={(e) => e.stopPropagation()}
          >
 <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-600 border border-gray-200">
 <Map className="w-5 h-5" />
            </div>
 <h3 className="font-koulen text-lg text-gray-800 mb-1">
              ទីតាំងផ្លូវការមិនទាន់បានកំណត់
            </h3>
 <p className="text-xs text-gray-500 leading-relaxed mb-4">
              អ្នកគ្រប់គ្រងវត្តមិនទាន់បានបញ្ចូលកូអរដោនេ GPS ផ្លូវការនៅឡើយទេ។ សូមទាក់ទងមកវត្ត ឬពិនិត្យព័ត៌មានផ្លូវបន្ថែម។
            </p>
 <div className="flex gap-2">
              <Link
                to="/contact"
                onClick={() => setShowMissingModal(false)}
 className="flex-1 py-2 px-3 rounded-xl bg-gray-600 text-white text-xs font-medium hover:bg-gray-700 transition"
              >
                មើលទំនាក់ទំនង
              </Link>
              <button
                type="button"
                onClick={() => setShowMissingModal(false)}
 className="py-2 px-4 rounded-xl bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition cursor-pointer border border-gray-200"
              >
                បិទ
              </button>
            </div>
          </div>
        </div>
      )}

 <div id="mobile-bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 font-battambang">
 <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
 className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition ${
                isActive ? 'text-gray-800 font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
 <Icon className="w-5 h-5" />
 <span className="text-[11px] mt-0.5">{tab.label}</span>
            </Link>
          );
        })}

        {/* Highlighted Direct Action on Mobile (Neutral 50% Gray, no pitch black) */}
        {hasCoords && latitude !== null && longitude !== null ? (
          <a
            href={getGoogleMapsNavigationUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavigateClick}
 className="flex flex-col items-center justify-center py-1 px-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium active:scale-95 transition"
          >
 <Navigation className="w-4 h-4 text-gray-200" />
 <span className="text-[11px] mt-0.5">ទៅវត្ត</span>
          </a>
        ) : (
          <Link
            to="/map"
 className="flex flex-col items-center justify-center py-1 px-3 rounded-xl bg-gray-100 text-gray-700 font-medium border border-gray-200"
          >
 <Map className="w-4 h-4 text-gray-500" />
 <span className="text-[11px] mt-0.5">មើលផែនទី</span>
          </Link>
        )}
      </div>
    </div>
    </>
  );
};
