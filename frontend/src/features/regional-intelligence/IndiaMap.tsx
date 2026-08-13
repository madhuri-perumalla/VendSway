// ============================================================================
// INDIA MAP COMPONENT
// ============================================================================
// Interactive India map using React Leaflet

import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet';
import { Region } from '@/types/domain';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IndiaMapProps {
  regions: Region[];
  selectedRegion: Region | null;
  onRegionSelect: (region: Region) => void;
}

const IndiaMap = ({ regions, selectedRegion, onRegionSelect }: IndiaMapProps) => {
  const center: [number, number] = [20.5937, 78.9629]; // Center of India
  const zoom = 5;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {regions.map((region) => (
          <CircleMarker
            key={region.id}
            center={[region.centerLat, region.centerLng]}
            radius={30}
            pathOptions={{
              color: selectedRegion?.id === region.id ? '#0ea5e9' : '#6b7280',
              fillColor: selectedRegion?.id === region.id ? '#0ea5e9' : '#9ca3af',
              fillOpacity: 0.5,
              weight: 2,
            }}
            eventHandlers={{
              click: () => onRegionSelect(region),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-gray-900">{region.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{region.description}</p>
                <button
                  onClick={() => onRegionSelect(region)}
                  className="mt-2 px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IndiaMap;
