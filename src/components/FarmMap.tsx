import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Polygon, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Locate, Ruler, X, Undo2 } from 'lucide-react';
import { MapViewController } from '@/components/map/MapViewController';
import { polygonAreaAcres, polygonAreaHectares } from '@/utils/geoArea';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export type FarmMapAreaUnit = 'acres' | 'hectares';

interface FarmMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAreaChange: (area: number) => void;
  onBoundaryChange?: (points: [number, number][]) => void;
  /** Fires when the agent taps Done after drawing the boundary. */
  onMeasurementComplete?: (area: number, points: [number, number][]) => void;
  farmSize?: number;
  viewCenter?: [number, number];
  viewZoom?: number;
  /** When true, map fills parent height (for modals). */
  embedded?: boolean;
  /** Unit reported via onAreaChange — defaults to acres (matches onboarding form). */
  areaUnit?: FarmMapAreaUnit;
}

function MapClickHandler({
  onLocationChange,
  disabled,
}: {
  onLocationChange: (lat: number, lng: number) => void;
  disabled: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function LocationButton({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 16);
          onLocationChange(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={getCurrentLocation}
      disabled={isLocating}
      className="absolute top-2 right-2 z-[1000] bg-white hover:bg-gray-100 text-gray-700 shadow-md text-[10px] md:text-xs font-bold uppercase tracking-wide max-w-[46%] md:max-w-none truncate"
      size="sm"
    >
      <Locate className="h-4 w-4 mr-1 shrink-0" />
      {isLocating ? 'Locating…' : 'My Location'}
    </Button>
  );
}

function AreaMeasurement({
  areaUnit,
  onAreaChange,
  onPolygonChange,
  onDrawingChange,
  onMeasurementComplete,
}: {
  areaUnit: FarmMapAreaUnit;
  onAreaChange: (area: number) => void;
  onPolygonChange: (points: [number, number][]) => void;
  onDrawingChange: (drawing: boolean) => void;
  onMeasurementComplete?: (area: number, points: [number, number][]) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);

  const areaFromPoints = useCallback(
    (points: [number, number][]) => {
      if (points.length < 3) return 0;
      return areaUnit === 'acres' ? polygonAreaAcres(points) : polygonAreaHectares(points);
    },
    [areaUnit]
  );

  const applyPolygon = useCallback(
    (points: [number, number][]) => {
      onPolygonChange(points);
      onAreaChange(areaFromPoints(points));
    },
    [areaFromPoints, onAreaChange, onPolygonChange]
  );

  const startDrawing = () => {
    setPolygonPoints([]);
    setIsDrawing(true);
    onDrawingChange(true);
    onAreaChange(0);
    onPolygonChange([]);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    onDrawingChange(false);
    setPolygonPoints((points) => {
      if (points.length >= 3) {
        const area = areaFromPoints(points);
        onPolygonChange(points);
        onAreaChange(area);
        onMeasurementComplete?.(area, points);
      }
      return points;
    });
  };

  const undoPoint = () => {
    setPolygonPoints((points) => {
      const next = points.slice(0, -1);
      if (next.length >= 3) {
        applyPolygon(next);
      } else {
        onAreaChange(0);
        onPolygonChange(next);
      }
      return next;
    });
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
    setIsDrawing(false);
    onDrawingChange(false);
    onAreaChange(0);
    onPolygonChange([]);
  };

  useMapEvents({
    click(e) {
      if (!isDrawing) return;
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPolygonPoints((prev) => {
        const next = [...prev, newPoint];
        if (next.length >= 3) {
          applyPolygon(next);
        }
        return next;
      });
    },
  });

  return (
    <>
      <div className="absolute top-2 left-2 z-[1000] flex flex-col gap-1.5 max-w-[calc(100%-5.5rem)]">
        {!isDrawing ? (
          <Button
            type="button"
            onClick={startDrawing}
            className="bg-[#065f46] hover:bg-[#065f46]/90 text-white shadow-md text-[10px] font-black uppercase tracking-wide"
            size="sm"
          >
            <Ruler className="h-4 w-4 mr-1 shrink-0" />
            Measure boundary
          </Button>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              onClick={finishDrawing}
              className="bg-[#7ede56] hover:bg-[#6bc947] text-[#002f37] shadow-md text-[10px] font-black uppercase"
              size="sm"
            >
              Done ({polygonPoints.length} pts)
            </Button>
            {polygonPoints.length > 0 && (
              <Button
                type="button"
                onClick={undoPoint}
                className="bg-white hover:bg-gray-100 text-gray-700 shadow-md"
                size="sm"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              onClick={clearPolygon}
              className="bg-red-500 hover:bg-red-600 text-white shadow-md"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {isDrawing && (
          <p className="text-[10px] font-bold uppercase tracking-wide bg-white/95 text-[#065f46] px-2 py-1 rounded-lg shadow border border-gray-100">
            Tap each corner of the farm boundary
          </p>
        )}
      </div>

      {polygonPoints.map((point, index) => (
        <CircleMarker
          key={`${point[0]}-${point[1]}-${index}`}
          center={point}
          radius={6}
          pathOptions={{ color: '#065f46', fillColor: '#7ede56', fillOpacity: 1, weight: 2 }}
        />
      ))}

      {polygonPoints.length >= 2 && (
        <Polygon
          positions={polygonPoints}
          pathOptions={{
            color: '#065f46',
            fillColor: '#7ede56',
            fillOpacity: polygonPoints.length >= 3 ? 0.25 : 0,
            weight: 2,
            dashArray: polygonPoints.length < 3 ? '6 4' : undefined,
          }}
        />
      )}
    </>
  );
}

const FarmMap: React.FC<FarmMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onAreaChange,
  onBoundaryChange,
  onMeasurementComplete,
  farmSize,
  viewCenter,
  viewZoom = 14,
  embedded = false,
  areaUnit = 'acres',
}) => {
  const [isMeasuring, setIsMeasuring] = useState(false);

  const handlePolygonChange = (points: [number, number][]) => {
    onBoundaryChange?.(points);
  };

  const hasPin = latitude !== 0 && longitude !== 0;
  const initialCenter: [number, number] = hasPin
    ? [latitude, longitude]
    : viewCenter ?? [7.9465, -1.0232];
  const initialZoom = hasPin ? 16 : viewZoom;

  const unitLabel = areaUnit === 'acres' ? 'acres' : 'ha';

  return (
    <div className={`w-full ${embedded ? 'h-full flex flex-col' : 'space-y-2'}`}>
      <div
        className={`relative w-full overflow-hidden border border-gray-300 ${
          embedded ? 'flex-1 min-h-0 rounded-none border-0' : 'h-[400px] rounded-lg'
        }`}
      >
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={!isMeasuring}
          touchZoom
          doubleClickZoom={!isMeasuring}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {viewCenter && <MapViewController center={viewCenter} zoom={viewZoom} />}

          <MapClickHandler onLocationChange={onLocationChange} disabled={isMeasuring} />
          <LocationButton onLocationChange={onLocationChange} />
          <AreaMeasurement
            areaUnit={areaUnit}
            onAreaChange={onAreaChange}
            onPolygonChange={handlePolygonChange}
            onDrawingChange={setIsMeasuring}
            onMeasurementComplete={onMeasurementComplete}
          />

          {hasPin && !isMeasuring && <Marker position={[latitude, longitude]} />}
        </MapContainer>
      </div>

      {!embedded && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
          <div>
            {hasPin ? (
              <span className="text-gray-600">
                Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            ) : (
              <span className="text-gray-400">Tap the map or use My Location to pin the farm</span>
            )}
          </div>
          {farmSize != null && farmSize > 0 && (
            <div className="font-semibold text-[#065f46]">
              Measured: {farmSize.toFixed(2)} {unitLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmMap;
