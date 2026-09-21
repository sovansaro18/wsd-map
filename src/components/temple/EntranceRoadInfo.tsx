import React from 'react';
import { TempleSettings } from '../../types/temple';
import { Signpost, Compass, Car, MapPin, AlertCircle } from 'lucide-react';

interface EntranceRoadInfoProps {
  settings: TempleSettings;
}

export const EntranceRoadInfo: React.FC<EntranceRoadInfoProps> = ({ settings }) => {
  const hasRoadInfo =
    Boolean(settings.entrance_note_km) ||
    Boolean(settings.road_condition_km) ||
    Boolean(settings.landmark_note_km) ||
    Boolean(settings.parking_note_km) ||
    Boolean(settings.visitor_note_km);

  return (
    <section id="entrance-road-info-section" className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
      <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
          <Signpost className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-koulen text-xl sm:text-2xl text-stone-900 tracking-wide">
            ព័ត៌មានផ្លូវចូល និងទីតាំងចំណាំ
          </h2>
          <p className="text-xs text-stone-500">
            ការណែនាំអំពីផ្លូវធ្វើដំណើរ ចំណុចរបត់ និងចំណតយានយន្ត
          </p>
        </div>
      </div>

      {!hasRoadInfo ? (
        <div className="text-center py-6 text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
          មិនទាន់មានការបញ្ចូលព័ត៌មានលម្អិតអំពីផ្លូវចូលនៅឡើយ (អាចបន្ថែមតាមរយៈផ្ទាំង Admin)
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Entrance Instructions */}
          {settings.entrance_note_km && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>ផ្លូវចូលធំ និងទិសដៅបត់</span>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-battambang">
                {settings.entrance_note_km}
              </p>
            </div>
          )}

          {/* Road Conditions */}
          {settings.road_condition_km && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <Car className="w-4 h-4 text-amber-700" />
                <span>ស្ថានភាពផ្លូវ</span>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-battambang">
                {settings.road_condition_km}
              </p>
            </div>
          )}

          {/* Landmark Notes */}
          {settings.landmark_note_km && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>ចំណុចសម្គាល់សំខាន់ៗ (Landmarks)</span>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-battambang">
                {settings.landmark_note_km}
              </p>
            </div>
          )}

          {/* Parking Notes */}
          {settings.parking_note_km && (
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <Car className="w-4 h-4 text-amber-700" />
                <span>ចំណតរថយន្ត និងទោចក្រយានយន្ត</span>
              </div>
              <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-battambang">
                {settings.parking_note_km}
              </p>
            </div>
          )}

          {/* Notes for Visitors */}
          {settings.visitor_note_km && (
            <div className="md:col-span-2 bg-amber-50/70 rounded-xl p-4 border border-amber-200/70">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-sm mb-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>កំណត់សម្គាល់សម្រាប់ពុទ្ធបរិស័ទ និងភ្ញៀវធ្វើដំណើរ</span>
              </div>
              <p className="text-stone-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-battambang">
                {settings.visitor_note_km}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
