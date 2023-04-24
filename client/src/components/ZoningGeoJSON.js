// Responsible for rendering the GeoJSON layer with the zoning data. 
// It takes care of styling the zones based on their labels and handles 
// click events on each zone feature.
import React, { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { geoJsonStyle } from '../utils/zoningUtils';
import { zoningColors } from '../constants/zoningColors';
import { area } from '@turf/turf';
import { AREA_CONVERSION } from "../constants/areaConversion";
import { householdsPerSqMile } from '../constants/householdsPerSqMile';

const ZoningGeoJSON = ({ geoJsonData, selectedZone, setSelectedZone }) => {
    const selectedZoneRef = useRef(selectedZone); // <-- create a ref for selectedZone
    // Update the ref's current value whenever selectedZone changes
    useEffect(() => {
      selectedZoneRef.current = selectedZone;
    }, [selectedZone]);
  
    const updateZoningLabel = (feature, label) => {
      feature.properties.ZONING_LABEL = label;
    };

    const calculateArea = (feature) => {
      const geoJsonFeature = {
        type: "Feature",
        geometry: feature.geometry,
        properties: feature.properties,
      };
      const zoneArea = area(geoJsonFeature);
      return (zoneArea * AREA_CONVERSION.SQ_M_TO_SQ_MI).toFixed(2);
    };

    const generatePopupContent = (feature) => {
      const zoneAreaInSquareMi = calculateArea(feature);
      const householdsPerSqMileValue = householdsPerSqMile[feature.properties.ZONING_LABEL] || 0;
      const numberOfHouseholds = Math.round(zoneAreaInSquareMi * householdsPerSqMileValue);
      return `
        <strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}<br>
        <strong>Area:</strong> ${zoneAreaInSquareMi} mi²<br>
        <strong>Households:</strong> ${numberOfHouseholds}
    `;
    };

    const onRevertClick = (e, feature) => {
      updateZoningLabel(feature, feature.properties.originalZoningLabel);
      e.target.setStyle(geoJsonStyle(feature, 'ZONING_LABEL', zoningColors));
      e.target.setPopupContent(generatePopupContent(feature));
    };

    const onFeatureClick = (e, feature) => {
      const currentSelectedZone = selectedZoneRef.current; // <-- get the current value of the ref
      if (currentSelectedZone) {
        updateZoningLabel(feature, currentSelectedZone);
      }
      e.target.setStyle(geoJsonStyle(feature, 'ZONING_LABEL', zoningColors));
      e.target.setPopupContent(generatePopupContent(feature));
    };
  
    return (
      <GeoJSON
        key="geojson-layer"
        data={geoJsonData}
        style={(feature) => geoJsonStyle(feature, 'ZONING_LABEL', zoningColors)}
        onEachFeature={(feature, layer) => {
          layer.on({
            click: (e) => onFeatureClick(e, feature),
            contextmenu: (e) => onRevertClick(e, feature), // Add this line to handle right-click events
          });
          layer.bindPopup(); // create popup
        }}
      />
    );
  };
  
  export default ZoningGeoJSON;
  