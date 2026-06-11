import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

interface MapViewControllerProps {
  center: [number, number];
  zoom: number;
  bounds?: LatLngBoundsExpression | null;
}

/** Sync Leaflet map camera when center, zoom, or bounds change. */
export function MapViewController({ center, zoom, bounds }: MapViewControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
      return;
    }
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, bounds, map]);

  return null;
}
