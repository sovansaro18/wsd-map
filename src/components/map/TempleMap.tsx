import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { isValidCoordinates, calculateDistanceKm, toKhmerNumerals, getGoogleMapsNavigationUrl } from '../../utils/navigation';
import { Compass, Navigation, MapPin, AlertTriangle, ShieldCheck, Layers, Eye } from 'lucide-react';

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

type MapType = 'google_streets' | 'google_hybrid' | 'osm';

export const TempleMap: React.FC<TempleMapProps> = ({
  latitude,
  longitude,
  templeNameKm,
  isVerified,
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

  const [mapType, setMapType] = useState<MapType>('google_streets');
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
    if (type === 'google_streets') {
      // Google Maps Standard Road / Street layer
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps',
      });
    } else if (type === 'google_hybrid') {
      // Google Maps Real Satellite Imagery with Road & Place Labels (Hybrid)
      layer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps Satellite',
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
      : [12.5657, 104.991]; // Cambodia approximate center for country view
    const initialZoom = hasValidCoords ? 17 : 7;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: initialZoom,
      zoomControl: true,
      attributionControl: false,
    });

    applyTileLayer(map, mapType);

    // Custom Temple Marker Icon using Official Temple Logo
    const templeIcon = L.divIcon({
      className: 'custom-temple-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background-color: #ffffff; border: 3px solid #d97706; border-radius: 9999px; padding: 2px; box-shadow: 0 6px 16px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; overflow: hidden; background: #fff;">
            <img src="/Logo.png" alt="${templeNameKm}" style="width: 100%; height: 100%; object-fit: contain; display: block;" onerror="this.src='/icon.svg'" />
          </div>
          <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid #d97706; margin-top: -1px;"></div>
          <div style="margin-top: 3px; background: rgba(28,25,23,0.92); color: #fef08a; padding: 3px 9px; border-radius: 6px; font-size: 11px; font-weight: bold; white-space: nowrap; font-family: 'Battambang', sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.35); border: 1px solid rgba(251,191,36,0.3);">
            ${templeNameKm}
          </div>
        </div>
      `,
      iconSize: [52, 70],
      iconAnchor: [26, 70],
    });

    if (hasValidCoords && latitude !== null && longitude !== null) {
      const marker = L.marker([latitude, longitude], {
        icon: templeIcon,
        draggable: interactiveMode,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Battambang', sans-serif; padding: 4px; max-width: 240px;">
          <h4 style="font-weight: bold; color: #9a3412; margin: 0 0 4px 0; font-size: 14px;">${templeNameKm}</h4>
          <p style="font-size: 12px; color: #444; margin: 0 0 6px 0;">នេះគឺជាទីតាំងផ្លូវការរបស់វត្ត</p>
          <p style="font-size: 11px; color: #666; margin: 0 0 8px 0;">កូអរដោនេ: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
          <a href="${getGoogleMapsNavigationUrl(latitude, longitude)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #b45309; color: #fff; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: bold; width: 100%; text-align: center; box-sizing: border-box;">
            🧭 បើកផ្លូវលើ Google Maps
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
    <div id="temple-map-wrapper" className="flex flex-col gap-2 w-full">
      {/* Top Header Controls Bar (Outside map DOM so Leaflet tile layer never covers it) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 shadow-xs">
        {/* Verification / Coords Status Badge */}
        <div className="flex items-center gap-2">
          {hasValidCoords ? (
            isVerified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ទីតាំងផ្លូវការរបស់វត្ត</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ទីតាំងមិនទាន់បានផ្ទៀងផ្ទាត់</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>ទីតាំងផ្លូវការមិនទាន់បានកំណត់</span>
            </span>
          )}
        </div>

        {/* Action Controls: Map Type Switcher + GPS Distance Check */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Switcher: Google Streets vs Google Satellite Hybrid */}
          <div className="inline-flex p-0.5 rounded-xl bg-white shadow-xs border border-stone-200 text-xs font-medium">
            <button
              type="button"
              id="map-layer-streets-btn"
              onClick={() => setMapType('google_streets')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mapType === 'google_streets'
                  ? 'bg-amber-700 text-white font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-amber-800 hover:bg-stone-100'
              }`}
              title="ផ្ទាំងផែនទីផ្លូវ Google Maps ធម្មតា"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ផែនទី Google</span>
            </button>
            <button
              type="button"
              id="map-layer-hybrid-btn"
              onClick={() => setMapType('google_hybrid')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                mapType === 'google_hybrid'
                  ? 'bg-amber-700 text-white font-semibold shadow-xs'
                  : 'text-stone-700 hover:text-amber-800 hover:bg-stone-100'
              }`}
              title="រូបភាពផ្កាយរណបពិតជាក់ស្តែង (Satellite)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ផ្កាយរណប (Satellite)</span>
            </button>
          </div>

          {/* User Location Trigger Button */}
          {showUserLocationToggle && hasValidCoords && (
            <button
              id="find-user-location-btn"
              type="button"
              onClick={requestUserLocation}
              disabled={locating}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Compass className={`w-4 h-4 text-amber-300 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'កំពុងស្វែងរក...' : 'ចម្ងាយពីខ្ញុំ'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Container Element with Badges */}
      <div id="temple-map-container" className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
        {/* Missing Coordinates Notification Over Map */}
        {!hasValidCoords && (
          <div
            id="map-unconfigured-overlay"
            className="absolute inset-0 z-[1000] flex flex-col items-center justify-center p-6 bg-stone-900/60 backdrop-blur-xs text-center text-white"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-3 border border-amber-400/40">
              <MapPin className="w-7 h-7 text-amber-300" />
            </div>
            <h3 className="text-base md:text-lg font-bold font-battambang text-amber-100">
              ទីតាំងផ្លូវការមិនទាន់បានកំណត់
            </h3>
            <p className="text-xs md:text-sm text-stone-200 max-w-md mt-1.5 leading-relaxed">
              អ្នកគ្រប់គ្រងវត្តមិនទាន់បានបញ្ចូលកូអរដោនេ GPS ផ្លូវការនៅឡើយទេ។ សូមរង់ចាំការបញ្ជាក់ ឬទាក់ទងមកវត្តផ្ទាល់។
            </p>
          </div>
        )}

        {/* Distance notification pill */}
        {distanceKm !== null && (
          <div
            id="calculated-distance-badge"
            className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-amber-200 text-xs text-stone-800 font-battambang"
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-amber-700" />
              <span>
                ចម្ងាយប្រហែល <strong className="text-amber-900 font-bold text-sm">{toKhmerNumerals(distanceKm)}</strong> គីឡូម៉ែត្រ
              </span>
            </div>
          </div>
        )}

        {/* Geo Error Warning */}
        {geoError && (
          <div
            id="geo-error-badge"
            className="absolute bottom-3 right-3 z-[1000] bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg text-xs shadow-md"
          >
            {geoError}
          </div>
        )}

        {/* Map DOM Element */}
        <div ref={mapContainerRef} style={{ height, width: '100%', zIndex: 1 }} />
      </div>
    </div>
  );
};
