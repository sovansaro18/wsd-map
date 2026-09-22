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
 className="bg-white text-gray-800 rounded-2xl p-6 sm:p-7 border border-gray-200 font-battambang"
    >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
 <div className="flex items-start gap-4">
 <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
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
 <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium mb-1 border border-gray-200">
 <Smartphone className="w-3 h-3 text-gray-500" />
              <span>កម្មវិធីទូរស័ព្ទ (PWA Web App)</span>
            </div>
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
              ដំឡើងកម្មវិធីវត្តវារីបាការាមលើទូរស័ព្ទ
            </h2>
 <p className="text-xs sm:text-sm text-gray-500 font-battambang mt-0.5 max-w-xl">
              ដំឡើងកម្មវិធីដោយផ្ទាល់នៅលើ iPhone ឬ Android របស់អ្នក ងាយស្រួលរក្សាទុក និងបើកទិសដៅធ្វើដំណើរគ្រប់ពេលវេលា។
            </p>
          </div>
        </div>

 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <PWAInstallButton variant="card" label="ដំឡើង App លើទូរស័ព្ទ" />
          <Link
            to="/qr"
 className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-xs sm:text-sm font-medium border border-gray-300 transition"
          >
 <QrCode className="w-4 h-4 text-gray-500" />
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
 className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
 <div className="p-2 rounded-lg bg-white text-gray-600 border border-gray-200 shrink-0">
 <Icon className="w-4 h-4" />
              </div>
              <div>
 <h3 className="font-semibold text-xs sm:text-sm text-gray-800 font-battambang">
                  {b.title}
                </h3>
 <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick assurance */}
 <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500 border-t border-gray-100 pt-4 font-battambang">
 <span className="inline-flex items-center gap-1.5">
 <Check className="w-3.5 h-3.5 text-gray-600" /> ឥតគិតថ្លៃ ១០០%
        </span>
 <span className="inline-flex items-center gap-1.5">
 <Check className="w-3.5 h-3.5 text-gray-600" /> មិនចាំបាច់មានគណនី App Store / Play Store
        </span>
 <span className="inline-flex items-center gap-1.5">
 <Check className="w-3.5 h-3.5 text-gray-600" /> ធ្វើបច្ចុប្បន្នភាពទិន្នន័យដោយស្វ័យប្រវត្តិ
        </span>
      </div>
    </section>
  );
};
