import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection, Feature } from 'geojson';

export type MapFocus = 'ghana' | 'west-africa' | 'africa';

const LIME = '#7ede56';
const GHANA_FILL = '#7ede56';
const AFRICA_FILL = '#c5d4cb';
const WEST_AFRICA_FILL = '#8fb89a';
const BORDER = 'rgba(0,47,55,0.28)';
const GHANA_BORDER = '#002f37';

const WEST_AFRICA_IDS = new Set([
  'CIV', 'TGO', 'BFA', 'NGA', 'BEN', 'SEN', 'MLI', 'GIN',
  'SLE', 'LBR', 'GMB', 'GNB', 'NER', 'MRT',
]);

/** Operating regions in Ghana with approximate capital coordinates. */
const GHANA_REGIONS: { name: string; coords: [number, number] }[] = [
  { name: 'Northern', coords: [9.4008, -0.8393] },
  { name: 'Upper East', coords: [10.7856, -0.8514] },
  { name: 'Bono Ahafo', coords: [7.3349, -2.3123] },
  { name: 'Ahafo', coords: [6.8036, -2.5177] },
  { name: 'Ashanti', coords: [6.6885, -1.6244] },
  { name: 'Eastern', coords: [6.0941, -0.2591] },
  { name: 'Volta', coords: [6.6101, 0.4785] },
  { name: 'Western', coords: [4.8964, -1.7554] },
  { name: 'Central', coords: [5.1053, -1.2466] },
];

const AFRICA_BOUNDS: L.LatLngBoundsExpression = [[-35, -19], [37, 52]];

/** Views — Africa default zooms in so the continent fills the panel */
const VIEWS: Record<
  MapFocus,
  { center: [number, number]; zoom: number } | { bounds: L.LatLngBoundsExpression; maxZoom: number }
> = {
  ghana: { bounds: [[4.55, -3.45], [11.25, 1.35]], maxZoom: 8 },
  'west-africa': { bounds: [[4.0, -17.5], [16.5, 4.5]], maxZoom: 6 },
  // Center + zoom fills the canvas like the reference (bigger Africa)
  africa: { center: [5, 18], zoom: 4.25 },
};

function FitFocus({ focus, isMobile }: { focus: MapFocus; isMobile: boolean }) {
  const map = useMap();
  useEffect(() => {
    const view = VIEWS[focus];
    // Let layout settle, then size the map so Africa isn't tiny
    const apply = () => {
      map.invalidateSize();
      if ('center' in view) {
        if (isMobile) {
          // Fixed desktop zoom crops the continent on narrow screens — fit instead
          map.fitBounds(AFRICA_BOUNDS, { padding: [4, 4], animate: true });
        } else {
          map.setView(view.center, view.zoom, { animate: true });
        }
      } else {
        map.fitBounds(view.bounds, {
          padding: isMobile ? [4, 4] : [0, 0],
          maxZoom: view.maxZoom,
          animate: true,
        });
      }
    };
    apply();
    const t = window.setTimeout(apply, 80);
    return () => window.clearTimeout(t);
  }, [focus, isMobile, map]);
  return null;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 640
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
}

const pulseIcon = (large: boolean) =>
  L.divIcon({
    className: '',
    html: `
      <span class="alm-pin ${large ? 'alm-pin-lg' : ''}">
        <span class="alm-pulse"></span>
        <span class="alm-dot"></span>
      </span>`,
    iconSize: [large ? 22 : 16, large ? 22 : 16],
    iconAnchor: [large ? 11 : 8, large ? 11 : 8],
  });

export const AfricaLiveMap: React.FC<{ focus: MapFocus }> = ({ focus }) => {
  const [africa, setAfrica] = useState<FeatureCollection | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch('/geo/africa.geo.json')
      .then((res) => res.json())
      .then(setAfrica)
      .catch(() => setAfrica(null));
  }, []);

  const styleFeature = (feature?: Feature) => {
    const id = (feature as { id?: string } | undefined)?.id;
    if (id === 'GHA') {
      return {
        fillColor: GHANA_FILL,
        fillOpacity: 0.95,
        color: GHANA_BORDER,
        weight: 1.5,
      };
    }
    if (focus === 'west-africa' && id && WEST_AFRICA_IDS.has(id)) {
      return {
        fillColor: WEST_AFRICA_FILL,
        fillOpacity: 0.95,
        color: BORDER,
        weight: 0.9,
      };
    }
    return {
      fillColor: AFRICA_FILL,
      fillOpacity: 1,
      color: BORDER,
      weight: 0.9,
    };
  };

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const name = (feature.properties as { name?: string } | null)?.name;
    if (name) {
      (layer as L.Path).bindTooltip(name, {
        sticky: true,
        direction: 'top',
        className: 'alm-country-tip',
      });
    }
  };

  return (
    <div className="alm-wrap relative overflow-hidden">
      <style>{`
        .alm-wrap .leaflet-container {
          height: 720px;
          width: 100%;
          background: transparent;
          font-family: 'Montserrat', sans-serif;
        }
        @media (max-width: 1024px) {
          .alm-wrap .leaflet-container { height: 560px; }
        }
        @media (max-width: 640px) {
          .alm-wrap .leaflet-container { height: 420px; }
          .alm-region-label {
            font-size: 9px !important;
            padding: 2px 5px !important;
          }
        }
        .alm-wrap .leaflet-container:focus,
        .alm-wrap path:focus,
        .alm-wrap .leaflet-interactive:focus {
          outline: none !important;
        }
        .alm-wrap .leaflet-container {
          border: none !important;
          box-shadow: none !important;
        }
        .alm-pin { position: relative; display: block; width: 100%; height: 100%; }
        .alm-dot {
          position: absolute; inset: 0; margin: auto;
          width: 10px; height: 10px; border-radius: 9999px;
          background: ${LIME}; border: 2px solid #fff;
          box-shadow: 0 0 12px rgba(126,222,86,0.9);
        }
        .alm-pin-lg .alm-dot { width: 14px; height: 14px; }
        .alm-pulse {
          position: absolute; inset: -10px; border-radius: 9999px;
          background: rgba(126,222,86,0.35);
          animation: alm-pulse 2.2s ease-out infinite;
        }
        @keyframes alm-pulse {
          0% { transform: scale(0.5); opacity: 0.9; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .alm-region-label {
          background: rgba(0,47,55,0.92) !important;
          border: none !important;
          border-radius: 8px !important;
          color: ${LIME} !important;
          font-weight: 700; font-size: 11px;
          padding: 3px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35) !important;
        }
        .alm-region-label::before { display: none !important; }
        .alm-country-tip {
          background: rgba(0,47,55,0.92) !important;
          border: none !important;
          border-radius: 8px !important;
          color: #fff !important;
          font-weight: 600; font-size: 11px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .alm-country-tip::before { display: none !important; }
        .alm-wrap .leaflet-control-zoom,
        .alm-wrap .leaflet-control-attribution { display: none !important; }
      `}</style>

      <MapContainer
        center={[5, 18]}
        zoom={4.25}
        scrollWheelZoom={false}
        dragging={!isMobile}
        touchZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ zIndex: 0 }}
      >
        <FitFocus focus={focus} isMobile={isMobile} />

        {africa && (
          <GeoJSON
            key={focus}
            data={africa}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
        )}

        {focus === 'ghana' &&
          GHANA_REGIONS.map((r) => (
            <Marker key={r.name} position={r.coords} icon={pulseIcon(false)}>
              <Tooltip
                permanent
                direction="right"
                offset={[10, 0]}
                className="alm-region-label"
              >
                {r.name}
              </Tooltip>
            </Marker>
          ))}

        {focus !== 'ghana' && (
          <Marker position={[7.9465, -1.0232]} icon={pulseIcon(true)}>
            <Tooltip permanent direction="right" offset={[12, 0]} className="alm-region-label">
              Ghana — Active
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default AfricaLiveMap;
