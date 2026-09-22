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
    <div id="gallery-page" className="space-y-6 py-4 w-full font-battambang">
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7">
 <div className="flex items-center gap-3 mb-2">
 <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
 <Image className="w-5 h-5" />
          </div>
          <div>
 <h1 className="font-koulen text-2xl sm:text-3xl text-gray-800 tracking-wide">
              ស្គាល់វត្តបានងាយ (រូបភាពសម្គាល់)
            </h1>
 <p className="text-xs sm:text-sm text-gray-500 font-battambang">
              រូបភាពក្លោងទ្វារ តួព្រះវិហារ ផ្លូវចូល និងទីតាំងសម្គាល់នៃ {settings.temple_name_km}
            </p>
          </div>
        </div>
      </div>

      <VisualGallery photos={gallery} />

 <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
 <p className="text-xs sm:text-sm text-gray-600 font-battambang mb-3">
          ចង់ពិនិត្យមើលទីតាំងលើផែនទី ឬចាប់ផ្តើមការធ្វើដំណើរ?
        </p>
        <Link
          to="/map"
 className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 active:scale-98 text-white font-medium text-xs sm:text-sm transition"
        >
 <MapPin className="w-4 h-4 text-gray-200" />
          <span>មើលទីតាំងលើផែនទី</span>
        </Link>
      </div>
    </div>
  );
};
