import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TempleSettings, GalleryPhoto } from './types/temple';
import { templeService } from './services/templeService';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { SharePage } from './pages/SharePage';
import { QRPage } from './pages/QRPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Automatically scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [settings, setSettings] = useState<TempleSettings | null>(null);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        const [loadedSettings, loadedGallery] = await Promise.all([
          templeService.getSettings(),
          templeService.getGallery(),
        ]);
        setSettings(loadedSettings);
        setGallery(loadedGallery);
      } catch (err) {
        console.error('Failed to load temple data', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  if (loading || !settings) {
    return (
      <div id="app-loading" className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-900/80 p-1 shadow-xl border-2 border-amber-400/40 flex items-center justify-center animate-pulse overflow-hidden">
          <img
            src="/Logo.png"
            alt="Loading"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/icon.svg';
            }}
          />
        </div>
        <p className="mt-4 font-koulen text-lg text-amber-900 tracking-wide">
          វត្តវារីបាការាម (ស្នាយដួច)
        </p>
        <p className="text-xs text-stone-500 font-battambang mt-1">កំពុងផ្ទុកទិន្នន័យ...</p>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-stone-100 flex flex-col text-stone-800 font-battambang selection:bg-amber-200 selection:text-amber-950">
        {/* Persistent Offline Status Badge */}
        <OfflineIndicator />

        {/* Global Navigation Header */}
        <Header
          templeNameKm={settings.temple_name_km}
          isVerified={settings.location_verified}
        />

        {/* Main Routed Page Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<HomePage settings={settings} gallery={gallery} />} />
            <Route path="/map" element={<MapPage settings={settings} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} settings={settings} />} />
            <Route path="/contact" element={<ContactPage settings={settings} />} />
            <Route path="/share" element={<SharePage settings={settings} />} />
            <Route path="/qr" element={<QRPage settings={settings} />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/general" replace />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard
                    settings={settings}
                    gallery={gallery}
                    onSettingsUpdated={(newSettings) => setSettings(newSettings)}
                    onGalleryUpdated={(newGallery) => setGallery(newGallery)}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/:tab"
              element={
                <ProtectedRoute>
                  <AdminDashboard
                    settings={settings}
                    gallery={gallery}
                    onSettingsUpdated={(newSettings) => setSettings(newSettings)}
                    onGalleryUpdated={(newGallery) => setGallery(newGallery)}
                  />
                </ProtectedRoute>
              }
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Desktop & Tablet Footer */}
        <Footer templeNameKm={settings.temple_name_km} />

        {/* Dedicated Mobile Bottom Bar */}
        <MobileBottomNav
          latitude={settings.latitude}
          longitude={settings.longitude}
        />
      </div>
    </Router>
  );
}
