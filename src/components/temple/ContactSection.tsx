import React from 'react';
import { TempleSettings } from '../../types/temple';
import { Phone, Send, Facebook } from 'lucide-react';

interface ContactSectionProps {
  settings: TempleSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const hasPhone = Boolean(settings.phone && settings.phone.trim());
  const hasTelegram = Boolean(settings.telegram_url && settings.telegram_url.trim());
  const hasFacebookPage = Boolean(settings.facebook_url && settings.facebook_url.trim());
  const hasFacebookPersonal = Boolean(settings.facebook_personal_url && settings.facebook_personal_url.trim());

  const hasAnyContact = hasPhone || hasTelegram || hasFacebookPage || hasFacebookPersonal;

  if (!hasAnyContact) {
    return null;
  }

  return (
    <section id="contact-section" className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 font-battambang">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
          <Phone className="w-5 h-5" />
        </div>
        <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
          ទំនាក់ទំនង
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Phone Contact */}
        {hasPhone && (
          <a
            id="call-temple-btn"
            href={`tel:${settings.phone}`}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 min-h-[48px]"
          >
            <Phone className="w-4 h-4 text-gray-200 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] text-gray-200">ទូរស័ព្ទ</span>
              <span className="font-rajdhani font-semibold tracking-wider text-sm sm:text-base">{settings.phone}</span>
            </div>
          </a>
        )}

        {/* Telegram Contact */}
        {hasTelegram && (
          <a
            id="telegram-temple-btn"
            href={settings.telegram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 min-h-[48px]"
          >
            <Send className="w-4 h-4 text-gray-500 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] text-gray-400">ឆាតតាម</span>
              <span className="font-semibold text-xs sm:text-sm">Telegram</span>
            </div>
          </a>
        )}

        {/* Facebook Page Contact */}
        {hasFacebookPage && (
          <a
            id="facebook-page-btn"
            href={settings.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 min-h-[48px]"
          >
            <Facebook className="w-4 h-4 text-gray-500 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] text-gray-400">ទំព័រផ្លូវការ</span>
              <span className="font-semibold text-xs sm:text-sm">Facebook វត្ត</span>
            </div>
          </a>
        )}

        {/* Facebook Personal Profile Contact */}
        {hasFacebookPersonal && (
          <a
            id="facebook-personal-btn"
            href={settings.facebook_personal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 min-h-[48px]"
          >
            <Facebook className="w-4 h-4 text-gray-500 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] text-gray-400">អ្នកគ្រប់គ្រង</span>
              <span className="font-semibold text-xs sm:text-sm">Facebook ផ្ទាល់ខ្លួន</span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
};
