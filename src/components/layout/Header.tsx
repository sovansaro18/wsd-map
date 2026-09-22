import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Lock } from 'lucide-react';

interface HeaderProps {
  templeNameKm: string;
  isVerified?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ templeNameKm }) => {
  const location = useLocation();

  const navItems = [
    { label: 'ទីតាំង', path: '/', icon: MapPin },
    { label: 'ទំនាក់ទំនង', path: '/contact', icon: Phone },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-gray-800 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 p-0.5 flex items-center justify-center shrink-0 border border-gray-200">
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
          <span className="font-koulen text-base sm:text-lg text-gray-800 tracking-wide leading-tight truncate">
            {templeNameKm}
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2 font-battambang text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/map');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-100 text-gray-800 font-bold border border-gray-300'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions (Admin Link) */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin"
            id="admin-portal-link"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition border border-gray-200"
            title="Admin"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
