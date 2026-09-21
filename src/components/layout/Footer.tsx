import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Lock, Heart } from 'lucide-react';

interface FooterProps {
  templeNameKm: string;
}

export const Footer: React.FC<FooterProps> = ({ templeNameKm }) => {
  return (
    <footer id="app-footer" className="bg-stone-900 text-stone-300 pt-10 pb-24 md:pb-12 border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img
                src="/Logo.png"
                alt="WSD Logo"
                className="w-full h-full object-contain drop-shadow"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <h3 className="font-koulen text-lg text-amber-200">{templeNameKm}</h3>
              <p className="text-xs text-stone-400">គេហទំព័រផ្លូវការបង្ហាញទីតាំង និងទិសដៅធ្វើដំណើរ</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <Link to="/" className="text-stone-300 hover:text-amber-300 transition">ទំព័រដើម</Link>
            <Link to="/map" className="text-stone-300 hover:text-amber-300 transition">ផែនទី</Link>
            <Link to="/gallery" className="text-stone-300 hover:text-amber-300 transition">រូបភាពសម្គាល់</Link>
            <Link to="/contact" className="text-stone-300 hover:text-amber-300 transition">ទំនាក់ទំនង</Link>
            <Link to="/share" className="text-stone-300 hover:text-amber-300 transition">ចែករំលែក</Link>
            <Link to="/qr" className="text-stone-300 hover:text-amber-300 transition">QR Code</Link>
            <Link to="/admin" className="text-amber-400/80 hover:text-amber-300 transition flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>ផ្ទាំងគ្រប់គ្រង (Admin)</span>
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {templeNameKm} — ផ្តល់ជូនព័ត៌មាន និងទីតាំង GPS ផ្លូវការ។
          </p>
          <div className="flex items-center gap-1 text-[11px] text-stone-400">
            <span>បង្កើតឡើងដើម្បីសម្រួលដល់ពុទ្ធបរិស័ទជិតឆ្ងាយ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
