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
      className={`bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 ${
        standalonePage ? 'max-w-xl mx-auto' : ''
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
            QR Code ទីតាំងវត្ត (សម្រាប់ស្កេន និងបោះពុម្ព)
          </h2>
          <p className="text-xs text-stone-500">
            សម្រាប់បោះពុម្ពលើបដា សំបុត្របុណ្យ ឬផ្សព្វផ្សាយលើបណ្តាញសង្គម
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        {/* Printable/Display Frame */}
        <div
          id="printable-qr-card"
          ref={qrWrapperRef}
          className="p-6 rounded-2xl bg-white border-2 border-amber-800/30 shadow-sm max-w-sm w-full"
        >
          <div className="mb-3">
            <h3 className="font-koulen text-lg text-amber-900 leading-tight">
              {settings.temple_name_km}
            </h3>
            <span className="text-[11px] text-stone-500 block uppercase tracking-wider mt-0.5">
              ស្កេនដើម្បីបើកផែនទី និងទិសដៅធ្វើដំណើរ
            </span>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 inline-block shadow-inner">
            <QRCodeSVG
              value={currentUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#78350f"
              imageSettings={{
                src: '/Logo.png',
                x: undefined,
                y: undefined,
                height: 42,
                width: 42,
                excavate: true,
              }}
            />
          </div>

          <div className="mt-3 text-xs text-stone-600 font-medium">
            <span>គេហទំព័រផ្លូវការបង្ហាញទីតាំងវត្ត</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
          <button
            id="download-qr-btn"
            type="button"
            onClick={handleDownloadQR}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer min-h-[42px]"
          >
            <Download className="w-4 h-4 text-amber-200" />
            <span>ទាញយករូប QR Code</span>
          </button>

          <button
            id="print-qr-btn"
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm border border-stone-300 transition active:scale-95 cursor-pointer min-h-[42px]"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>បោះពុម្ព (Print)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
