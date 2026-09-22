import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Printer, ExternalLink } from 'lucide-react';
import { TempleSettings } from '../../types/temple';

interface QRCodeCardProps {
  settings: TempleSettings;
  standalonePage?: boolean;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ settings, standalonePage = false }) => {
  const qrWrapperRef = useRef<HTMLDivElement>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wsd-location.app';

  const handleDownloadQR = () => {
    if (!qrWrapperRef.current) return;
    const svgElement = qrWrapperRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      if (ctx) {
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 40, 40, 520, 520);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `QR-Code-${settings.short_name || 'WSD-Location'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="qr-code-section"
 className={`bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 font-battambang ${
        standalonePage ? 'max-w-xl mx-auto' : ''
      }`}
    >
 <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <QrCode className="w-5 h-5" />
        </div>
        <div>
 <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide leading-tight">
            QR Code ទីតាំងវត្ត
          </h2>
 <p className="text-xs text-gray-500 mt-0.5">
            សម្រាប់ស្កេនបើកផែនទី ឬបោះពុម្ពលើបដា និងសំបុត្របុណ្យ
          </p>
        </div>
      </div>

 <div className="flex flex-col items-center justify-center text-center">
        {/* Printable/Display Frame */}
        <div
          id="printable-qr-card"
          ref={qrWrapperRef}
 className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 max-w-sm w-full"
        >
 <div className="mb-3">
 <h3 className="font-koulen text-lg text-gray-800 leading-tight">
              {settings.temple_name_km}
            </h3>
 <span className="text-[11px] text-gray-500 block uppercase tracking-wider mt-0.5 font-battambang">
              ស្កេនដើម្បីបើកផែនទី និងទិសដៅធ្វើដំណើរ
            </span>
          </div>

 <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 inline-block">
            <QRCodeSVG
              value={currentUrl}
              size={190}
              level="H"
              includeMargin={false}
              fgColor="#374151"
              imageSettings={{
                src: '/Logo.png',
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

 <div className="mt-3 text-xs text-gray-500 font-battambang">
            <span>គេហទំព័រផ្លូវការបង្ហាញទីតាំងវត្ត</span>
          </div>
        </div>

        {/* Action Controls */}
 <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-sm">
          <button
            id="download-qr-btn"
            type="button"
            onClick={handleDownloadQR}
 className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-medium text-xs sm:text-sm transition active:scale-95 cursor-pointer min-h-[42px] whitespace-nowrap"
          >
 <Download className="w-4 h-4 text-gray-200" />
            <span>ទាញយករូប QR</span>
          </button>

          <button
            id="print-qr-btn"
            type="button"
            onClick={handlePrint}
 className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-medium text-xs sm:text-sm border border-gray-300 transition active:scale-95 cursor-pointer min-h-[42px]"
          >
 <Printer className="w-4 h-4 text-gray-500" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>
    </section>
  );
};
