import React from 'react';
import { TempleSettings } from '../types/temple';
import { QRCodeCard } from '../components/temple/QRCodeCard';
import { QrCode, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QRPageProps {
  settings: TempleSettings;
}

export const QRPage: React.FC<QRPageProps> = ({ settings }) => {
  return (
    <div id="qr-page" className="space-y-6 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ត្រឡប់ទៅទំព័រដើម</span>
        </Link>
      </div>

      <QRCodeCard settings={settings} standalonePage={true} />

      <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-600 max-w-xl mx-auto text-center space-y-1">
        <p className="font-semibold text-stone-800">ការណែនាំសម្រាប់ការបោះពុម្ព៖</p>
        <p>លោកអ្នកអាចទាញយករូបភាព PNG ឬចុចប៊ូតុង &quot;បោះពុម្ព&quot; ដើម្បីបិតលើកាតអញ្ជើញ ឬស្លាកសញ្ញាណែនាំផ្លូវ។</p>
      </div>
    </div>
  );
};
