import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TempleSettings, GalleryPhoto } from '../../types/temple';
import { templeService } from '../../services/templeService';
import { TempleMap } from '../../components/map/TempleMap';
import { isValidCoordinates } from '../../utils/navigation';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  MapPin,
  ShieldCheck,
  Building2,
  Signpost,
  Phone,
  Image as ImageIcon,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Trash2,
  Star,
  Plus,
  Database,
  ExternalLink,
  Upload,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  settings: TempleSettings;
  gallery: GalleryPhoto[];
  onSettingsUpdated: (updated: TempleSettings) => void;
  onGalleryUpdated: (updated: GalleryPhoto[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings: initialSettings,
  gallery: initialGallery,
  onSettingsUpdated,
  onGalleryUpdated,
}) => {
  const navigate = useNavigate();
  const { tab: urlTab } = useParams<{ tab?: string }>();

  // Active Tab: 'location' | 'general' | 'entrance' | 'contact' | 'gallery' | 'database'
  const [activeTab, setActiveTab] = useState<'location' | 'general' | 'entrance' | 'contact' | 'gallery' | 'database'>('location');

  const [formData, setFormData] = useState<TempleSettings>(initialSettings);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(initialGallery);
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Deletion confirmation state (iframe & mobile safe)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New photo form state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<'gate' | 'building' | 'entrance' | 'landmark' | 'general'>('gate');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminEmail = localStorage.getItem('wsd_admin_email') || 'admin@watsnaydouch.org';

  // Sync tab with URL
  useEffect(() => {
    if (urlTab) {
      if (urlTab === 'general' || urlTab === 'settings') setActiveTab('general');
      else if (urlTab === 'location') setActiveTab('location');
      else if (urlTab === 'entrance') setActiveTab('entrance');
      else if (urlTab === 'contact') setActiveTab('contact');
      else if (urlTab === 'gallery') setActiveTab('gallery');
      else if (urlTab === 'database') setActiveTab('database');
    }
  }, [urlTab]);

  const handleTabChange = (newTab: typeof activeTab) => {
    setActiveTab(newTab);
    navigate(`/admin/${newTab}`, { replace: true });
  };

  useEffect(() => {
    setFormData(initialSettings);
  }, [initialSettings]);

  useEffect(() => {
    setGallery(initialGallery);
  }, [initialGallery]);

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error', err);
      }
    }
    localStorage.removeItem('wsd_admin_authenticated');
    localStorage.removeItem('wsd_admin_email');
    navigate('/admin/login');
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Validate coordinates if entered
      if (formData.latitude !== null || formData.longitude !== null) {
        if (!isValidCoordinates(formData.latitude, formData.longitude)) {
          showError('កូអរដោនេមិនត្រឹមត្រូវ (រយៈទទឹង -90 ដល់ 90, រយៈបណ្តោយ -180 ដល់ 180)');
          setSaving(false);
          return;
        }
      }

      const updated = await templeService.updateSettings(formData);
      onSettingsUpdated(updated);
      showSuccess('បានរក្សាទុកទិន្នន័យដោយជោគជ័យ');
    } catch (err: any) {
      console.error(err);
      showError('មានបញ្ហាក្នុងការរក្សាទុក៖ ' + (err?.message || 'សូមពិនិត្យមើលការភ្ជាប់'));
    } finally {
      setSaving(false);
    }
  };

  // Capture current GPS from device
  const handleCaptureDeviceGps = () => {
    if (!navigator.geolocation) {
      showError('ឧបករណ៍មិនគាំទ្រ GPS');
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
        }));
        showSuccess(`បានចាប់យកកូអរដោនេ៖ ${lat}, ${lng}`);
      },
      (err) => {
        showError('មិនអាចទាញយក GPS បានទេ៖ ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  // Verify Location action
  const handleVerifyLocation = async () => {
    if (!isValidCoordinates(formData.latitude, formData.longitude)) {
      showError('សូមបញ្ចូលកូអរដោនេ GPS ត្រឹមត្រូវជាមុនសិន');
      return;
    }

    const updatedData: Partial<TempleSettings> = {
      ...formData,
      location_verified: true,
      verified_at: new Date().toISOString(),
      verified_by: adminEmail,
      location_note: formData.location_note || 'បានផ្ទៀងផ្ទាត់ដោយគណៈកម្មការវត្តផ្ទាល់',
    };

    setFormData((prev) => ({ ...prev, ...updatedData }));
    const saved = await templeService.updateSettings(updatedData);
    onSettingsUpdated(saved);
    showSuccess('បានផ្ទៀងផ្ទាត់ទីតាំងជាផ្លូវការរួចរាល់!');
  };

  // Unverify Location action
  const handleUnverifyLocation = async () => {
    const updatedData: Partial<TempleSettings> = {
      ...formData,
      location_verified: false,
      verified_at: null,
      verified_by: null,
    };

    setFormData((prev) => ({ ...prev, ...updatedData }));
    const saved = await templeService.updateSettings(updatedData);
    onSettingsUpdated(saved);
    showSuccess('បានដកចេញការផ្ទៀងផ្ទាត់ទីតាំង');
  };

  // Handle local file selection / drag-and-drop
  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showError('សូមជ្រើសរើសតែឯកសាររូបភាពប៉ុណ្ណោះ (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError('ទំហំរូបភាពត្រូវតែតូចជាង 5MB');
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setNewPhotoUrl(reader.result);
        if (!newPhotoTitle) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          setNewPhotoTitle(nameWithoutExt);
        }
        showSuccess('បានផ្ទុករូបភាពរួចរាល់');
      }
      setUploadingImage(false);
    };
    reader.onerror = () => {
      showError('មិនអាចអានឯកសាររូបភាពបានទេ');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  // Add Photo
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !newPhotoTitle.trim()) {
      showError('សូមបញ្ចូលតំណភ្ជាប់រូបភាព ឬជ្រើសរើសរូបភាព និងចំណងជើង');
      return;
    }

    try {
      const updated = await templeService.addGalleryPhoto({
        image_url: newPhotoUrl.trim(),
        title_km: newPhotoTitle.trim(),
        description_km: newPhotoDesc.trim(),
        category: newPhotoCategory,
        is_cover: gallery.length === 0,
        display_order: gallery.length + 1,
      });

      setGallery(updated);
      onGalleryUpdated(updated);
      setNewPhotoUrl('');
      setNewPhotoTitle('');
      setNewPhotoDesc('');
      showSuccess('បានបន្ថែមរូបភាពដោយជោគជ័យ');
    } catch (err: any) {
      showError('បរាជ័យក្នុងការបន្ថែមរូបភាព៖ ' + (err?.message || 'សូមពិនិត្យមើលសិទ្ធិ'));
    }
  };

  // Delete Photo with inline confirmation
  const handleConfirmDeletePhoto = async (id: string) => {
    try {
      const updated = await templeService.deleteGalleryPhoto(id);
      setGallery(updated);
      onGalleryUpdated(updated);
      setDeleteConfirmId(null);
      showSuccess('បានលុបរូបភាពរួចរាល់');
    } catch (err: any) {
      showError('បរាជ័យក្នុងការលុបរូបភាព៖ ' + (err?.message || 'សូមពិនិត្យមើលសិទ្ធិ'));
    }
  };

  // Set Cover Photo
  const handleSetCoverPhoto = async (id: string) => {
    try {
      const updated = await templeService.setCoverPhoto(id);
      setGallery(updated);
      onGalleryUpdated(updated);
      showSuccess('បានកំណត់ជារូបភាពតំណាង (Cover Photo)');
    } catch (err: any) {
      showError('បរាជ័យក្នុងការកំណត់រូបតំណាង៖ ' + (err?.message || 'សូមពិនិត្យមើលសិទ្ធិ'));
    }
  };

  return (
    <div id="admin-dashboard-container" className="space-y-6 py-6 max-w-6xl mx-auto">
      {/* Top Admin Header Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-800 text-amber-300 text-xs font-semibold border border-stone-700">
              ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រងវត្ត
            </span>
            {formData.location_verified && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-700/50 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>បានផ្ទៀងផ្ទាត់</span>
              </span>
            )}
          </div>
          <h1 className="font-koulen text-2xl sm:text-3xl text-amber-200">
            {formData.temple_name_km || 'វត្តវារីបាការាម (ស្នាយដួច)'}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            ចូលប្រើប្រាស់ដោយ៖ <strong className="text-stone-300">{adminEmail}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-save-all-btn"
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold shadow transition cursor-pointer active:scale-95 disabled:opacity-50 min-h-[42px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកទិន្នន័យ'}</span>
          </button>

          <button
            id="admin-logout-btn"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition cursor-pointer min-h-[42px]"
            title="ចាកចេញពីប្រព័ន្ធ"
          >
            <LogOut className="w-4 h-4 text-stone-400" />
            <span className="hidden sm:inline">ចាកចេញ</span>
          </button>
        </div>
      </div>

      {/* Toast notifications */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => handleTabChange('location')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'location'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>១. ទីតាំង GPS & ការផ្ទៀងផ្ទាត់</span>
        </button>

        <button
          onClick={() => handleTabChange('general')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'general'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>២. ព័ត៌មានទូទៅ & អាសយដ្ឋាន</span>
        </button>

        <button
          onClick={() => handleTabChange('entrance')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'entrance'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Signpost className="w-4 h-4" />
          <span>៣. ព័ត៌មានផ្លូវចូល & ចំណុចចំណាំ</span>
        </button>

        <button
          onClick={() => handleTabChange('contact')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'contact'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>៤. ទំនាក់ទំនងវត្ត</span>
        </button>

        <button
          onClick={() => handleTabChange('gallery')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>៥. គ្រប់គ្រងរូបភាពវត្ត ({gallery.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('database')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
            activeTab === 'database'
              ? 'bg-amber-800 text-white font-semibold shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>៦. ការកំណត់ការតភ្ជាប់ទិន្នន័យ</span>
        </button>
      </div>

      {/* TAB 1: LOCATION & GPS */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
            <h2 className="font-koulen text-xl text-stone-900 mb-1">
              កំណត់កូអរដោនេ GPS ផ្លូវការ (Official GPS Location)
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 font-battambang">
              អ្នកអាចវាយបញ្ចូលកូអរដោនេផ្ទាល់ ឬចុចលើផែនទីដើម្បីកំណត់ទីតាំងច្បាស់លាស់។ កុំទាយ ឬប្រើប្រាស់ទីតាំងប្រហាក់ប្រហែល។
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  Latitude (រយៈទទឹង ឧ. 13.123456)
                </label>
                <input
                  id="admin-latitude-input"
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
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono focus:border-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  Longitude (រយៈបណ្តោយ ឧ. 103.123456)
                </label>
                <input
                  id="admin-longitude-input"
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
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Device GPS Capture Helper & Google Maps link parser */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="admin-capture-device-gps-btn"
                  type="button"
                  onClick={handleCaptureDeviceGps}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 transition cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>ចាប់យក GPS ពីទូរស័ព្ទនៅនឹងកន្លែង (Use Device GPS)</span>
                </button>
              </div>

              {/* Notice explaining why computer Wi-Fi / IP shows Phnom Penh */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-stone-700 leading-relaxed space-y-1">
                <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>ចំណាំអំពីការចាប់យកទីតាំង (GPS Accuracy Note)៖</span>
                </p>
                <p>
                  ប្រសិនបើលោកអ្នកប្រើ<strong>កុំព្យូទ័រ (Laptop/PC)</strong> ឬបណ្តាញ Wi-Fi ប្រព័ន្ធអ៊ីនធឺណិត (ISP) អាចនឹងបញ្ជូនទីតាំងទៅ<strong>រាជធានីភ្នំពេញ</strong> (Core IP Gateway)។
                </p>
                <p className="text-amber-900 font-medium">
                  👉 <strong>វិធីកំណត់ឱ្យចំទីតាំងវត្ត ១០០%</strong>៖ សូមចុចពង្រីកលើផ្ទាំងផែនទីផ្កាយរណប (Satellite) ខាងក្រោម រួចចុចចំដំបូលព្រះវិហារ ឬអូសរូបសញ្ញា Logo វត្តទៅដាក់ចំទីតាំងដែលត្រូវ។
                </p>
              </div>
            </div>

            {/* Interactive Map Picker */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700">
                  ផែនទីអន្តរកម្ម (ចុចលើផែនទី ឬអូស Marker ដើម្បីកំណត់ទីតាំង):
                </span>
              </div>
              <TempleMap
                latitude={formData.latitude}
                longitude={formData.longitude}
                templeNameKm={formData.temple_name_km}
                isVerified={formData.location_verified}
                height="380px"
                interactiveMode={true}
                onCoordinatesChange={({ lat, lng }) => {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: Number(lat.toFixed(6)),
                    longitude: Number(lng.toFixed(6)),
                  }));
                }}
              />
            </div>

            {/* Verification Controls */}
            <div className="mt-6 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-koulen text-lg text-amber-950">
                    ស្ថានភាពផ្ទៀងផ្ទាត់ផ្លូវការ (Official Verification Status)
                  </h3>
                  <p className="text-xs text-stone-600 font-battambang">
                    {formData.location_verified
                      ? `បានផ្ទៀងផ្ទាត់នៅថ្ងៃ៖ ${formData.verified_at ? new Date(formData.verified_at).toLocaleDateString() : ''} ដោយ៖ ${formData.verified_by || 'Admin'}`
                      : 'ទីតាំងនេះមិនទាន់ត្រូវបានបញ្ជាក់ផ្ទៀងផ្ទាត់ផ្លូវការនៅឡើយទេ'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {formData.location_verified ? (
                    <button
                      id="admin-unverify-btn"
                      type="button"
                      onClick={handleUnverifyLocation}
                      className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition cursor-pointer"
                    >
                      ដកការផ្ទៀងផ្ទាត់
                    </button>
                  ) : (
                    <button
                      id="admin-verify-btn"
                      type="button"
                      onClick={handleVerifyLocation}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow transition cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>ផ្ទៀងផ្ទាត់ជាទីតាំងផ្លូវការ</span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  កំណត់សម្គាល់ការផ្ទៀងផ្ទាត់ (Verification Note)
                </label>
                <input
                  type="text"
                  value={formData.location_note || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location_note: e.target.value }))}
                  placeholder="ឧ. គណៈកម្មការវត្តបានផ្ទៀងផ្ទាត់នៅនឹងទីតាំងផ្ទាល់"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL & ADDRESS */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-5">
          <h2 className="font-koulen text-xl text-stone-900">
            ព័ត៌មានទូទៅ និងអាសយដ្ឋានរដ្ឋបាល
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ឈ្មោះវត្តជាភាសាខ្មែរ (Khmer Name)
              </label>
              <input
                type="text"
                value={formData.temple_name_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, temple_name_km: e.target.value }))}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ឈ្មោះជាអក្សរឡាតាំង (English / Latin Name)
              </label>
              <input
                type="text"
                value={formData.temple_name_en}
                onChange={(e) => setFormData((prev) => ({ ...prev, temple_name_en: e.target.value }))}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                សេចក្តីពិពណ៌នាខ្លី (Description)
              </label>
              <textarea
                rows={2}
                value={formData.description_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, description_km: e.target.value }))}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>
          </div>

          <div className="border-t border-stone-100 pt-5">
            <h3 className="font-koulen text-lg text-amber-900 mb-3">
              អាសយដ្ឋានរដ្ឋបាល (Administrative Address)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              កំណត់តែព័ត៌មានដែលមានភាពត្រឹមត្រូវច្បាស់លាស់ កុំទាយបន្លំ។
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  ភូមិ (Village)
                </label>
                <input
                  type="text"
                  value={formData.village_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, village_km: e.target.value }))}
                  placeholder="ឧ. ស្នាយដួច"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  ឃុំ / សង្កាត់ (Commune)
                </label>
                <input
                  type="text"
                  value={formData.commune_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commune_km: e.target.value }))}
                  placeholder="ឧ. ជ្រោយបន្ទាយ"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  ស្រុក / ខណ្ឌ (District)
                </label>
                <input
                  type="text"
                  value={formData.district_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, district_km: e.target.value }))}
                  placeholder="ឧ. ព្រែកប្រសព្វ"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  ខេត្ត / រាជធានី (Province)
                </label>
                <input
                  type="text"
                  value={formData.province_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, province_km: e.target.value }))}
                  placeholder="ឧ. ក្រចេះ"
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                  អាសយដ្ឋានពេញលេញ (Full Address Line)
                </label>
                <input
                  type="text"
                  value={formData.address_km}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address_km: e.target.value }))}
                  placeholder="ឧ. វត្តវារីបាការាម (ស្នាយដួច) ភូមិស្នាយដួច ឃុំ..."
                  className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENTRANCE & ROAD INFO */}
      {activeTab === 'entrance' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-5">
          <h2 className="font-koulen text-xl text-stone-900">
            ព័ត៌មានផ្លូវចូល និងការណែនាំដំណើរ
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-battambang">
            ជួយដល់ភ្ញៀវ និងពុទ្ធបរិស័ទចំណាំផ្លូវចូល ស្ថានភាពផ្លូវ និងចំណតរថយន្ត។
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ការណែនាំផ្លូវចូលធំ (Main Entrance Note)
              </label>
              <textarea
                rows={3}
                value={formData.entrance_note_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, entrance_note_km: e.target.value }))}
                placeholder="ឧ. សូមចូលតាមក្លោងទ្វារធំជាប់ផ្លូវកៅស៊ូ រួចបត់ស្តាំប្រហែល ៥០ ម៉ែត្រ..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ស្ថានភាពផ្លូវ (Road Condition)
              </label>
              <textarea
                rows={2}
                value={formData.road_condition_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, road_condition_km: e.target.value }))}
                placeholder="ឧ. ផ្លូវបេតុងស្អាត អាចធ្វើដំណើរបានគ្រប់រដូវកាល ទាំងរថយន្តតូចធំ..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ចំណុចសម្គាល់សំខាន់ៗ (Landmarks)
              </label>
              <textarea
                rows={2}
                value={formData.landmark_note_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, landmark_note_km: e.target.value }))}
                placeholder="ឧ. នៅជិតសាលាបឋមសិក្សា ឬមានដើមពោធិ៍ធំនៅមុខក្លោងទ្វារ..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                ចំណតយានយន្ត (Parking Information)
              </label>
              <textarea
                rows={2}
                value={formData.parking_note_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, parking_note_km: e.target.value }))}
                placeholder="ឧ. មានទីធ្លាចំណតរថយន្ត និងម៉ូតូធំទូលាយនៅខាងមុខ និងចំហៀងព្រះវិហារ..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                កំណត់សម្គាល់បន្ថែមសម្រាប់ភ្ញៀវ (Visitor Notes)
              </label>
              <textarea
                rows={2}
                value={formData.visitor_note_km}
                onChange={(e) => setFormData((prev) => ({ ...prev, visitor_note_km: e.target.value }))}
                placeholder="ឧ. សូមស្លៀកពាក់សមរម្យតាមគន្លងព្រះពុទ្ធសាសនា ពេលចូលក្នុងបរិវេណវត្ត..."
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT LINKS */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-5">
          <h2 className="font-koulen text-xl text-stone-900">
            ព័ត៌មានទំនាក់ទំនងវត្ត
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                លេខទូរស័ព្ទវត្ត (Phone Number)
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="ឧ. 012 345 678"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                តំណភ្ជាប់ Telegram (Telegram URL)
              </label>
              <input
                type="url"
                value={formData.telegram_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, telegram_url: e.target.value }))}
                placeholder="ឧ. https://t.me/yourtemplechannel"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                តំណភ្ជាប់ទំព័រ Facebook ផ្លូវការ (Facebook Page URL)
              </label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, facebook_url: e.target.value }))}
                placeholder="ឧ. https://facebook.com/watsnaydouch"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY MANAGEMENT */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Add New Photo Card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
            <h2 className="font-koulen text-xl text-stone-900 mb-1">
              បន្ថែមរូបភាពសម្គាល់វត្ត (Add New Photo)
            </h2>
            <p className="text-xs text-stone-500 mb-4 font-battambang">
              រូបភាពក្លោងទ្វារ តួព្រះវិហារ និងផ្លូវចូលជួយឱ្យភ្ញៀវចំណាំវត្តបានលឿន។ អ្នកអាចបញ្ចូលតំណភ្ជាប់រូបភាព ឬផ្ទុកឯកសារផ្ទាល់ពីទូរស័ព្ទ/កុំព្យូទ័រ (អតិបរមា 5MB)។
            </p>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 font-battambang">
                  ផ្ទុកឯកសាររូបភាពផ្ទាល់ (Upload Photo File)
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelected(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-5 text-center bg-amber-50/40 hover:bg-amber-50 transition cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelected(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="p-3 rounded-full bg-amber-100 text-amber-800">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-900 block font-battambang">
                      ចុចដើម្បីជ្រើសរើសរូបភាព ឬទាញទម្លាក់ទីនេះ
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      គាំទ្រ JPG, PNG, WebP (ទំហំមិនលើសពី 5MB)
                    </span>
                  </div>
                </div>
              </div>

              {/* Preview or URL Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                    ឬបញ្ចូលតំណភ្ជាប់រូបភាព (Image URL / Direct Link)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... ឬ Storage Link"
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-mono pr-10"
                    />
                    {newPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setNewPhotoUrl('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {newPhotoUrl && (
                  <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <img
                      src={newPhotoUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-stone-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="text-xs text-stone-600">
                      <span className="font-semibold text-emerald-700 block">រូបភាពត្រៀមរួចរាល់សម្រាប់រក្សាទុក</span>
                      <span className="text-[11px] text-stone-400 truncate max-w-xs block font-mono">
                        {newPhotoUrl.substring(0, 50)}...
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                    ចំណងជើងរូបភាព (Title in Khmer)
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="ឧ. ក្លោងទ្វារខាងកើត"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                    ប្រភេទរូបភាព (Category)
                  </label>
                  <select
                    value={newPhotoCategory}
                    onChange={(e) => setNewPhotoCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm"
                  >
                    <option value="gate">ក្លោងទ្វារវត្ត (Gate)</option>
                    <option value="building">ព្រះវិហារ/កុដិ (Building)</option>
                    <option value="entrance">ផ្លូវចូល (Entrance)</option>
                    <option value="landmark">ចំណុចសម្គាល់ (Landmark)</option>
                    <option value="general">ទិដ្ឋភាពទូទៅ (General)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1 font-battambang">
                    ការពិពណ៌នារូបភាព (Description)
                  </label>
                  <input
                    type="text"
                    value={newPhotoDesc}
                    onChange={(e) => setNewPhotoDesc(e.target.value)}
                    placeholder="ឧ. ផ្លូវបេតុងមុខក្លោងទ្វារចូលមកកាន់ព្រះវិហារ"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-battambang"
                  />
                </div>
              </div>

              <button
                id="admin-add-photo-btn"
                type="submit"
                disabled={uploadingImage}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{uploadingImage ? 'កំពុងអានរូបភាព...' : 'បន្ថែមរូបភាព'}</span>
              </button>
            </form>
          </div>

          {/* Current Photos List */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7">
            <h3 className="font-koulen text-lg text-stone-900 mb-4">
              រូបភាពវត្តបច្ចុប្បន្ន ({gallery.length})
            </h3>

            {gallery.length === 0 ? (
              <p className="text-stone-400 text-xs italic text-center py-6">
                មិនទាន់មានរូបភាពណាមួយត្រូវបានបន្ថែមនៅឡើយទេ
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-stone-200">
                      <img
                        src={photo.image_url}
                        alt={photo.title_km}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      {photo.is_cover && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-800 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                          <Star className="w-3 h-3 fill-current" />
                          <span>រូបតំណាង (Cover)</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-stone-900 text-xs sm:text-sm font-battambang line-clamp-1">
                          {photo.title_km}
                        </h4>
                        <span className="text-[11px] text-stone-500 font-mono block">
                          ប្រភេទ: {photo.category}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                        {!photo.is_cover && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverPhoto(photo.id)}
                            className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>ដាក់ជារូបតំណាង</span>
                          </button>
                        )}

                        {deleteConfirmId === photo.id ? (
                          <div className="flex items-center gap-1.5 ml-auto">
                            <span className="text-[11px] text-rose-700 font-medium font-battambang">លុប?</span>
                            <button
                              type="button"
                              onClick={() => handleConfirmDeletePhoto(photo.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-700 text-white text-xs font-bold hover:bg-rose-800 cursor-pointer"
                            >
                              លុប
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-300 cursor-pointer"
                            >
                              ទេ
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(photo.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>លុប</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: DATABASE & SYSTEM STATUS */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-5">
          <h2 className="font-koulen text-xl text-stone-900">
            ការកំណត់ការតភ្ជាប់ទិន្នន័យ
          </h2>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 font-battambang">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">ការតភ្ជាប់ Cloud Database:</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-200 text-stone-800'
              }`}>
                {isSupabaseConfigured ? 'បានភ្ជាប់ជោគជ័យ' : 'ដំណើរការក្នុងម៉ាស៊ីន (Local Storage)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">ការរក្សាទុកទិន្នន័យក្រៅបណ្តាញ (Offline Cache):</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                ដំណើរការល្អ
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">តារាងទិន្នន័យ (Tables):</span>
              <span className="text-xs text-stone-600 font-mono">
                temple_settings, temple_gallery, admin_profiles
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed space-y-2 font-battambang">
            <h4 className="font-bold text-stone-900">ការកំណត់ Cloud Database (Supabase)៖</h4>
            <p>
              សម្រាប់អ្នកគ្រប់គ្រងប្រព័ន្ធបច្ចេកវិទ្យា៖ ប្រសិនបើចង់ភ្ជាប់ទៅកាន់ Cloud Database សូមកំណត់អថេរ <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> និង <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code>។ ទិន្នន័យទាំងអស់នឹងត្រូវសមកាលកម្មដោយស្វ័យប្រវត្តិ។
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
