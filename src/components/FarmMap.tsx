import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Locate, Ruler, X } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface FarmMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAreaChange: (area: number) => void;
  farmSize?: number;
}

// Component to handle map click events
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to center map on user location
function LocationButton({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 15);
          onLocationChange(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        }
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
      className="absolute top-2 right-2 z-[1000] bg-white hover:bg-gray-100 text-gray-700 shadow-md"
      size="sm"
    >
      <Locate className="h-4 w-4 mr-1" />
      {isLocating ? 'Locating...' : 'Use My Location'}
    </Button>
  );
}

// Component for drawing polygon to measure area
function AreaMeasurement({ 
  onAreaChange, 
  onPolygonChange 
}: { 
  onAreaChange: (area: number) => void;
  onPolygonChange: (points: [number, number][]) => void;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [tempPoint, setTempPoint] = useState<[number, number] | null>(null);
  const map = useMap();

  const startDrawing = () => {
    setIsDrawing(true);
    setPolygonPoints([]);
    setTempPoint(null);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (polygonPoints.length >= 3) {
      calculateArea(polygonPoints);
      onPolygonChange(polygonPoints);
    }
  };

  const clearPolygon = () => {
    setPolygonPoints([]);
    setTempPoint(null);
    onAreaChange(0);
    onPolygonChange([]);
  };

  const calculateArea = (points: [number, number][]) => {
    if (points.length < 3) {
      onAreaChange(0);
      return;
    }

    // Calculate area using spherical excess formula (for accurate area on Earth)
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const lat1 = (points[i][0] * Math.PI) / 180;
      const lat2 = (points[j][0] * Math.PI) / 180;
      const lon1 = (points[i][1] * Math.PI) / 180;
      const lon2 = (points[j][1] * Math.PI) / 180;
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs(area * 6378137 * 6378137) / 2; // Earth radius in meters squared
    // Convert to hectares (1 hectare = 10,000 square meters)
    const areaInHectares = area / 10000;
    onAreaChange(areaInHectares);
  };

  useMapEvents({
    click(e) {
      if (isDrawing) {
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPolygonPoints([...polygonPoints, newPoint]);
        setTempPoint(newPoint);
      }
    },
  });

  return (
    <div className="absolute top-2 left-2 z-[1000] flex gap-2">
      {!isDrawing ? (
        <Button
          type="button"
          onClick={startDrawing}
          className="bg-white hover:bg-gray-100 text-gray-700 shadow-md"
          size="sm"
        >
          <Ruler className="h-4 w-4 mr-1" />
          Measure Farm Area
        </Button>
      ) : (
        <>
          <Button
            type="button"
            onClick={stopDrawing}
            className="bg-green-500 hover:bg-green-600 text-white shadow-md"
            size="sm"
          >
            Finish Drawing
          </Button>
          <Button
            type="button"
            onClick={clearPolygon}
            className="bg-red-500 hover:bg-red-600 text-white shadow-md"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

const FarmMap: React.FC<FarmMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  onAreaChange,
  farmSize,
}) => {
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const defaultCenter: [number, number] = [7.9465, -1.0232]; // Ghana center coordinates

  const handleLocationChange = (lat: number, lng: number) => {
    onLocationChange(lat, lng);
  };

  const handlePolygonChange = (points: [number, number][]) => {
    setPolygonPoints(points);
  };

  const currentCenter: [number, number] = 
    (latitude && latitude !== 0 && longitude && longitude !== 0) ? [latitude, longitude] : defaultCenter;

  return (
    <div className="w-full space-y-2">
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={currentCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationChange={handleLocationChange} />
          <LocationButton onLocationChange={handleLocationChange} />
          <AreaMeasurement onAreaChange={onAreaChange} onPolygonChange={handlePolygonChange} />
          
          {(latitude && latitude !== 0 && longitude && longitude !== 0) && (
            <Marker position={[latitude, longitude]} />
          )}
          
          {polygonPoints.length >= 3 && (
            <Polygon
              positions={polygonPoints}
              pathOptions={{ color: '#7ede56', fillColor: '#7ede56', fillOpacity: 0.3 }}
            />
          )}
        </MapContainer>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div>
          {latitude && longitude ? (
            <span className="text-gray-600">
              Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          ) : (
            <span className="text-gray-400">Click on map or use "Use My Location" to set farm location</span>
          )}
        </div>
        {farmSize && farmSize > 0 && (
          <div className="font-semibold text-green-600">
            Farm Size: {farmSize.toFixed(2)} hectares
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmMap;

