import { TempleSettings } from '../types/temple';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_SETTINGS_KEY = 'wsd_temple_settings_v4';

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
  parking_note_km: 'មានចំណតរថយន្ត និងទោចក្រយានយន្តទូលាយក្នុងបរិវេណវត្ត',
  road_condition_km: 'ផ្លូវចូលស្រួល អាចធ្វើដំណើរដោយរថយន្ត ឬម៉ូតូបានគ្រប់រដូវកាល',
  visitor_note_km: '',
};

// In-memory fallback
let memorySettingsCache: TempleSettings | null = null;

// Helper to safely clear space in localStorage if full
function freeLocalStorageSpace(): void {
  try {
    const keysToRemove = [
      'wsd_temple_gallery_v1',
      'wsd_temple_settings_v1',
      'wsd_temple_gallery_v2',
      'wsd_temple_settings_v2',
      'wsd_temple_gallery_v3',
      'wsd_temple_settings_v3',
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
    freeLocalStorageSpace();
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Memory cache is already updated
    }
  }
}

// Fast network timeout helper to avoid hanging on slow backend
function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Network request timed out')), timeoutMs)
    ),
  ]);
}

export const templeService = {
  /**
   * Synchronously get initial settings for instant 0ms app start
   */
  getInitialSettings(): TempleSettings {
    return getLocalSettings();
  },

  /**
   * Fetch current official temple settings
   */
  async getSettings(): Promise<TempleSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const queryPromise = supabase
          .from('temple_settings')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        const { data, error } = await withTimeout<any>(Promise.resolve(queryPromise), 2500);

        if (error) {
          console.warn('Supabase fetch error, fallback to local storage:', error.message);
          return getLocalSettings();
        }

        if (data) {
          saveLocalSettings(data);
          return data as TempleSettings;
        }
      } catch (err) {
        console.warn('Supabase query failed/timed out, fallback to local cache:', err);
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
};
