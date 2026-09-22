import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Navigation, Image, Phone, QrCode, Lock, Share2 } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface HeaderProps {
  templeNameKm: string;
  isVerified: boolean;
}

export const Header: React.FC<HeaderProps> = ({ templeNameKm, isVerified }) => {
  const location = useLocation();

  const navItems = [
    { label: 'ទំព័រដើម', path: '/', icon: MapPin },
    { label: 'ផែនទី', path: '/map', icon: Navigation },
    { label: 'រូបភាពវត្ត', path: '/gallery', icon: Image },
    { label: 'ទំនាក់ទំនង', path: '/contact', icon: Phone },
    { label: 'ចែករំលែក', path: '/share', icon: Share2 },
    { label: 'QR កូដ', path: '/qr', icon: QrCode },
  ];

  return (
 <header id="app-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-gray-800 border-b border-gray-200">
 <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
 <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial group">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 p-0.5 flex items-center justify-center group-hover:scale-105 transition shrink-0 border border-gray-200">
            <img
              src="/Logo.png"
              alt="Wat Snay Douch Logo"
 className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/icon.svg';
              }}
            />
          </div>
 <div className="flex flex-col min-w-0">
 <div className="flex items-center gap-1.5 min-w-0">
 <span className="font-koulen text-xs sm:text-base lg:text-lg text-gray-800 tracking-wide leading-tight truncate">
                {templeNameKm}
              </span>
              {isVerified && (
 <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                  ផ្លូវការ
                </span>
              )}
            </div>
 <span className="text-[10px] text-gray-400 leading-none truncate">
              WSD Official Location
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with clean spacing and minimal neutral style */}
 <nav className="hidden lg:flex items-center gap-1 font-battambang text-xs xl:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-100 text-gray-800 font-bold border border-gray-300 '
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
 <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
 <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions (PWA Install + Admin Link) */}
 <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton variant="header" />
          <Link
            to="/admin"
            id="header-admin-link"
 className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 px-2.5 sm:px-3 py-1.5 text-xs font-medium transition border border-gray-300 whitespace-nowrap min-h-[34px]"
            title="គ្រប់គ្រងទិន្នន័យវត្ត (Admin)"
          >
 <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
 <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
