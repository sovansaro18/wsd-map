import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { isValidCoordinates, calculateDistanceKm, toKhmerNumerals, getGoogleMapsNavigationUrl } from '../../utils/navigation';
import { Compass, Navigation, MapPin, Layers, Eye } from 'lucide-react';

interface TempleMapProps {
  latitude: number | null;
  longitude: number | null;
  templeNameKm: string;
  isVerified: boolean;
  height?: string;
  showUserLocationToggle?: boolean;
  onCoordinatesChange?: (coords: { lat: number; lng: number }) => void; // for admin picker mode
  interactiveMode?: boolean; // admin can drag or click to place pin
}

type MapType = 'google_hybrid' | 'google_streets' | 'osm';

export const TempleMap: React.FC<TempleMapProps> = ({
  latitude,
  longitude,
  templeNameKm,
  height = '420px',
  showUserLocationToggle = true,
  onCoordinatesChange,
  interactiveMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Default to Google Satellite Hybrid imagery as requested
  const [mapType, setMapType] = useState<MapType>('google_hybrid');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const hasValidCoords = isValidCoordinates(latitude, longitude);

  // Switch Tile Layer smoothly when mapType changes
  const applyTileLayer = (map: L.Map, type: MapType) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let layer: L.TileLayer;
    if (type === 'google_hybrid') {
      // Google Maps Real Satellite Imagery with Road & Place Labels (Hybrid)
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps Satellite',
      });
    } else if (type === 'google_streets') {
      // Google Maps Standard Road / Street layer
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps',
      });
    } else {
      // Fallback OpenStreetMap
      layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
    }

    layer.addTo(map);
    tileLayerRef.current = layer;
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(mapInstanceRef.current, mapType);
    }
  }, [mapType]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: if valid coordinates use them, otherwise Cambodia center
    const defaultCenter: [number, number] = hasValidCoords
      ? [latitude as number, longitude as number]
      : [12.5657, 104.991]; // Cambodia approximate center
    const initialZoom = hasValidCoords ? 17 : 7;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: initialZoom,
      zoomControl: false, // Turn off default top-left control to prevent overlap
      attributionControl: false,
    });

    // Add zoom control at bottom-right corner where it is clear and easy to touch
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    applyTileLayer(map, mapType);

    // Official Temple Marker using Temple Logo
    const templeIcon = L.divIcon({
      className: 'custom-temple-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #ffffff; border: 2.5px solid #d97706; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 2px; box-sizing: border-box;">
            <img src="/Logo.png" alt="${templeNameKm}" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="this.src='/icon.svg'" />
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #d97706; margin-top: -1px;"></div>
        </div>
      `,
      iconSize: [48, 56],
      iconAnchor: [24, 56],
      popupAnchor: [0, -56],
    });

    if (hasValidCoords && latitude !== null && longitude !== null) {
      const marker = L.marker([latitude, longitude], {
        icon: templeIcon,
        draggable: interactiveMode,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Battambang', sans-serif; padding: 4px; text-align: center;">
          <h4 style="font-weight: bold; color: #1f2937; margin: 0 0 6px 0; font-size: 13px;">${templeNameKm}</h4>
          <a href="${getGoogleMapsNavigationUrl(latitude, longitude)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #4b5563; color: #fff; padding: 5px 12px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 500;">
            បើក Google Maps
          </a>
        </div>
      `);

      if (interactiveMode) {
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onCoordinatesChange) {
            onCoordinatesChange({ lat: pos.lat, lng: pos.lng });
          }
        });
      }

      markerRef.current = marker;
    }

    // Interactive click to move marker in admin mode
    if (interactiveMode) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const marker = L.marker([lat, lng], {
            icon: templeIcon,
            draggable: true,
          }).addTo(map);
          markerRef.current = marker;
        }
        if (onCoordinatesChange) {
          onCoordinatesChange({ lat, lng });
        }
      });
    }

    mapInstanceRef.current = map;

    // Handle container resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, hasValidCoords, templeNameKm, interactiveMode]);

  // Handle User Geolocation Request
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('ឧបករណ៍របស់អ្នកមិនគាំទ្រប្រព័ន្ធកំណត់ទីតាំង (GPS)');
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        setLocating(false);

        if (hasValidCoords && latitude !== null && longitude !== null) {
          const dist = calculateDistanceKm(uLat, uLng, latitude, longitude);
          setDistanceKm(dist);
        }

        if (mapInstanceRef.current) {
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
                <div style="width: 18px; height: 18px; background-color: #2563eb; border: 3px solid #ffffff; border-radius: 9999px; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>
                <div style="position: absolute; width: 36px; height: 36px; background-color: rgba(37,99,235,0.25); border-radius: 9999px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([uLat, uLng]);
          } else {
            userMarkerRef.current = L.marker([uLat, uLng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<b>ទីតាំងបច្ចុប្បន្នរបស់អ្នក</b>');
          }

          // Fit bounds to show both user and temple if temple coords exist
          if (hasValidCoords && latitude !== null && longitude !== null) {
            const bounds = L.latLngBounds([
              [uLat, uLng],
              [latitude, longitude],
            ]);
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
          } else {
            mapInstanceRef.current.setView([uLat, uLng], 15);
          }
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('លោកអ្នកមិនបានអនុញ្ញាតឱ្យបើកទីតាំង (GPS Permission Denied)');
        } else {
          setGeoError('មិនអាចស្វែងរកទីតាំងបច្ចុប្បន្នរបស់អ្នកបានទេ');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <div id="temple-map-wrapper" className="w-full">
      {/* Docked Control Bar: Neatly placed above map, NOT floating inside map canvas */}
      <div id="temple-map-control-bar" className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 font-battambang">
        {/* Left: User Location Action & Live Distance */}
        <div className="flex items-center gap-2">
          {showUserLocationToggle && hasValidCoords && (
            <button
              id="find-user-location-btn"
              type="button"
              onClick={requestUserLocation}
              disabled={locating}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-xl text-xs font-medium border border-gray-300 transition cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap shadow-xs"
              title="ពិនិត្យចម្ងាយពីទីតាំងបច្ចុប្បន្នរបស់អ្នកមកកាន់វត្ត"
            >
              <Compass className={`w-3.5 h-3.5 text-gray-500 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'កំពុងស្វែងរក...' : 'ចម្ងាយពីខ្ញុំ'}</span>
            </button>
          )}

          {distanceKm !== null && (
            <div
              id="calculated-distance-badge"
              className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700"
            >
              <Navigation className="w-3.5 h-3.5 text-gray-500" />
              <span>
                ចម្ងាយប្រហែល <strong className="text-gray-900 font-semibold">{toKhmerNumerals(distanceKm)}</strong> គ.ម
              </span>
            </div>
          )}

          {geoError && (
            <span
              id="geo-error-badge"
              className="bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-lg text-xs"
            >
              {geoError}
            </span>
          )}
        </div>

        {/* Right: Map Layer Switcher (Satellite vs Street) */}
        <div className="inline-flex p-0.5 rounded-xl bg-white border border-gray-300 text-xs font-medium">
          <button
            type="button"
            id="map-layer-hybrid-btn"
            onClick={() => setMapType('google_hybrid')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              mapType === 'google_hybrid'
                ? 'bg-gray-700 text-white font-medium'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title="រូបភាពផ្កាយរណបពិត (Satellite)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>ផ្កាយរណប</span>
          </button>
          <button
            type="button"
            id="map-layer-streets-btn"
            onClick={() => setMapType('google_streets')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              mapType === 'google_streets'
                ? 'bg-gray-700 text-white font-medium'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title="ផែនទីធម្មតា"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ផែនទី</span>
          </button>
        </div>
      </div>

      {/* Clean Map Container Element */}
      <div id="temple-map-container" className="relative w-full overflow-hidden bg-gray-100">
        {/* Missing Coordinates Notification Over Map */}
        {!hasValidCoords && (
          <div
            id="map-unconfigured-overlay"
            className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-gray-800/80 backdrop-blur-xs text-center text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base md:text-lg font-semibold font-battambang text-white">
              ទីតាំងផ្លូវការមិនទាន់បានកំណត់
            </h3>
            <p className="text-xs md:text-sm text-gray-200 max-w-md mt-1.5 leading-relaxed font-battambang">
              អ្នកគ្រប់គ្រងវត្តមិនទាន់បានបញ្ចូលកូអរដោនេ GPS ផ្លូវការនៅឡើយទេ។ សូមរង់ចាំការបញ្ជាក់ ឬទាក់ទងមកវត្តផ្ទាល់។
            </p>
          </div>
        )}

        {/* Map DOM Element */}
        <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 1 }} />
      </div>
    </div>
  );
};
