// ZoningMap.js
import React, { useState, useEffect, useRef } from 'react';
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
  const mapRef = useRef(null); // Hold the map instance for programmatic access in other components
  const zoneLabels = Object.keys(zoningColors); // <-- Get the zone labels from the zoningColors object
  const [showANC, setShowANC] = useState(true); // Add a new state for showing or hiding ANC boundaries
  const [ancData, setAncData] = useState(null); // Add a new state for ANC GeoJSON data
  const [wardData, setWardData] = useState(null);
  const [totalChange, setTotalChange] = useState(0);

  const [showCompPlan, setShowCompPlan] = useState(true); // Add a new state for showing or hiding Comp Plan boundaries
  const [compPlanData, setCompPlanData] = useState(null); // Add a new state for Comp Plan GeoJSON data
  const [flumData, setFlumData] = useState(null); // Add a new state for FLUM GeoJSON data

  const updateTotalChange = (change) => {
    // @TODO: recalculate hash stuff here, it's called whenever
    // a label is changed

    setTotalChange((prevTotalChange) => prevTotalChange + change);
  };

  const fetchDataAndUpdateState = async (datasetPath, setStateFunction) => {
    const data = await fetchGeoJsonData(datasetPath);

    if (datasetPath === '/datasets/simplified_zoning_map.geojson') {
      data.features.forEach((feature) => {
        feature.properties.originalZoningLabel = feature.properties.ZONING_LABEL;
      });
    }

    // @TODO: special-case simplified_zoning_map.geojson to check
    // the state of the URL hash and override features' ZONING_LABELs
    // accordingly

    setStateFunction(data);
  };

  useEffect(() => {
    // @TODO: set up hooks for hash-management functions

    fetchDataAndUpdateState('/datasets/simplified_zoning_map.geojson', setGeoJsonData);
    fetchDataAndUpdateState(
      '/datasets/Advisory_Neighborhood_Commissions_from_2023.geojson',
      setAncData
    );
    fetchDataAndUpdateState('/datasets/Wards_from_2022.geojson', setWardData);
    fetchDataAndUpdateState('/datasets/Comprehensive_Plan_Planning_Areas.geojson', setCompPlanData);
    fetchDataAndUpdateState('/datasets/Comprehensive_Plan_in_2021.geojson', setFlumData); // Fetch FLUM data
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <MapContainer center={[38.9, -77.02]} zoom={13} style={{ height: '100%' }} ref={mapRef}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={.3}
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
          label="Planning Area"
          style={{ top: '70px', right: '10px' }} // Set the desired position for the Comp Plan toggle button
        />

        <ZoningToggle showZoning={showZoning} setShowZoning={setShowZoning} />
        {/* Add the ANCToggle component */}
        <ZoneAutocomplete
          zoneLabels={zoneLabels} // <-- Pass the zoneLabels array
          onZoneChange={(selectedZone) => setSelectedZone(selectedZone)}
          map={mapRef.current} // Pass the map instance to ZoneAutocomplete
        />
        <div
          style={{
            position: 'absolute',
            top: '100px',
            right: '10px',
            backgroundColor: 'white',
            padding: '5px',
            borderRadius: '5px',
            zIndex: 1000, // Add a high z-index value to make sure it's displayed on top
          }}
        >
          Total Change in Households: {totalChange}
        </div>
        {showZoning && geoJsonData && (
          <ZoningGeoJSON
            geoJsonData={geoJsonData}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zoningColors={zoningColors} // Pass the zoningColors object
            updateTotalChange={updateTotalChange}
            ancData={ancData}
            compPlanData={compPlanData}
            wardData={wardData}
            flumData={flumData}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;
