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
    { label: 'ស្គាល់វត្ត (រូបភាព)', path: '/gallery', icon: Image },
    { label: 'ទំនាក់ទំនង', path: '/contact', icon: Phone },
    { label: 'ចែករំលែក', path: '/share', icon: Share2 },
    { label: 'QR កូដ', path: '/qr', icon: QrCode },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-stone-900/95 text-stone-100 backdrop-blur-md border-b border-amber-800/40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 flex items-center justify-center group-hover:scale-105 transition shrink-0">
            <img
              src="/Logo.png"
              alt="Wat Snay Douch Logo"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/icon.svg';
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-koulen text-base sm:text-lg text-amber-200 tracking-wide leading-tight line-clamp-1">
                {templeNameKm}
              </span>
              {isVerified && (
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  ផ្លូវការ
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-400 leading-none">WSD Official Location</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  isActive
                    ? 'bg-amber-800 text-amber-100 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Actions (PWA + Admin) */}
        <div className="flex items-center gap-2">
          <PWAInstallButton variant="header" />
          <Link
            to="/admin"
            id="header-admin-link"
            className="flex items-center gap-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1.5 text-xs transition border border-stone-700/70"
            title="គ្រប់គ្រងទិន្នន័យ (Admin)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
