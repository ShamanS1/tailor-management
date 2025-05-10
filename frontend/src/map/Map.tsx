// src/map/Map.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onLocationChange: (lat: number, lng: number) => void;
}

// Fix for marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

const ClickHandler = ({ onClick }: { onClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const Map: React.FC<MapProps> = ({ onLocationChange }) => {
  const [initialLocation, setInitialLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setInitialLocation({ latitude, longitude });
        setSelectedLocation({ latitude, longitude });
        onLocationChange(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, [onLocationChange]);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    onLocationChange(lat, lng);
  };

  const center = selectedLocation || initialLocation || { latitude: 51.505, longitude: -0.09 };

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={13}
      style={{ width: '100%', height: '300px', borderRadius: '8px' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <ClickHandler onClick={handleMapClick} />

      {selectedLocation && (
        <>
          <RecenterMap lat={selectedLocation.latitude} lng={selectedLocation.longitude} />
          <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
            <Popup>Selected Location</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
};

export default Map;
