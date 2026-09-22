import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Lock, Heart } from 'lucide-react';

interface FooterProps {
  templeNameKm: string;
}

export const Footer: React.FC<FooterProps> = ({ templeNameKm }) => {
  return (
    <footer id="app-footer" className="bg-white text-gray-600 pt-8 pb-24 md:pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center p-0.5 shrink-0">
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
            <div>
 <h3 className="font-koulen text-base text-gray-800">{templeNameKm}</h3>
 <p className="text-[11px] text-gray-500">គេហទំព័រផ្លូវការបង្ហាញទីតាំង និងទិសដៅធ្វើដំណើរ</p>
            </div>
          </div>

 <div className="flex flex-wrap gap-4 text-xs font-battambang">
 <Link to="/" className="text-gray-600 hover:text-gray-800 transition">ទំព័រដើម</Link>
 <Link to="/map" className="text-gray-600 hover:text-gray-800 transition">ផែនទី</Link>
 <Link to="/gallery" className="text-gray-600 hover:text-gray-800 transition">រូបភាពវត្ត</Link>
 <Link to="/contact" className="text-gray-600 hover:text-gray-800 transition">ទំនាក់ទំនង</Link>
 <Link to="/share" className="text-gray-600 hover:text-gray-800 transition">ចែករំលែក</Link>
 <Link to="/qr" className="text-gray-600 hover:text-gray-800 transition">QR កូដ</Link>
 <Link to="/admin" className="text-gray-500 hover:text-gray-800 transition flex items-center gap-1">
 <Lock className="w-3 h-3 text-gray-400" />
              <span>គ្រប់គ្រង (Admin)</span>
            </Link>
          </div>
        </div>

 <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 text-center sm:text-left font-battambang">
          <p>
            © {new Date().getFullYear()} {templeNameKm} — ផ្តល់ជូនព័ត៌មាន និងទីតាំង GPS ផ្លូវការ។
          </p>
 <div className="text-[11px] text-gray-400">
            <span>រចនាសាមញ្ញ ងាយស្រួលប្រើប្រាស់សម្រាប់ពុទ្ធបរិស័ទគ្រប់រូប</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
