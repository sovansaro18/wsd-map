import { TempleSettings, GalleryPhoto } from '../types/temple';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_SETTINGS_KEY = 'wsd_temple_settings_v3';
const LOCAL_STORAGE_GALLERY_KEY = 'wsd_temple_gallery_v3';

const INITIAL_SETTINGS: TempleSettings = {
  id: 'a1111111-2222-3333-4444-555555555555',
  temple_name_km: 'វត្តវារីបាការាម (ស្នាយដួច)',
  temple_name_en: 'Wat Vari Bakaram (Snay Douch)',
  short_name: 'WSD Location',
  description_km: 'គេហទំព័រផ្លូវការបង្ហាញទីតាំងពិតប្រាកដ និងទិសដៅធ្វើដំណើរទៅកាន់វត្តវារីបាការាម (ស្នាយដួច)',
  address_km: 'ភូមិពន្សាំង ឃុំជើងគួន ស្រុកសំរោង ខេត្តតាកែវ',
  address_en: 'Punsang Village, Chueng Koun Commune, Samroang District, Takev Province',
  village_km: 'ពន្សាំង',
  commune_km: 'ជើងគួន',
  district_km: 'សំរោង',
  province_km: 'តាកែវ',
  phone: '016 759 264',
  telegram_url: 'https://t.me/sovansaro',
  facebook_url: 'https://facebook.com/watsnaydouch',
  facebook_personal_url: 'https://facebook.com/sovansaro',
  google_maps_url: 'https://maps.google.com/?q=11.12086,104.84524',
  latitude: 11.12086,
  longitude: 104.84524,
  location_verified: true,
  verified_at: '2026-09-24T00:00:00.000Z',
  verified_by: 'អ្នកគ្រប់គ្រងវត្តវារីបាការាម (ស្នាយដួច)',
  location_note: 'ទីតាំង GPS ផ្លូវការរបស់វត្តវារីបាការាម (ស្នាយដួច)',
  entrance_note_km: 'ចូលតាមក្លោងទ្វារមុខវត្តវារីបាការាម (ស្នាយដួច)',
  landmark_note_km: 'វត្តវារីបាការាម (ស្នាយដួច)',
  parking_note_km: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តទូលាយក្នុងបរិវេណវត្ត',
  road_condition_km: 'ផ្លូវចូលស្រួល អាចធ្វើដំណើរដោយរថយន្ត ឬម៉ូតូបានគ្រប់រដូវកាល',
  visitor_note_km: '',
};

const INITIAL_GALLERY: GalleryPhoto[] = [
  {
    id: 'g-real-bg-1',
    image_url: '/BG.jpg',
    title_km: 'ទិដ្ឋភាពជាក់ស្តែងវត្តវារីបាការាម (ស្នាយដួច)',
    description_km: 'រូបភាពទិដ្ឋភាពពិតជាក់ស្តែងថតដោយផ្ទាល់នៅវត្តវារីបាការាម (ស្នាយដួច)',
    category: 'building',
    is_cover: true,
    display_order: 1,
  },
  {
    id: 'g-gate-1',
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    title_km: 'ក្លោងទ្វារមុខវត្ត (ផ្លូវចូលធំ)',
    description_km: 'ក្លោងទ្វារចូលវត្តដែលមានរចនាបថក្បូរក្បាច់បែបខ្មែរ',
    category: 'gate',
    is_cover: false,
    display_order: 2,
  },
  {
    id: 'g-entrance-1',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title_km: 'ផ្លូវចូល និងបរិវេណវត្ត',
    description_km: 'ទិដ្ឋភាពផ្លូវចូលពីផ្លូវធំចូលមកកាន់ទីធ្លាវត្ត',
    category: 'entrance',
    is_cover: false,
    display_order: 3,
  },
];

// In-memory fallbacks to prevent crash if Storage Quota is exceeded
let memorySettingsCache: TempleSettings | null = null;
let memoryGalleryCache: GalleryPhoto[] | null = null;

// Helper to safely clear space in localStorage if full
function freeLocalStorageSpace(): void {
  try {
    const keysToRemove = [
      'wsd_temple_gallery_v1',
      'wsd_temple_settings_v1',
      'wsd_temple_gallery_v2',
      'wsd_temple_settings_v2',
    ];
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
  } catch {}
}

// Helper to load settings from LocalStorage
function getLocalSettings(): TempleSettings {
  if (memorySettingsCache) {
    return memorySettingsCache;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const resolved: TempleSettings = {
        ...INITIAL_SETTINGS,
        ...parsed,
        phone: parsed.phone && parsed.phone.trim() ? parsed.phone : INITIAL_SETTINGS.phone,
        telegram_url: parsed.telegram_url && parsed.telegram_url.trim() ? parsed.telegram_url : INITIAL_SETTINGS.telegram_url,
        facebook_url: parsed.facebook_url && parsed.facebook_url.trim() ? parsed.facebook_url : INITIAL_SETTINGS.facebook_url,
        facebook_personal_url: parsed.facebook_personal_url && parsed.facebook_personal_url.trim() ? parsed.facebook_personal_url : INITIAL_SETTINGS.facebook_personal_url,
        latitude: parsed.latitude !== null && parsed.latitude !== undefined ? parsed.latitude : INITIAL_SETTINGS.latitude,
        longitude: parsed.longitude !== null && parsed.longitude !== undefined ? parsed.longitude : INITIAL_SETTINGS.longitude,
        location_verified: true,
      };
      memorySettingsCache = resolved;
      return resolved;
    }
  } catch (e) {
    console.warn('Failed to parse local temple settings', e);
  }
  memorySettingsCache = INITIAL_SETTINGS;
  return INITIAL_SETTINGS;
}

// Helper to save settings to LocalStorage
function saveLocalSettings(settings: TempleSettings): void {
  memorySettingsCache = settings;
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e: any) {
    // If quota exceeded, clean up old keys and retry once
    freeLocalStorageSpace();
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Memory cache is already updated, safely ignore storage exhaustion
    }
  }
}

// Helper to load gallery from LocalStorage
function getLocalGallery(): GalleryPhoto[] {
  if (memoryGalleryCache && memoryGalleryCache.length > 0) {
    return memoryGalleryCache;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryGalleryCache = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse local gallery', e);
  }
  memoryGalleryCache = INITIAL_GALLERY;
  return INITIAL_GALLERY;
}

// Helper to save gallery to LocalStorage safely without quota errors
function saveLocalGallery(photos: GalleryPhoto[]): void {
  memoryGalleryCache = photos;

  // Filter out or truncate oversized base64 images (>100KB) to prevent blowing up the 5MB browser quota
  const safePhotos = photos.map((p) => {
    if (p.image_url && p.image_url.startsWith('data:image') && p.image_url.length > 100000) {
      // Keep original in memory, but don't blow localStorage
      return {
        ...p,
        image_url: '/BG.jpg', // Fallback to local image in offline storage
      };
    }
    return p;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(safePhotos));
  } catch (e) {
    // If quota is exceeded, clear old caches and try saving a minimal set
    freeLocalStorageSpace();
    try {
      // Try removing old gallery key to make room
      localStorage.removeItem(LOCAL_STORAGE_GALLERY_KEY);
      // Save top 5 items only
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(safePhotos.slice(0, 5)));
    } catch {
      // If still full, we keep memoryGalleryCache safely in memory without throwing
    }
  }
}

export const templeService = {
  /**
   * Fetch current official temple settings
   */
  async getSettings(): Promise<TempleSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('temple_settings')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch error, fallback to local storage:', error.message);
          return getLocalSettings();
        }

        if (data) {
          saveLocalSettings(data);
          return data as TempleSettings;
        }
      } catch (err) {
        console.warn('Supabase query failed, fallback to local cache:', err);
      }
    }
    return getLocalSettings();
  },

  /**
   * Update temple settings
   */
  async updateSettings(settings: Partial<TempleSettings>): Promise<TempleSettings> {
    const current = await this.getSettings();
    const updated: TempleSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('temple_settings')
        .upsert(updated);

      if (error) {
        console.error('Supabase update error:', error.message);
        throw new Error(error.message);
      }
    }

    saveLocalSettings(updated);
    return updated;
  },

  /**
   * Update & verify official GPS location
   */
  async verifyLocation(
    latitude: number,
    longitude: number,
    verifiedBy: string,
    locationNote?: string
  ): Promise<TempleSettings> {
    return this.updateSettings({
      latitude,
      longitude,
      location_verified: true,
      verified_at: new Date().toISOString(),
      verified_by: verifiedBy,
      location_note: locationNote || 'បានពិនិត្យ និងផ្ទៀងផ្ទាត់ដោយអ្នកគ្រប់គ្រងវត្ត',
    });
  },

  /**
   * Unverify or reset official GPS coordinates
   */
  async unverifyLocation(): Promise<TempleSettings> {
    return this.updateSettings({
      location_verified: false,
      verified_at: null,
      verified_by: null,
    });
  },

  /**
   * Fetch gallery photos
   */
  async getGallery(): Promise<GalleryPhoto[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('temple_gallery')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          saveLocalGallery(data);
          return data as GalleryPhoto[];
        }
      } catch (err) {
        console.warn('Supabase gallery fetch failed, using cached gallery:', err);
      }
    }
    return getLocalGallery();
  },

  /**
   * Add gallery photo
   */
  async addGalleryPhoto(photo: Omit<GalleryPhoto, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryPhoto[]> {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: 'photo-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('temple_gallery').insert(newPhoto);
      if (error) {
        console.error('Supabase insert gallery photo failed', error);
        throw new Error(error.message);
      }
    }

    const current = getLocalGallery();
    const updated = [...current, newPhoto];
    saveLocalGallery(updated);
    return updated;
  },

  /**
   * Delete gallery photo
   */
  async deleteGalleryPhoto(id: string): Promise<GalleryPhoto[]> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('temple_gallery').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete gallery photo failed', error);
        throw new Error(error.message);
      }
    }

    const current = getLocalGallery();
    const updated = current.filter((p) => p.id !== id);
    saveLocalGallery(updated);
    return updated;
  },

  /**
   * Set cover photo
   */
  async setCoverPhoto(id: string): Promise<GalleryPhoto[]> {
    if (isSupabaseConfigured && supabase) {
      const { error: resetError } = await supabase.from('temple_gallery').update({ is_cover: false }).neq('id', id);
      if (resetError) {
        console.error('Supabase reset cover failed', resetError);
        throw new Error(resetError.message);
      }
      const { error: setError } = await supabase.from('temple_gallery').update({ is_cover: true }).eq('id', id);
      if (setError) {
        console.error('Supabase set cover failed', setError);
        throw new Error(setError.message);
      }
    }

    const current = getLocalGallery();
    const updated = current.map((p) => ({
      ...p,
      is_cover: p.id === id,
    }));
    saveLocalGallery(updated);
    return updated;
  }
};
