import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { Badge } from '@/components/ui/badge';
import { MapViewController } from '@/components/map/MapViewController';
import {
    resolveInitialMapView,
    geocodePlace,
    extractFarmCoords,
    getFarmsBounds,
    type MapView,
} from '@/utils/mapLocation';

// Fix for default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface OperationalMapProps {
    farms: Record<string, unknown>[];
    darkMode: boolean;
    agentRegion?: string;
}

const OperationalMap: React.FC<OperationalMapProps> = ({ farms, darkMode, agentRegion }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mapView, setMapView] = useState<MapView | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [locating, setLocating] = useState(true);

    const farmsWithCoords = useMemo(
        () => farms.filter((f) => extractFarmCoords(f) !== null),
        [farms]
    );

    const farmBounds = useMemo(() => getFarmsBounds(farmsWithCoords), [farmsWithCoords]);

    // On load: phone GPS → geocode agent region → fit farm markers
    useEffect(() => {
        let cancelled = false;
        setLocating(true);

        (async () => {
            const view = await resolveInitialMapView({
                region: agentRegion,
                farms: farmsWithCoords,
                gpsZoom: 14,
                geocodeZoom: 11,
            });

            if (cancelled) return;

            // When farms exist and we didn't lock to GPS, fit all pins in view
            if (farmBounds && view.source !== 'gps') {
                setMapView({ ...view, bounds: farmBounds, source: 'farms' });
            } else if (farmBounds && view.source === 'gps' && farmsWithCoords.length > 0) {
                // GPS for agent location; still expose farms — keep GPS center unless many farms
                setMapView(
                    farmsWithCoords.length >= 2
                        ? { ...view, bounds: farmBounds, source: 'farms' }
                        : view
                );
            } else {
                setMapView(view);
            }
            setLocating(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [agentRegion, farmBounds, farmsWithCoords]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const geo = await geocodePlace(searchQuery);
            if (geo) {
                setMapView({
                    center: [geo.lat, geo.lng],
                    zoom: 13,
                    source: 'geocode',
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Location found',
                    text: searchQuery,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: darkMode ? '#002f37' : '#fff',
                    color: darkMode ? '#fff' : '#002f37',
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Location not found',
                    text: 'Try a community, district, or landmark name.',
                    confirmButtonColor: '#065f46',
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Search failed',
                text: 'Could not reach the map search service.',
                confirmButtonColor: '#065f46',
            });
        } finally {
            setIsSearching(false);
        }
    };

    const mapCenter = mapView?.center ?? [7.9465, -1.0232];
    const mapZoom = mapView?.zoom ?? 7;

    return (
        <div className="w-full h-full flex flex-col relative" style={{ isolation: 'isolate' }}>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full max-w-md px-4">
                <form onSubmit={handleSearch} className="relative group shadow-2xl">
                    <div className={`flex items-center gap-2 p-1.5 rounded-2xl border-none backdrop-blur-md ${darkMode ? 'bg-[#002f37]/90' : 'bg-white/90'}`}>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#065f46]" />
                            <Input
                                placeholder="Search community, district, landmark..."
                                className={`pl-9 border-none bg-transparent h-10 text-sm font-bold focus:ring-0 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSearching || locating}
                            className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#065f46] text-white hover:bg-[#065f46]/90"
                        >
                            {isSearching ? 'Locating...' : 'Locate'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="hidden md:block absolute bottom-6 left-6 z-[1000] bg-white/95 dark:bg-[#002f37]/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 dark:border-white/5 max-w-xs transition-all hover:scale-105">
                <h4 className="font-black text-[11px] uppercase tracking-widest text-[#065f46] mb-3">Map Legend</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#065f46]" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Verified Farms</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Pending Audit</span>
                    </div>
                </div>
                {locating && (
                    <p className="text-[9px] font-bold text-gray-400 mt-3 uppercase tracking-widest">Finding your area...</p>
                )}
            </div>

            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                {mapView && (
                    <MapViewController
                        center={mapView.center}
                        zoom={mapView.zoom}
                        bounds={mapView.bounds ?? null}
                    />
                )}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={
                        darkMode
                            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                />

                {farmsWithCoords.map((farm) => {
                    const coords = extractFarmCoords(farm)!;
                    const name = String(farm.name ?? 'Farm');
                    const status = String(farm.status ?? 'verified');
                    const region = String(farm.region ?? agentRegion ?? 'Ghana');

                    return (
                        <Marker
                            key={String(farm._id ?? farm.id ?? name)}
                            position={[coords.lat, coords.lng]}
                            icon={L.divIcon({
                                className: 'custom-div-icon',
                                html: `<div class="w-8 h-8 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 ${status === 'active' || status === 'verified' ? 'border-[#065f46]' : 'border-amber-400'}">
                                    <div class="w-4 h-4 rounded-lg overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}" alt="farm" />
                                    </div>
                               </div>`,
                                iconSize: [32, 32],
                                iconAnchor: [16, 16],
                            })}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-[#065f46]/10 flex items-center justify-center text-[#065f46]">
                                            <Navigation className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xs text-[#002f37] uppercase">{name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{region}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <Badge className={`text-[8px] font-black tracking-widest ${status === 'active' || status === 'verified' ? 'bg-[#065f46]/10 text-[#065f46]' : 'bg-amber-100 text-amber-600'}`}>
                                            {status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default OperationalMap;
