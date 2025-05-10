// src/MapCard.tsx
import React, { useState } from 'react';
import Map from '../map/Map';

interface MapCardProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapCard: React.FC<MapCardProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    onLocationSelect(lat, lng); // 🔁 Pass to parent
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 shadow-lg rounded-lg bg-white transition-all duration-300 hover:shadow-xl">
      <h3 className="text-center text-xl font-medium text-teal-700 mb-4">Our Location</h3>
      <div className="w-full h-[300px] overflow-hidden rounded-lg border border-gray-200">
        <Map onLocationChange={handleLocationChange} />
      </div>
      {location && (
        <p className="text-center mt-3 text-sm text-gray-600">
          Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default MapCard;
