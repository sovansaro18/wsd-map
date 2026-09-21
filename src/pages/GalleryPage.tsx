import React from 'react';
import { GalleryPhoto, TempleSettings } from '../types/temple';
import { VisualGallery } from '../components/temple/VisualGallery';
import { Image, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryPageProps {
  gallery: GalleryPhoto[];
  settings: TempleSettings;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, settings }) => {
  return (
    <div id="gallery-page" className="space-y-6 py-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <Image className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-koulen text-2xl sm:text-3xl text-stone-900 tracking-wide">
              ស្គាល់វត្តបានងាយ (រូបភាពសម្គាល់)
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-battambang">
              រូបភាពក្លោងទ្វារ តួព្រះវិហារ ផ្លូវចូល និងទីតាំងសម្គាល់នៃ {settings.temple_name_km}
            </p>
          </div>
        </div>
      </div>

      <VisualGallery photos={gallery} />

      <div className="text-center p-6 bg-amber-50/70 rounded-2xl border border-amber-200/70">
        <p className="text-sm text-stone-700 font-battambang mb-3">
          ចង់ពិនិត្យមើលទីតាំងលើផែនទី ឬចាប់ផ្តើមការធ្វើដំណើរ?
        </p>
        <Link
          to="/map"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow transition"
        >
          <MapPin className="w-4 h-4 text-amber-200" />
          <span>មើលទីតាំងលើផែនទី</span>
        </Link>
      </div>
    </div>
  );
};
