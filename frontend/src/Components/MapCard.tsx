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
    <div style={cardStyle}>
      <h3 style={titleStyle}>Our Location</h3>
      <div style={mapContainerStyle}>
        <Map onLocationChange={handleLocationChange} />
      </div>
      {location && (
        <p style={locationTextStyle}>
          Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};


// Styling for the card and elements
const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  padding: '16px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.25rem',
  fontWeight: 500,
  marginBottom: '16px',
};

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '300px',
  overflow: 'hidden',
  borderRadius: '8px',
};

const locationTextStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '10px',
  fontSize: '0.9rem',
  color: '#555',
};

export default MapCard;
