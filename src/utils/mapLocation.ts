export interface MapCoords {
  lat: number;
  lng: number;
}

export type MapViewSource = 'gps' | 'geocode' | 'farms' | 'default';

export interface MapView {
  center: [number, number];
  zoom: number;
  source: MapViewSource;
  bounds?: [[number, number], [number, number]];
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

/** Read GPS from the device (returns null if denied, unavailable, or timed out). */
export function getPhoneLocation(timeoutMs = 12000): Promise<MapCoords | null> {
  if (!navigator.geolocation) return Promise.resolve(null);

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 120000 }
    );
  });
}

/** Geocode a place name via OpenStreetMap Nominatim (no hardcoded coordinates). */
export async function geocodePlace(query: string): Promise<MapCoords | null> {
  const trimmed = query?.trim();
  if (!trimmed) return null;

  try {
    const q = trimmed.toLowerCase().includes('ghana') ? trimmed : `${trimmed}, Ghana`;
    const res = await fetch(
      `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(q)}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.[0]?.lat && data?.[0]?.lon) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.warn('Geocode failed:', err);
  }
  return null;
}

/** Extract lat/lng from a farm or farmer record (supports multiple legacy field shapes). */
export function extractFarmCoords(record: Record<string, unknown>): MapCoords | null {
  const lat =
    record.latitude ??
    (record.gpsCoordinates as MapCoords | undefined)?.lat ??
    (record.farmLocation as MapCoords | undefined)?.lat ??
    (record.coordinates as number[] | undefined)?.[1];

  const lng =
    record.longitude ??
    (record.gpsCoordinates as MapCoords | undefined)?.lng ??
    (record.farmLocation as MapCoords | undefined)?.lng ??
    (record.coordinates as number[] | undefined)?.[0];

  const location = record.location as { coordinates?: number[] } | undefined;
  const locLat = location?.coordinates?.[1];
  const locLng = location?.coordinates?.[0];

  const finalLat = Number(lat ?? locLat);
  const finalLng = Number(lng ?? locLng);

  if (!Number.isFinite(finalLat) || !Number.isFinite(finalLng) || (finalLat === 0 && finalLng === 0)) {
    return null;
  }
  return { lat: finalLat, lng: finalLng };
}

export function getFarmsBounds(farms: Record<string, unknown>[]): [[number, number], [number, number]] | null {
  const coords = farms.map(extractFarmCoords).filter((c): c is MapCoords => c !== null);
  if (!coords.length) return null;

  const lats = coords.map((c) => c.lat);
  const lngs = coords.map((c) => c.lng);
  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ];
}

/**
 * Resolve initial map camera: phone GPS → geocode region/district → fit farm markers → geocode Ghana.
 */
export async function resolveInitialMapView(options: {
  region?: string;
  district?: string;
  community?: string;
  farms?: Record<string, unknown>[];
  gpsZoom?: number;
  geocodeZoom?: number;
  setPinFromGps?: boolean;
}): Promise<MapView & { pinCoords?: MapCoords }> {
  const gpsZoom = options.gpsZoom ?? 15;
  const geocodeZoom = options.geocodeZoom ?? 13;

  const gps = await getPhoneLocation();
  if (gps) {
    return {
      center: [gps.lat, gps.lng],
      zoom: gpsZoom,
      source: 'gps',
      pinCoords: options.setPinFromGps ? gps : undefined,
    };
  }

  const geocodeParts = [options.community, options.district, options.region].filter(Boolean);
  for (const part of geocodeParts) {
    const geo = await geocodePlace(String(part));
    if (geo) {
      return { center: [geo.lat, geo.lng], zoom: geocodeZoom, source: 'geocode' };
    }
  }

  if (options.region) {
    const geo = await geocodePlace(`${options.region}, Ghana`);
    if (geo) {
      return { center: [geo.lat, geo.lng], zoom: geocodeZoom, source: 'geocode' };
    }
  }

  const bounds = options.farms?.length ? getFarmsBounds(options.farms) : null;
  if (bounds) {
    const center: [number, number] = [
      (bounds[0][0] + bounds[1][0]) / 2,
      (bounds[0][1] + bounds[1][1]) / 2,
    ];
    return { center, zoom: 12, source: 'farms', bounds };
  }

  const ghana = await geocodePlace('Ghana');
  return {
    center: ghana ? [ghana.lat, ghana.lng] : [7.9465, -1.0232],
    zoom: 7,
    source: 'default',
  };
}
