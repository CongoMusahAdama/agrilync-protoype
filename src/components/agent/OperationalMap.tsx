import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';

import { Badge } from '@/components/ui/badge';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface OperationalMapProps {
    farms: any[];
    darkMode: boolean;
}

// Component to update map view when center changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const OperationalMap: React.FC<OperationalMapProps> = ({ farms, darkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number]>([7.9465, -1.0232]); // Center of Ghana
    const [zoom, setZoom] = useState(7);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', Ghana')}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
                setMapCenter(newCenter);
                setZoom(13);
                Swal.fire({
                    icon: 'success',
                    title: 'Location Discovered',
                    text: `Located: ${data[0].display_name.split(',')[0]}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: darkMode ? '#002f37' : '#fff',
                    color: darkMode ? '#fff' : '#002f37'
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Location Unknown',
                    text: 'The search query did not match any markers in the Ghana registry.',
                    confirmButtonColor: '#065f46'
                });
            }
        } catch (error) {
            console.error('Search error:', error);
            Swal.fire({
                icon: 'error',
                title: 'GIS Error',
                text: 'Could not communicate with the global positioning service.',
                confirmButtonColor: '#065f46'
            });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col relative" style={{ isolation: 'isolate' }}>
            {/* Search Bar Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full max-w-md px-4">
                <form onSubmit={handleSearch} className="relative group shadow-2xl">
                    <div className={`flex items-center gap-2 p-1.5 rounded-2xl border-none backdrop-blur-md ${darkMode ? 'bg-[#002f37]/90' : 'bg-white/90'}`}>
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-[#065f46]' : 'text-[#065f46]'}`} />
                            <Input
                                placeholder="Search location (e.g. Apremdo, Kumasi)..."
                                className={`pl-9 border-none bg-transparent h-10 text-sm font-bold focus:ring-0 ${darkMode ? 'text-white' : 'text-[#002f37]'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isSearching}
                            className={`h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest ${darkMode ? 'bg-[#065f46] text-white hover:bg-[#065f46]/90' : 'bg-[#065f46] text-white hover:bg-[#065f46]/90'}`}
                        >
                            {isSearching ? 'Locating...' : 'Locate'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Map Legend (Hidden on Mobile) */}
            <div className="hidden md:block absolute bottom-6 left-6 z-[1000] bg-white/95 dark:bg-[#002f37]/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100 dark:border-white/5 max-w-xs transition-all hover:scale-105">
                <h4 className="font-black text-[11px] uppercase tracking-widest text-[#065f46] dark:text-[#065f46] mb-3">Map Legend</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#065f46]"></span>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Verified Farms</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Pending Audit</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#065f46] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">Active Missions</span>
                    </div>
                </div>
            </div>

            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <ChangeView center={mapCenter} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={darkMode 
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                />
                
                {farms.map((farm: any) => {
                    const lat = farm.latitude || farm.gpsCoordinates?.lat || (farm.location?.coordinates?.[1]);
                    const lng = farm.longitude || farm.gpsCoordinates?.lng || (farm.location?.coordinates?.[0]);
                    
                    if (!lat || !lng) return null;

                    return (
                        <Marker 
                            key={farm._id || farm.id} 
                            position={[lat, lng]}
                            icon={L.divIcon({
                                className: 'custom-div-icon',
                                html: `<div class="w-8 h-8 rounded-2xl bg-white shadow-xl flex items-center justify-center border-2 ${farm.status === 'active' || farm.status === 'verified' ? 'border-[#065f46]' : 'border-amber-400'}">
                                            <div class="w-4 h-4 rounded-lg overflow-hidden">
                                                <img src="https://api.dicebear.com/7.x/initials/svg?seed=${farm.name}" alt="farm" />
                                            </div>
                                       </div>`,
                                iconSize: [32, 32],
                                iconAnchor: [16, 16]
                            })}
                        >
                            <Popup className="custom-popup">
                                <div className="p-2 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-[#065f46]/10 flex items-center justify-center text-[#065f46]">
                                            <Navigation className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xs text-[#002f37] uppercase">{farm.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase">{farm.region || 'Ghana Operation'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <Badge className={`text-[8px] font-black tracking-widest ${farm.status === 'active' || farm.status === 'verified' ? 'bg-[#065f46]/10 text-[#065f46]' : 'bg-amber-100 text-amber-600'}`}>
                                            {farm.status?.toUpperCase() || 'VERIFIED'}
                                        </Badge>
                                        <span className="text-[9px] font-bold text-gray-500">85% HEALTH</span>
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
