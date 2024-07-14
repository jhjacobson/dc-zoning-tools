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

// hash generation stuff
import pako from 'pako';
import { Buffer } from 'buffer';

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
    // recalculate URL hash whenever the total is changed
    // the hash decodes to an array. the last val is the population change. the others are arrays of object ids
    // each slot in the top-level array corresponds to a zoneLabels index
    // so each sub-array of the hash is a list of object ids for features that should have their zone label
    // changed to something other than the default
    let allDefaults = true;
    const nondefaultState = geoJsonData.features.reduce((prev, feature) => {
      if (feature.properties.ZONING_LABEL !== feature.properties.originalZoningLabel) {
        prev[zoneLabels.indexOf(feature.properties.ZONING_LABEL)].push(feature.properties.OBJECTID);
        allDefaults = false;
      }
      return prev;
    }, new Array(zoneLabels.length).fill().map(() => []));
    nondefaultState.push(totalChange + change);
    window.location.hash = allDefaults ? '' : Buffer.from(pako.gzip(JSON.stringify(nondefaultState))).toString('base64');

    // this queues a state change but doesn't perform it synchronously, which is why we can't use the
    // state directly in the hash calculation above
    setTotalChange((prevTotalChange) => prevTotalChange + change);
  };

  const fetchDataAndUpdateState = async (datasetPath, setStateFunction) => {
    const data = await fetchGeoJsonData(datasetPath);

    if (datasetPath === '/datasets/simplified_zoning_map.geojson') {
      // override zoning labels if a hash is present
      // this only works when the map is loaded, not when the hash is updated
      // doing the latter would require a lot more react surgery and doesn't seem that useful anyway
      let nondefaults = {};
      if (window.location.hash) {
        const decodedHash = JSON.parse(pako.ungzip(Buffer.from(window.location.hash.slice(1), 'base64'), { to: 'string' }));
        const popChange = parseInt(decodedHash.pop());
        setTotalChange(popChange);
        nondefaults = decodedHash.reduce((prev, zoneLabelArray, zoneLabelIndex) => {
          zoneLabelArray.forEach((objectId) => {
            prev[objectId] = zoneLabels[zoneLabelIndex];
          });
          return prev;
        }, {});
      }

      data.features.forEach((feature) => {
        feature.properties.originalZoningLabel = feature.properties.ZONING_LABEL;
        if (nondefaults[feature.properties.OBJECTID]) {
          feature.properties.ZONING_LABEL = nondefaults[feature.properties.OBJECTID];
        }
      });
    }

    setStateFunction(data);
  };

  useEffect(() => {
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
