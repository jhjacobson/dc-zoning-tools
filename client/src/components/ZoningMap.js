// Main component that renders the map, the zoning data as a GeoJSON layer, 
// the zoning toggle, and the "Select a Zone" dropdown menu. It also handles 
// the logic for changing the zone of a clicked area on the map.
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchGeoJsonData } from '../utils/fetchGeoJSONData';
import ZoningGeoJSON from './ZoningGeoJSON';
import ZoningToggle from './ZoningToggle';
import ZoneSelector from './ZoneSelector';

const ZoningMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showZoning, setShowZoning] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    fetchGeoJsonData().then((data) => {
      setGeoJsonData(data);
    });
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer center={[38.9, -77.02]} zoom={13} style={{ height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      {geoJsonData && (
        <>
          {showZoning && (
            <ZoningGeoJSON
              geoJsonData={geoJsonData}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone} // <-- pass the setSelectedZone function
            />
          )}
          <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
          <ZoneSelector setSelectedZone={setSelectedZone} />
        </>
      )}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;
