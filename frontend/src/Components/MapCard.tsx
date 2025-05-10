// MapCard.tsx
import React, { useState, useEffect } from 'react';
import Map from '../map/Map'

interface MapCardProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapCard: React.FC<MapCardProps> = ({ onLocationSelect }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
    
    // Make sure onLocationSelect exists and is a function before calling
    if (typeof onLocationSelect === 'function') {
      onLocationSelect(lat, lng);
    } else {
      console.error('onLocationSelect is not a function:', onLocationSelect);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ 
        textAlign: 'center', 
        fontSize: '1.25rem', 
        fontWeight: 500, 
        marginBottom: '16px' 
      }}>
        Select Your Location
      </h3>
      <div style={{ 
        width: '100%', 
        height: '300px', 
        overflow: 'hidden', 
        borderRadius: '8px',
        border: '1px solid #ccc'
      }}>
        <Map onLocationChange={handleLocationChange} />
      </div>
      {location && (
        <p style={{ 
          textAlign: 'center', 
          marginTop: '10px', 
          fontSize: '0.9rem', 
          color: '#555' 
        }}>
          Selected Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default MapCard;