// ZoningMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchGeoJsonData } from '../utils/fetchGeoJSONData';
import ZoningGeoJSON from './ZoningGeoJSON';
import ZoningToggle from './ZoningToggle';
import ZoneAutocomplete from './ZoneAutocomplete';
import { zoningColors } from '../constants/zoningColors';
import ANCBoundariesGeoJSON from './ANCBoundariesGeoJSON';
import ANCToggle from './ANCToggle';

const ZoningMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showZoning, setShowZoning] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [map, setMap] = useState(null); // Add a new state for the map instance
  const zoneLabels = Object.keys(zoningColors); // <-- Get the zone labels from the zoningColors object
  const [ancBoundariesData, setAncBoundariesData] = useState(null); // Add a new state for ANC boundaries data
  const [showANC, setShowANC] = useState(true); // Add a new state for showing or hiding ANC boundaries


  useEffect(() => {
    // Fetch the zoning map GeoJSON data
    fetchGeoJsonData('/datasets/zoning_map.geojson').then((data) => {
      setGeoJsonData(data);
    });

    // Fetch the ANC boundaries GeoJSON data
    fetchGeoJsonData('/datasets/Advisory_Neighborhood_Commissions_from_2023.geojson').then(
      (data) => {
        setAncBoundariesData(data);
      }
    );
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer 
        center={[38.9, -77.02]} 
        zoom={13} 
        style={{ height: '100%' }}
        whenCreated={setMap} // Add the whenCreated prop to set the map instance
        >
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
                zoningColors={zoningColors} // Pass the zoningColors object
              />
            )}
            {ancBoundariesData && showANC && <ANCBoundariesGeoJSON geoJsonData={ancBoundariesData} />}
            <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
            {/* Add the ANCToggle component */}
            <ANCToggle showANC={showANC} setShowANC={setShowANC} />
            <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
            <ZoneAutocomplete
              zoneLabels={zoneLabels} // <-- Pass the zoneLabels array
              onZoneChange={(selectedZone) => setSelectedZone(selectedZone)}
              map={map} // Pass the map instance to ZoneAutocomplete
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;