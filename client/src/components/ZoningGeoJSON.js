// Responsible for rendering the GeoJSON layer with the zoning data. 
// It takes care of styling the zones based on their labels and handles 
// click events on each zone feature.
import React, { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { getColorByLabel, geoJsonStyle } from '../utils/zoningUtils';

const ZoningGeoJSON = ({ geoJsonData, selectedZone, setSelectedZone }) => {
    const selectedZoneRef = useRef(selectedZone); // <-- create a ref for selectedZone
  
    // Update the ref's current value whenever selectedZone changes
    useEffect(() => {
      selectedZoneRef.current = selectedZone;
    }, [selectedZone]);
  
    const onFeatureClick = (e, feature) => {
      const currentSelectedZone = selectedZoneRef.current; // <-- get the current value of the ref
      console.log('In feature click test');
      console.log(`Selected zone is ${currentSelectedZone}`);
  
      if (currentSelectedZone) {
        console.log('Changing zoning label to:', currentSelectedZone); // Add this log
        feature.properties.ZONING_LABEL = currentSelectedZone;
        e.target.setStyle(geoJsonStyle(feature));
        e.target.setPopupContent(`<strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}`);
      }
    };
  
    return (
      <GeoJSON
        key="geojson-layer"
        data={geoJsonData}
        style={geoJsonStyle}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: (e) => onFeatureClick(e, feature),
          });
          layer.bindPopup(`<strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}`);
        }}
      />
    );
  };
  
  export default ZoningGeoJSON;
  