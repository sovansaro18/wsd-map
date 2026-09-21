import React from 'react';
import { TempleSettings } from '../types/temple';
import { ShareLocationCard } from '../components/temple/ShareLocationCard';
import { QRCodeCard } from '../components/temple/QRCodeCard';
import { Share2 } from 'lucide-react';

interface SharePageProps {
  settings: TempleSettings;
}

export const SharePage: React.FC<SharePageProps> = ({ settings }) => {
  return (
    <div id="share-page" className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-koulen text-2xl sm:text-3xl text-stone-900 tracking-wide">
              ចែករំលែកទីតាំងវត្ត
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-battambang">
              ផ្ញើតំណភ្ជាប់ទីតាំងពិតប្រាកដ ឬ QR Code ទៅកាន់ពុទ្ធបរិស័ទដទៃទៀត
            </p>
          </div>
        </div>
      </div>

      <ShareLocationCard settings={settings} />

      <QRCodeCard settings={settings} />
    </div>
  );
};
