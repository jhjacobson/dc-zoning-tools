// ZoningMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchGeoJsonData } from '../utils/fetchGeoJSONData';
import ZoningGeoJSON from './ZoningGeoJSON';
import ZoningToggle from './ZoningToggle';
import ZoneAutocomplete from './ZoneAutocomplete';
import { zoningColors } from '../constants/zoningColors'; // <-- Import the zoningColors object

const ZoningMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showZoning, setShowZoning] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const zoneLabels = Object.keys(zoningColors); // <-- Get the zone labels from the zoningColors object

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
                setSelectedZone={setSelectedZone}
              />
            )}
            <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
            <ZoneAutocomplete
              zoneLabels={zoneLabels} // <-- Pass the zoneLabels array
              onZoneChange={(selectedZone) => setSelectedZone(selectedZone)}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;
