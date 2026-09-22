import React from 'react';
import { X, Share, PlusSquare, MoreVertical, Monitor, Download, CheckCircle2, Smartphone } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'ios' | 'android' | 'desktop';
  isInstallable: boolean;
  onDirectInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  platform,
  isInstallable,
  onDirectInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="pwa-install-modal-backdrop"
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="pwa-install-modal-container"
 className="w-full max-w-md rounded-2xl bg-white p-6 border border-gray-200 text-gray-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Temple App Icon */}
 <div className="flex items-start justify-between border-b border-gray-100 pb-4">
 <div className="flex items-center gap-3">
 <div className="w-11 h-11 rounded-xl bg-gray-100 p-1 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
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
 <h3 className="font-koulen text-lg text-gray-800 leading-tight">
                ដំឡើងកម្មវិធីវត្តវារីបាការាម (Web App)
              </h3>
 <p className="text-xs text-gray-500 font-battambang mt-0.5">
                រក្សាទុកលើអេក្រង់ទូរស័ព្ទ ប្រើប្រាស់បានលឿន និងទោះបីគ្មានអ៊ីនធឺណិត
              </p>
            </div>
          </div>
          <button
            id="pwa-modal-close-btn"
            onClick={onClose}
 className="rounded-lg p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            aria-label="បិទ"
          >
 <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Direct Install (if browser supports it directly) */}
        {isInstallable ? (
 <div className="py-4 space-y-3">
 <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1 font-battambang">
 <div className="flex items-center gap-2 font-medium text-gray-800 text-sm">
 <CheckCircle2 className="w-4 h-4 text-gray-700" />
                <span>ឧបករណ៍របស់អ្នកគាំទ្រការដំឡើងភ្លាមៗ!</span>
              </div>
 <p className="text-gray-500 leading-relaxed">
                ចុចប៊ូតុងខាងក្រោមដើម្បីដាក់រូបតំណាងវត្តវារីបាការាម (ស្នាយដួច) នៅលើផ្ទាំងដើម (Home Screen) នៃទូរស័ព្ទរបស់អ្នក។
              </p>
            </div>

            <button
              id="modal-direct-install-btn"
              onClick={async () => {
                const ok = await onDirectInstall();
                if (ok) onClose();
              }}
 className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 active:scale-98 text-white py-3 px-4 font-medium text-xs sm:text-sm transition cursor-pointer"
            >
 <Download className="w-4 h-4 text-gray-200" />
              <span>ដំឡើងលើអេក្រង់ដើមឥឡូវនេះ (Install)</span>
            </button>
          </div>
        ) : (
          /* Step-by-Step Guidance for iOS, Android, or Desktop */
 <div className="py-4 space-y-3">
            {platform === 'ios' ? (
              <>
 <div className="flex items-center gap-2 text-xs font-medium text-gray-600 font-battambang">
 <Smartphone className="w-3.5 h-3.5 text-gray-600" />
                  <span>ការណែនាំសម្រាប់ Apple Safari (iOS / iPadOS)</span>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <Share className="w-4 h-4" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ជំហានទី ១</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      ចុចប៊ូតុង <strong>Share (ចែករំលែក)</strong> នៅលើរបារឧបករណ៍ខាងក្រោមនៃកម្មវិធី Safari។
                    </p>
                  </div>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <PlusSquare className="w-4 h-4" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ជំហានទី ២</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      អូសចុះក្រោម រួចចុចយក <strong>&quot;Add to Home Screen&quot; (បន្ថែមទៅអេក្រង់ដើម)</strong>។
                    </p>
                  </div>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <CheckCircle2 className="w-4 h-4 text-gray-700" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ជំហានទី ៣</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      ចុច <strong>&quot;Add&quot; (បន្ថែម)</strong> នៅជ្រុងខាងស្តាំខាងលើដើម្បីបញ្ចប់។
                    </p>
                  </div>
                </div>
              </>
            ) : platform === 'android' ? (
              <>
 <div className="flex items-center gap-2 text-xs font-medium text-gray-600 font-battambang">
 <Smartphone className="w-3.5 h-3.5 text-gray-600" />
                  <span>ការណែនាំសម្រាប់ Android (Chrome / Edge)</span>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <MoreVertical className="w-4 h-4" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ជំហានទី ១</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      ចុចសញ្ញាចុចបី <strong>(⋮)</strong> នៅជ្រុងខាងលើផ្នែកខាងស្តាំនៃកម្មវិធី Google Chrome។
                    </p>
                  </div>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <Download className="w-4 h-4" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ជំហានទី ២</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      ជ្រើសរើសយក <strong>&quot;Install app&quot; (ដំឡើងកម្មវិធី)</strong> ឬ <strong>&quot;Add to Home screen&quot;</strong>។
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
 <div className="flex items-center gap-2 text-xs font-medium text-gray-600 font-battambang">
 <Monitor className="w-3.5 h-3.5 text-gray-600" />
                  <span>ការណែនាំសម្រាប់ Desktop (Chrome / Edge)</span>
                </div>

 <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
 <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 shrink-0">
 <Download className="w-4 h-4" />
                  </div>
 <div className="text-xs font-battambang">
 <p className="font-medium text-gray-800">ដំឡើងពី Address Bar</p>
 <p className="text-gray-500 mt-0.5 leading-relaxed">
                      ក្រឡេកមើលខាងស្តាំនៃរបារអាសយដ្ឋាន URL (Address Bar) រួចចុចលើរូបសញ្ញាដំឡើង <strong>(Install icon ⊕)</strong> ដើម្បីដំឡើងជាកម្មវិធីកុំព្យូទ័រ។
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Benefits summary footer */}
 <div className="border-t border-gray-100 pt-3 text-[11px] text-gray-500 flex items-center justify-between font-battambang">
          <span>✓ ឥតគិតថ្លៃ</span>
          <span>✓ ដំណើរការ Offline</span>
          <span>✓ មិនអស់ទំហំទូរស័ព្ទ</span>
        </div>

        <button
          id="pwa-modal-understood-btn"
          onClick={onClose}
 className="mt-4 w-full rounded-xl bg-gray-100 hover:bg-gray-200 py-2.5 text-xs font-medium text-gray-800 transition cursor-pointer font-battambang"
        >
          យល់ព្រម
        </button>
      </div>
    </div>
  );
};
