/**
 * Navigation and Coordinate Utilities for Wat Snay Douch Location
 */

export function isValidCoordinates(lat: unknown, lng: unknown): boolean {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (isNaN(numLat) || isNaN(numLng)) return false;
  return numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180;
}

/**
 * Builds direct Google Maps navigation URL using exact latitude and longitude
 * Example: https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE
 */
export function getGoogleMapsNavigationUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Fallback direct map view query
 */
export function getGoogleMapsViewUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Apple Maps navigation link for iOS devices
 */
export function getAppleMapsNavigationUrl(lat: number, lng: number): string {
  return `https://maps.apple.com/?daddr=${lat.toFixed(6)},${lng.toFixed(6)}&dirflg=d`;
}

/**
 * Haversine distance formula in kilometers
 * Returns null if any coordinate is invalid or distance is not calculable
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number | null {
  if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
    return null;
  }
  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  const R = 6371; // Earth radius in km
  const dLat = ((nLat2 - nLat1) * Math.PI) / 180;
  const dLon = ((nLon2 - nLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((nLat1 * Math.PI) / 180) *
      Math.cos((nLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c * 10) / 10;
  if (isNaN(dist) || !isFinite(dist) || dist < 0) {
    return null;
  }
  return dist;
}

/**
 * Converts English digits to Khmer numerals safely.
 * Gracefully handles null, undefined, and non-numeric values.
 */
export function toKhmerNumerals(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str === 'NaN' || str === 'Infinity' || str === '-Infinity') return '';
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return str.replace(/[0-9]/g, (w) => khmerDigits[parseInt(w, 10)]);
}

/**
 * Sanitizes and ensures a standard external web link starts with https://
 */
export function sanitizeExternalUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  // Handle t.me or telegram usernames
  if (trimmed.startsWith('@')) {
    return `https://t.me/${trimmed.substring(1)}`;
  }
  return `https://${trimmed}`;
}

/**
 * Sanitizes phone numbers for tel: links
 */
export function sanitizePhoneForTel(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '');
}
