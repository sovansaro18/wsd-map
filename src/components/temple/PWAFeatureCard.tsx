import React from 'react';
import { Smartphone, Zap, WifiOff, Navigation2, QrCode, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const PWAFeatureCard: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'បើកភ្លាមៗពី Home Screen',
      desc: 'ដាក់លើអេក្រង់ដើមទូរស័ព្ទ បើកមើលកូអរដោនេ និងទិសដៅបានលឿនរហ័ស។',
    },
    {
      icon: WifiOff,
      title: 'ដំណើរការទោះបីគ្មានអ៊ីនធឺណិត',
      desc: 'រក្សាទុកទិន្នន័យក្នុង Cache អាចមើលកូអរដោនេ និងទីតាំងវត្តទោះបីដាច់សេវា។',
    },
    {
      icon: Navigation2,
      title: 'រុករកទិសដៅផ្ទាល់',
      desc: 'ភ្ជាប់ដោយផ្ទាល់ទៅកាន់ Google Maps ដោយមិនចាំបាច់វាយឈ្មោះ ឬស្វែងរកឡើងវិញ។',
    },
  ];

  return (
    <section
      id="pwa-feature-section"
      className="bg-stone-900 text-white rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/80 p-1 shadow-sm border border-amber-600/40 flex items-center justify-center shrink-0 overflow-hidden">
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
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-stone-800 text-amber-300 text-[11px] font-semibold mb-1 border border-stone-700">
              <Smartphone className="w-3 h-3" />
              <span>កម្មវិធីទូរស័ព្ទ (PWA Web App)</span>
            </div>
            <h2 className="font-koulen text-xl sm:text-2xl text-amber-100 tracking-wide">
              ដំឡើងកម្មវិធីវត្តវារីបាការាមលើទូរស័ព្ទ
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-battambang mt-0.5 max-w-xl">
              ដំឡើងកម្មវិធីដោយផ្ទាល់នៅលើ iPhone ឬ Android របស់អ្នក ងាយស្រួលរក្សាទុក និងបើកទិសដៅធ្វើដំណើរគ្រប់ពេលវេលា។
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <PWAInstallButton variant="card" label="ដំឡើង App លើទូរស័ព្ទ" />
          <Link
            to="/qr"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2.5 text-sm font-semibold border border-stone-700 transition"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>ស្កេន QR</span>
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 bg-stone-800/60 border border-stone-700/60 rounded-xl p-4"
            >
              <div className="p-2 rounded-lg bg-stone-900 text-amber-300 border border-stone-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-amber-200 font-battambang">
                  {b.title}
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick assurance */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-400 border-t border-stone-800 pt-4 font-battambang">
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" /> ឥតគិតថ្លៃ ១០០%
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" /> មិនចាំបាច់មានគណនី App Store / Play Store
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" /> ធ្វើបច្ចុប្បន្នភាពទិន្នន័យដោយស្វ័យប្រវត្តិ
        </span>
      </div>
    </section>
  );
};
