import React from 'react';
import { TempleSettings } from '../../types/temple';
import { Car } from 'lucide-react';

interface EntranceRoadInfoProps {
  settings: TempleSettings;
}

export const EntranceRoadInfo: React.FC<EntranceRoadInfoProps> = ({ settings }) => {
  const hasRoadCondition = Boolean(settings.road_condition_km && settings.road_condition_km.trim());
  const hasParking = Boolean(settings.parking_note_km && settings.parking_note_km.trim());

  // Show only if at least one of the 2 items is present
  if (!hasRoadCondition && !hasParking) {
    return null;
  }

  return (
    <section id="entrance-road-info-section" className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 font-battambang">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 border border-gray-200">
          <Car className="w-5 h-5" />
        </div>
        <h2 className="font-koulen text-xl sm:text-2xl text-gray-800 tracking-wide">
          ព័ត៌មានការធ្វើដំណើរ
        </h2>
      </div>

      {/* Exactly 2 points as requested: ស្ថានភាពផ្លូវ & ចំណតយានយន្ត */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. ស្ថានភាពផ្លូវ (Road condition) */}
        {hasRoadCondition && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs mb-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span>ស្ថានភាពផ្លូវ</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {settings.road_condition_km}
            </p>
          </div>
        )}

        {/* 2. ចំណតយានយន្ត (Parking) */}
        {hasParking && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 font-semibold text-xs mb-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span>ចំណតយានយន្ត</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {settings.parking_note_km}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
