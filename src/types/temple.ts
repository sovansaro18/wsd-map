export interface TempleSettings {
  id: string;
  temple_name_km: string;
  temple_name_en: string;
  short_name: string;
  description_km: string;
  address_km?: string;
  address_en?: string;
  village_km?: string; // ភូមិ
  commune_km?: string; // ឃុំ
  district_km?: string; // ស្រុក
  province_km?: string; // ខេត្ត
  phone?: string;
  telegram_url?: string;
  facebook_url?: string;
  google_maps_url?: string;
  latitude: number | null;
  longitude: number | null;
  location_verified: boolean;
  verified_at?: string | null;
  verified_by?: string | null;
  location_note?: string | null;
  entrance_note_km?: string;
  landmark_note_km?: string;
  parking_note_km?: string;
  road_condition_km?: string;
  visitor_note_km?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryPhoto {
  id: string;
  image_url: string;
  title_km: string;
  description_km?: string;
  category: 'gate' | 'building' | 'landmark' | 'entrance' | 'general';
  is_cover: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
