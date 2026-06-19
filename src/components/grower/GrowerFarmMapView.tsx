import React from 'react';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GrowerFarmLocation } from '@/utils/authToken';
import { cn } from '@/lib/utils';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

type GrowerFarmMapViewProps = {
    farmLocation?: GrowerFarmLocation | null;
    gpsLocation?: { lat?: number; lng?: number } | null;
    className?: string;
};

const GrowerFarmMapView: React.FC<GrowerFarmMapViewProps> = ({
    farmLocation,
    gpsLocation,
    className = '',
}) => {
    const lat = farmLocation?.lat ?? gpsLocation?.lat;
    const lng = farmLocation?.lng ?? gpsLocation?.lng;

    if (lat == null || lng == null) {
        return (
            <div className={`rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center ${className}`}>
                <p className="text-sm text-gray-500">No farm map yet.</p>
                <p className="text-xs text-gray-400 mt-1">Your agent can map your field on a visit.</p>
            </div>
        );
    }

    const boundary = farmLocation?.boundary?.map(([a, b]) => [a, b] as [number, number]);

    return (
        <div
            className={cn(
                'rounded-xl overflow-hidden border border-gray-100',
                className || 'h-48 sm:h-56'
            )}
        >
            <MapContainer
                center={[lat, lng]}
                zoom={boundary?.length ? 15 : 14}
                className="h-full w-full"
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {boundary && boundary.length >= 3 ? (
                    <Polygon positions={boundary} pathOptions={{ color: '#065f46', fillColor: '#7ede56', fillOpacity: 0.25 }} />
                ) : (
                    <Marker position={[lat, lng]} />
                )}
            </MapContainer>
        </div>
    );
};

export default GrowerFarmMapView;
