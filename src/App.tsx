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
 <div id="app-loading" className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
 <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-gray-200 flex items-center justify-center overflow-hidden">
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
 <p className="mt-4 font-koulen text-lg text-gray-800 tracking-wide">
          វត្តវារីបាការាម (ស្នាយដួច)
        </p>
 <p className="text-xs text-gray-500 font-battambang mt-1">កំពុងផ្ទុកទិន្នន័យ...</p>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
 <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800 font-battambang selection:bg-gray-200 selection:text-gray-800">
        {/* Persistent Offline Status Badge */}
        <OfflineIndicator />

        {/* Global Navigation Header */}
        <Header
          templeNameKm={settings.temple_name_km}
          isVerified={settings.location_verified}
        />

        {/* Main Routed Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 py-2">
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
