import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TempleSettings, GalleryPhoto } from './types/temple';
import { templeService } from './services/templeService';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Automatically scroll to top on route navigation smoothly
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);
  return null;
};

function AppContent({
  settings,
  gallery,
  setSettings,
  setGallery,
}: {
  settings: TempleSettings;
  gallery: GalleryPhoto[];
  setSettings: (s: TempleSettings) => void;
  setGallery: (g: GalleryPhoto[]) => void;
}) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-800 font-battambang selection:bg-gray-200 selection:text-gray-800">
      <ScrollToTop />
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Main Content Area with Smooth Page Transition on Route Change */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-4 md:px-6 py-2">
        <div key={location.pathname} className="animate-page-enter">
          <Routes location={location}>
            {/* 1. Location Feature (Default / Home / Map / Location) */}
            <Route path="/" element={<HomePage settings={settings} />} />
            <Route path="/location" element={<HomePage settings={settings} />} />
            <Route path="/map" element={<HomePage settings={settings} />} />

            {/* 2. Contact Feature */}
            <Route path="/contact" element={<ContactPage settings={settings} />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/location" replace />} />
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

            {/* Catch-all redirect to Location */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Global Footer */}
      <Footer templeNameKm={settings.temple_name_km} />

      {/* Dedicated Mobile Bottom Bar */}
      <MobileBottomNav
        latitude={settings.latitude}
        longitude={settings.longitude}
      />
    </div>
  );
}

export default function App() {
  // Synchronous immediate initialization (0ms load time)
  const [settings, setSettings] = useState<TempleSettings>(() => templeService.getInitialSettings());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => templeService.getInitialGallery());

  // Non-blocking background sync
  useEffect(() => {
    let isMounted = true;
    const syncData = async () => {
      try {
        const [loadedSettings, loadedGallery] = await Promise.all([
          templeService.getSettings(),
          templeService.getGallery(),
        ]);
        if (isMounted) {
          setSettings(loadedSettings);
          setGallery(loadedGallery);
        }
      } catch (err) {
        console.warn('Background sync note:', err);
      }
    };
    syncData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Router>
      <AppContent
        settings={settings}
        gallery={gallery}
        setSettings={setSettings}
        setGallery={setGallery}
      />
    </Router>
  );
}
