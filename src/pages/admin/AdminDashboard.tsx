import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TempleSettings, GalleryPhoto } from '../../types/temple';
import { templeService } from '../../services/templeService';
import { TempleMap } from '../../components/map/TempleMap';
import { isValidCoordinates } from '../../utils/navigation';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  MapPin,
  Phone,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface AdminDashboardProps {
  settings: TempleSettings;
  gallery: GalleryPhoto[];
  onSettingsUpdated: (updated: TempleSettings) => void;
  onGalleryUpdated: (updated: GalleryPhoto[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings: initialSettings,
  onSettingsUpdated,
}) => {
  const navigate = useNavigate();
  const { tab: urlTab } = useParams<{ tab?: string }>();

  // Only 2 active tabs: 'location' | 'contact'
  const [activeTab, setActiveTab] = useState<'location' | 'contact'>('location');
  const [formData, setFormData] = useState<TempleSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [coordsPasteInput, setCoordsPasteInput] = useState('');

  const adminEmail = localStorage.getItem('wsd_admin_email') || 'admin@watsnaydouch.org';

  // Sync tab with URL parameter
  useEffect(() => {
    if (urlTab === 'contact') {
      setActiveTab('contact');
    } else {
      setActiveTab('location');
    }
  }, [urlTab]);

  const handleTabChange = (newTab: 'location' | 'contact') => {
    setActiveTab(newTab);
    navigate(`/admin/${newTab}`, { replace: true });
  };

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Helper: Parse pasted Google Maps link or coordinates "lat, lng"
  const handleParsePastedCoords = () => {
    if (!coordsPasteInput.trim()) {
      showError('សូមបញ្ចូលកូអរដោនេ ឬតំណភ្ជាប់ Google Maps');
      return;
    }

    const text = coordsPasteInput.trim();
    const coordMatch = text.match(/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/);
    const urlMatch = text.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || text.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);

    const latStr = urlMatch ? urlMatch[1] : (coordMatch ? coordMatch[1] : null);
    const lngStr = urlMatch ? urlMatch[2] : (coordMatch ? coordMatch[2] : null);

    if (latStr && lngStr) {
      const lat = Number(parseFloat(latStr).toFixed(6));
      const lng = Number(parseFloat(lngStr).toFixed(6));

      if (isValidCoordinates(lat, lng)) {
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_verified: true,
        }));
        showSuccess(`បានបញ្ចូលកូអរដោនេ៖ ${lat}, ${lng}`);
        setCoordsPasteInput('');
        return;
      }
    }

    showError('មិនអាចស្គាល់កូអរដោនេបានទេ។ ឧ. 11.234567, 104.891234');
  };

  // Capture GPS directly from user's current device
  const handleCaptureDeviceGps = () => {
    if (!navigator.geolocation) {
      showError('ឧបករណ៍មិនគាំទ្រប្រព័ន្ធ GPS');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location_verified: true,
        }));
        showSuccess(`បានចាប់យកកូអរដោនេពីទូរស័ព្ទ៖ ${lat}, ${lng}`);
      },
      (err) => {
        showError('មិនអាចចាប់យក GPS បានទេ (សូមពិនិត្យសិទ្ធិ Location)');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // Save Settings Handler
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const isCoordsValid = isValidCoordinates(formData.latitude, formData.longitude);
      const dataToSave: TempleSettings = {
        ...formData,
        location_verified: isCoordsValid,
        verified_at: isCoordsValid ? (formData.verified_at || new Date().toISOString()) : null,
        verified_by: isCoordsValid ? (formData.verified_by || 'អ្នកគ្រប់គ្រងវត្ត') : null,
        google_maps_url:
          isCoordsValid && formData.latitude !== null && formData.longitude !== null
            ? `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`
            : formData.google_maps_url,
      };
      const updated = await templeService.updateSettings(dataToSave);
      setFormData(updated);
      onSettingsUpdated(updated);
      showSuccess('បានរក្សាទុកទិន្នន័យដោយជោគជ័យ');
    } catch (err: any) {
      showError('បរាជ័យក្នុងការរក្សាទុក៖ ' + (err?.message || 'សូមព្យាយាមម្តងទៀត'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('wsd_admin_authenticated');
    localStorage.removeItem('wsd_admin_email');
    navigate('/admin/login');
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6 py-6 max-w-5xl mx-auto font-battambang">
      {/* Top Admin Header Bar */}
      <div className="bg-white text-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-koulen text-2xl sm:text-3xl text-gray-800">
            {formData.temple_name_km || 'វត្តវារីបាការាម (ស្នាយដួច)'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5 font-battambang">
            {adminEmail}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-save-all-btn"
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm font-medium transition cursor-pointer active:scale-95 disabled:opacity-50 min-h-[42px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}</span>
          </button>

          <button
            id="admin-logout-btn"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 text-xs font-medium transition cursor-pointer min-h-[42px]"
            title="ចាកចេញពីប្រព័ន្ធ"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span className="hidden sm:inline">ចាកចេញ</span>
          </button>
        </div>
      </div>

      {/* Toast notifications */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Admin Tabs: Location & Contact only */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => handleTabChange('location')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'location'
              ? 'bg-gray-600 text-white font-medium'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>ទីតាំង</span>
        </button>

        <button
          onClick={() => handleTabChange('contact')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-gray-600 text-white font-medium'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>ទំនាក់ទំនង</span>
        </button>
      </div>

      {/* TAB 1: LOCATION (Identity, GPS, Address, Road Info) */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          {/* Temple Identity Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-4">
            <h2 className="font-koulen text-xl text-gray-800">
              ឈ្មោះវត្ត
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ឈ្មោះវត្តជាភាសាខ្មែរ
                </label>
                <input
                  type="text"
                  value={formData.temple_name_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, temple_name_km: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ឈ្មោះជាអក្សរឡាតាំង (English)
                </label>
                <input
                  type="text"
                  value={formData.temple_name_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, temple_name_en: e.target.value }))}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Interactive Map */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-koulen text-xl text-gray-800">
                កូអរដោនេ GPS
              </h2>

              <button
                type="button"
                onClick={handleCaptureDeviceGps}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium border border-gray-300 transition cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>ចាប់យក GPS ពីទូរស័ព្ទ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  រយៈទទឹង (Latitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude !== null ? formData.latitude : ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: e.target.value === '' ? null : parseFloat(e.target.value),
                    }))
                  }
                  placeholder="ឧ. 13.095689"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm font-mono focus:border-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  រយៈបណ្តោយ (Longitude)
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude !== null ? formData.longitude : ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: e.target.value === '' ? null : parseFloat(e.target.value),
                    }))
                  }
                  placeholder="ឧ. 103.204561"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm font-mono focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Paste from Google Maps */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
              <input
                type="text"
                value={coordsPasteInput}
                onChange={(e) => setCoordsPasteInput(e.target.value)}
                placeholder="បិទភ្ជាប់កូអរដោនេ ឬតំណភ្ជាប់ Google Maps (ឧ. 11.234567, 104.891234)"
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-mono focus:border-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleParsePastedCoords}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs font-medium transition active:scale-95 cursor-pointer shrink-0"
              >
                បញ្ចូល
              </button>
            </div>

            {/* Map Pin Picker */}
            <div className="pt-2">
              <TempleMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                templeNameKm={formData.temple_name_km}
                isVerified={formData.location_verified}
                height="360px"
                interactiveMode={true}
                onCoordinatesChange={({ lat, lng }) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: Number(lat.toFixed(6)),
                    longitude: Number(lng.toFixed(6)),
                    location_verified: true,
                  }));
                }}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-4">
            <h2 className="font-koulen text-xl text-gray-800">
              អាសយដ្ឋាន
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ភូមិ
                </label>
                <input
                  type="text"
                  value={formData.village_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, village_km: e.target.value }))}
                  placeholder="ឧ. ស្នាយដួច"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ឃុំ / សង្កាត់
                </label>
                <input
                  type="text"
                  value={formData.commune_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commune_km: e.target.value }))}
                  placeholder="ឧ. ជ្រោយបន្ទាយ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ស្រុក / ខណ្ឌ
                </label>
                <input
                  type="text"
                  value={formData.district_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, district_km: e.target.value }))}
                  placeholder="ឧ. ព្រែកប្រសព្វ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ខេត្ត / រាជធានី
                </label>
                <input
                  type="text"
                  value={formData.province_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, province_km: e.target.value }))}
                  placeholder="ឧ. ក្រចេះ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  អាសយដ្ឋានពេញលេញ
                </label>
                <input
                  type="text"
                  value={formData.address_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address_km: e.target.value }))}
                  placeholder="ឧ. ភូមិស្នាយដួច ឃុំជ្រោយបន្ទាយ ស្រុកព្រែកប្រសព្វ ខេត្តក្រចេះ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Entrance & Road Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-4">
            <h2 className="font-koulen text-xl text-gray-800">
              ព័ត៌មានផ្លូវចូល
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ផ្លូវចូល និងទិសដៅបត់
                </label>
                <textarea
                  rows={3}
                  value={formData.entrance_note_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, entrance_note_km: e.target.value }))}
                  placeholder="ឧ. ធ្វើដំណើរតាមផ្លូវជាតិលេខ... ដល់ស្ពាន... បត់ស្តាំប្រហែល ៥០០ ម៉ែត្រ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ស្ថានភាពផ្លូវ
                </label>
                <textarea
                  rows={3}
                  value={formData.road_condition_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, road_condition_km: e.target.value }))}
                  placeholder="ឧ. ផ្លូវបេតុងស្អាត អាចធ្វើដំណើរបានគ្រប់រដូវកាល"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ចំណុចសម្គាល់
                </label>
                <input
                  type="text"
                  value={formData.landmark_note_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, landmark_note_km: e.target.value }))}
                  placeholder="ឧ. ទល់មុខសាលាបឋមសិក្សា..."
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ចំណតយានយន្ត
                </label>
                <input
                  type="text"
                  value={formData.parking_note_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parking_note_km: e.target.value }))}
                  placeholder="ឧ. មានទីធ្លាចំណតរថយន្ត និងម៉ូតូធំទូលាយ"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT (Phone, Telegram, Facebook) */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 space-y-4">
          <h2 className="font-koulen text-xl text-gray-800">
            ព័ត៌មានទំនាក់ទំនង
          </h2>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                លេខទូរស័ព្ទ
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="ឧ. 012 345 678"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Telegram (Link ឬ Username)
              </label>
              <input
                type="text"
                value={formData.telegram_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, telegram_url: e.target.value }))}
                placeholder="ឧ. https://t.me/username"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Facebook Page វត្ត (Official Page)
              </label>
              <input
                type="text"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, facebook_url: e.target.value }))}
                placeholder="ឧ. https://facebook.com/watsnaydouch"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Facebook ផ្ទាល់ខ្លួន (អ្នកគ្រប់គ្រងវត្ត)
              </label>
              <input
                type="text"
                value={formData.facebook_personal_url || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, facebook_personal_url: e.target.value }))}
                placeholder="ឧ. https://facebook.com/sovansaro"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
