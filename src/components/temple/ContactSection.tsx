import React from 'react';
import { TempleSettings } from '../../types/temple';
import { Phone, Send, Facebook, MessageCircle, HelpCircle } from 'lucide-react';

interface ContactSectionProps {
  settings: TempleSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const hasPhone = Boolean(settings.phone && settings.phone.trim());
  const hasTelegram = Boolean(settings.telegram_url && settings.telegram_url.trim());
  const hasFacebook = Boolean(settings.facebook_url && settings.facebook_url.trim());

  const hasAnyContact = hasPhone || hasTelegram || hasFacebook;

  return (
    <section id="contact-section" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
      <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
            ទំនាក់ទំនងវត្ត
          </h2>
          <p className="text-xs text-stone-500">
            ក្នុងករណីលោកអ្នកមានការលំបាករកទីតាំង ឬត្រូវការសាកសួរព័ត៌មានបន្ថែម
          </p>
        </div>
      </div>

      {!hasAnyContact ? (
        <div className="text-center py-6 text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
          មិនទាន់មានព័ត៌មានទំនាក់ទំនងលម្អិតនៅឡើយទេ (អាចបន្ថែមតាមរយៈផ្ទាំង Admin)
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Phone Contact */}
          {hasPhone && (
            <a
              id="call-temple-btn"
              href={`tel:${settings.phone}`}
              className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow-sm transition active:scale-98 min-h-[48px]"
            >
              <Phone className="w-5 h-5 text-amber-200" />
              <div className="text-left">
                <span className="block text-xs text-amber-200 font-normal">ទូរស័ព្ទទៅវត្ត</span>
                <span className="font-bold">{settings.phone}</span>
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
              className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition active:scale-98 min-h-[48px]"
            >
              <Send className="w-5 h-5 text-sky-200" />
              <div className="text-left">
                <span className="block text-xs text-sky-200 font-normal">ទាក់ទងតាម</span>
                <span className="font-bold">Telegram វត្ត</span>
              </div>
            </a>
          )}

          {/* Facebook Contact */}
          {hasFacebook && (
            <a
              id="facebook-temple-btn"
              href={settings.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 p-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm transition active:scale-98 min-h-[48px]"
            >
              <Facebook className="w-5 h-5 text-blue-200" />
              <div className="text-left">
                <span className="block text-xs text-blue-200 font-normal">ទំព័រផ្លូវការ</span>
                <span className="font-bold">ចូល Facebook</span>
              </div>
            </a>
          )}
        </div>
      )}

      {/* Advice note */}
      <div className="mt-5 p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-2.5 text-xs text-stone-700">
        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          ចំណាំ៖ ប្រសិនបើលោកអ្នកធ្វើដំណើរជិតដល់ហើយមិនប្រាកដផ្លូវ សូមទំនាក់ទំនងមកកាន់លេខទូរស័ព្ទ ឬ Telegram របស់វត្ត ដើម្បីឱ្យព្រះសង្ឃ ឬគណៈកម្មការវត្តជួយណែនាំផ្លូវ។
        </span>
      </div>
    </section>
  );
};
