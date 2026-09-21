import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for offline capabilities and caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Wat Snay Douch PWA: New update available');
  },
  onOfflineReady() {
    console.log('Wat Snay Douch PWA: Ready for offline operation');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

