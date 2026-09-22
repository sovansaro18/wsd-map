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
 <section id="contact-section" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 font-battambang">
 <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <Phone className="w-5 h-5" />
        </div>
        <div>
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
            ទំនាក់ទំនងវត្ត
          </h2>
 <p className="text-xs text-gray-500">
            ក្នុងករណីលោកអ្នកមានការលំបាករកទីតាំង ឬត្រូវការសាកសួរព័ត៌មានបន្ថែម
          </p>
        </div>
      </div>

      {!hasAnyContact ? (
 <div className="text-center py-6 text-gray-400 text-xs italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
          មិនទាន់មានព័ត៌មានទំនាក់ទំនងលម្អិតនៅឡើយទេ (អាចបន្ថែមតាមរយៈផ្ទាំង Admin)
        </div>
      ) : (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Phone Contact (Neutral Gray 50%) */}
          {hasPhone && (
            <a
              id="call-temple-btn"
              href={`tel:${settings.phone}`}
 className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium text-xs sm:text-sm transition active:scale-98 min-h-[44px]"
            >
 <Phone className="w-4 h-4 text-gray-200" />
 <div className="text-left">
 <span className="block text-[11px] text-gray-200">ទូរស័ព្ទទៅវត្ត</span>
 <span className="font-semibold text-xs sm:text-sm">{settings.phone}</span>
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
 className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition active:scale-98 min-h-[44px]"
            >
 <Send className="w-4 h-4 text-gray-500" />
 <div className="text-left">
 <span className="block text-[11px] text-gray-400">ទាក់ទងតាម</span>
 <span className="font-semibold text-xs sm:text-sm">Telegram វត្ត</span>
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
 className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition active:scale-98 min-h-[44px]"
            >
 <Facebook className="w-4 h-4 text-gray-500" />
 <div className="text-left">
 <span className="block text-[11px] text-gray-400">ទំព័រផ្លូវការ</span>
 <span className="font-semibold text-xs sm:text-sm">Facebook វត្ត</span>
              </div>
            </a>
          )}
        </div>
      )}

      {/* Advice note */}
 <div className="mt-5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-2.5 text-xs text-gray-600">
 <HelpCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <span>
          ចំណាំ៖ ប្រសិនបើលោកអ្នកធ្វើដំណើរជិតដល់ហើយមិនប្រាកដផ្លូវ សូមទំនាក់ទំនងមកកាន់លេខទូរស័ព្ទ ឬ Telegram របស់វត្ត ដើម្បីឱ្យព្រះសង្ឃ ឬគណៈកម្មការវត្តជួយណែនាំផ្លូវ។
        </span>
      </div>
    </section>
  );
};
