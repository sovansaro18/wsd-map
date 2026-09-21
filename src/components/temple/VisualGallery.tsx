import React, { useState } from 'react';
import { GalleryPhoto } from '../../types/temple';
import { Image as ImageIcon, Eye, X, ZoomIn } from 'lucide-react';

interface VisualGalleryProps {
  photos: GalleryPhoto[];
  title?: string;
  subtitle?: string;
}

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  photos,
  title = 'ស្គាល់វត្តបានងាយ (រូបភាពសម្គាល់)',
  subtitle = 'រូបភាពក្លោងទ្វារ តួព្រះវិហារ និងចំណុចសម្គាល់ ដើម្បីងាយស្រួលចំណាំពេលទៅដល់',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'ទាំងអស់' },
    { key: 'gate', label: 'ក្លោងទ្វារវត្ត' },
    { key: 'building', label: 'ព្រះវិហារ/កុដិ' },
    { key: 'entrance', label: 'ផ្លូវចូល' },
    { key: 'landmark', label: 'ចំណុចសម្គាល់' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const getCategoryBadgeLabel = (cat: string) => {
    switch (cat) {
      case 'gate':
        return 'ក្លោងទ្វារ';
      case 'building':
        return 'ព្រះវិហារ';
      case 'entrance':
        return 'ផ្លូវចូល';
      case 'landmark':
        return 'ចំណុចសម្គាល់';
      default:
        return 'ទិដ្ឋភាពវត្ត';
    }
  };

  return (
    <section id="visual-gallery-section" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
              {title}
            </h2>
            <p className="text-xs text-stone-500">{subtitle}</p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-amber-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-10 text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
          មិនទាន់មានរូបភាពនៅក្នុងប្រភេទនេះនៅឡើយទេ
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <div className="aspect-video sm:aspect-4/3 w-full overflow-hidden bg-stone-200">
                <img
                  src={photo.image_url}
                  alt={photo.title_km}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Badges and Overlay */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-900/80 text-amber-200 backdrop-blur-xs">
                  {getCategoryBadgeLabel(photo.category)}
                </span>
              </div>

              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-2 rounded-full bg-white/90 text-stone-900 shadow">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3 bg-white">
                <h3 className="font-semibold text-stone-900 text-xs sm:text-sm font-battambang line-clamp-1">
                  {photo.title_km}
                </h3>
                {photo.description_km && (
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-battambang">
                    {photo.description_km}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {selectedPhoto && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="close-lightbox-btn"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title_km}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80';
                }}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 sm:p-5 bg-stone-900 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-800 text-amber-100">
                  {getCategoryBadgeLabel(selectedPhoto.category)}
                </span>
                <h3 className="font-bold text-base sm:text-lg text-amber-200 font-battambang">
                  {selectedPhoto.title_km}
                </h3>
              </div>
              {selectedPhoto.description_km && (
                <p className="text-xs sm:text-sm text-stone-300 font-battambang leading-relaxed">
                  {selectedPhoto.description_km}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
