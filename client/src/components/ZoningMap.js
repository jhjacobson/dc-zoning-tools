// ZoningMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchGeoJsonData } from '../utils/fetchGeoJSONData';
import ZoningGeoJSON from './ZoningGeoJSON';
import ZoningToggle from './ZoningToggle';
import ZoneAutocomplete from './ZoneAutocomplete';
import { zoningColors } from '../constants/zoningColors';
import BoundariesGeoJSON from './BoundariesGeoJSON'; // Import the new component
import BoundariesToggle from './BoundariesToggle'; // Import the new component

const ZoningMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showZoning, setShowZoning] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [map, setMap] = useState(null); // Add a new state for the map instance
  const zoneLabels = Object.keys(zoningColors); // <-- Get the zone labels from the zoningColors object
  const [showANC, setShowANC] = useState(true); // Add a new state for showing or hiding ANC boundaries
  const [ancData, setAncData] = useState(null); // Add a new state for ANC GeoJSON data

  const [showCompPlan, setShowCompPlan] = useState(true); // Add a new state for showing or hiding Comp Plan boundaries
  const [compPlanData, setCompPlanData] = useState(null); // Add a new state for Comp Plan GeoJSON data

  useEffect(() => {
    fetchGeoJsonData('/datasets/zoning_map.geojson').then((data) => {
      // Store original zoning labels
      data.features.forEach((feature) => {
        feature.properties.originalZoningLabel = feature.properties.ZONING_LABEL;
      });
      setGeoJsonData(data);
    });

    fetchGeoJsonData('/datasets/Advisory_Neighborhood_Commissions_from_2023.geojson').then((data) => {
      setAncData(data);
    });

    fetchGeoJsonData('/datasets/Comprehensive_Plan_Planning_Areas.geojson').then((data) => {
      setCompPlanData(data);
    });
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
        {showANC && ancData && (
          <BoundariesGeoJSON
            geoJsonData={ancData}
            color="red" // Set the desired boundary color for ANC
          />
        )}
        <BoundariesToggle
          showBoundaries={showANC}
          setShowBoundaries={setShowANC}
          label="ANC"
          style={{ top: '40px', right: '10px' }} // Set the desired position for the ANC toggle button
        />
        {showCompPlan && compPlanData && (
          <BoundariesGeoJSON
            geoJsonData={compPlanData}
            color="blue" // Set the desired boundary color for Comp Plan
          />
        )}
        <BoundariesToggle
          showBoundaries={showCompPlan}
          setShowBoundaries={setShowCompPlan}
          label="Comp Plan"
          style={{ top: '70px', right: '10px' }} // Set the desired position for the Comp Plan toggle button
        />

        <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
        {/* Add the ANCToggle component */}
        <ZoneAutocomplete
          zoneLabels={zoneLabels} // <-- Pass the zoneLabels array
          onZoneChange={(selectedZone) => setSelectedZone(selectedZone)}
          map={map} // Pass the map instance to ZoneAutocomplete
        />
        {showZoning && geoJsonData && (
          <ZoningGeoJSON
            geoJsonData={geoJsonData}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zoningColors={zoningColors} // Pass the zoningColors object
          />
        )}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;
