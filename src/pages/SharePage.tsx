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
    <div id="share-page" className="space-y-6 py-4 w-full font-battambang">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-koulen text-2xl sm:text-3xl text-gray-800 tracking-wide">
              ចែករំលែកទីតាំងវត្ត
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-battambang">
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
