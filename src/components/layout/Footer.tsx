import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  templeNameKm: string;
}

export const Footer: React.FC<FooterProps> = ({ templeNameKm }) => {
  return (
    <footer id="app-footer" className="bg-white text-gray-600 pt-6 pb-24 md:pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center p-0.5 shrink-0">
              <img
                src="/Logo.png"
                alt="WSD Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/icon.svg';
                }}
              />
            </div>
            <h3 className="font-koulen text-base text-gray-800">{templeNameKm}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-battambang">
            <Link to="/" className="text-gray-700 hover:text-gray-900 transition flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>ទីតាំង</span>
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 transition flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>ទំនាក់ទំនង</span>
            </Link>
            <Link to="/admin" className="text-gray-400 hover:text-gray-700 transition flex items-center gap-1">
              <Lock className="w-3 h-3 text-gray-400" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 text-center sm:text-left font-battambang">
          <p>© {new Date().getFullYear()} {templeNameKm}</p>
        </div>
      </div>
    </footer>
  );
};
