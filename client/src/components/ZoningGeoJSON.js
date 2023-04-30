// Responsible for rendering the GeoJSON layer with the zoning data.
// It takes care of styling the zones based on their labels and handles
// click events on each zone feature.
import React, { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { geoJsonStyle } from '../utils/zoningUtils';
import { zoningColors } from '../constants/zoningColors';
import { AREA_CONVERSION } from '../constants/areaConversion';
import { householdsPerSqMile } from '../constants/householdsPerSqMile';
import { area, centroid, booleanPointInPolygon } from '@turf/turf';

const ZoningGeoJSON = ({ geoJsonData, selectedZone, _setSelectedZone, updateTotalChange, ancData, compPlanData, wardData }) => {
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
      type: 'Feature',
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

    const originalZoningLabel = feature.properties.originalZoningLabel;
    const oldHouseholdsPerSqMileValue = householdsPerSqMile[originalZoningLabel] || 0;
    const oldNumberOfHouseholds = Math.round(zoneAreaInSquareMi * oldHouseholdsPerSqMileValue);
    const diff = numberOfHouseholds - oldNumberOfHouseholds;
    const changeInHouseholds = `<strong>Change in Households:</strong> ${diff}<br>`;

    return `
        <strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}<br>
        <strong>Original Zoning Label:</strong> ${originalZoningLabel}<br>
        <strong>Area:</strong> ${zoneAreaInSquareMi} mi²<br>
        <strong>Households:</strong> ${numberOfHouseholds}<br>
        ${changeInHouseholds}
      `;
  };

  const onRevertClick = (e, feature, updateTotalChange) => {
    const oldZoningLabel = feature.properties.ZONING_LABEL;
    const oldHouseholdsPerSqMileValue = householdsPerSqMile[oldZoningLabel] || 0;
    const zoneAreaInSquareMi = calculateArea(feature);
    const oldNumberOfHouseholds = Math.round(zoneAreaInSquareMi * oldHouseholdsPerSqMileValue);

    updateZoningLabel(feature, feature.properties.originalZoningLabel);

    const householdsPerSqMileValue = householdsPerSqMile[feature.properties.ZONING_LABEL] || 0;
    const numberOfHouseholds = Math.round(zoneAreaInSquareMi * householdsPerSqMileValue);
    const diff = oldNumberOfHouseholds - numberOfHouseholds;

    updateTotalChange(diff); // Update the total change in households

    e.target.setStyle(geoJsonStyle(feature, 'ZONING_LABEL', zoningColors));
    e.target.setPopupContent(generatePopupContent(feature));
  };

  const onFeatureClick = (e, feature, updateTotalChange) => {
    const currentSelectedZone = selectedZoneRef.current;
    const oldZoningLabel = feature.properties.ZONING_LABEL;
    const oldHouseholdsPerSqMileValue = householdsPerSqMile[oldZoningLabel] || 0;
    const zoneAreaInSquareMi = calculateArea(feature);
    const oldNumberOfHouseholds = Math.round(zoneAreaInSquareMi * oldHouseholdsPerSqMileValue);

    const getNameForAreaOfPoint = (point, areaData, propertyKey) => {
      const containingArea = areaData.features.find((areaFeature) => {
        const isPointInPolygon = booleanPointInPolygon(point, areaFeature);
        return isPointInPolygon;
      });
      return containingArea ? containingArea.properties[propertyKey] : null;
    };
    
    const clickedPoint = [e.latlng.lng, e.latlng.lat]; //[-77.02528059482576,38.92413562419707]
    const containingANC = getNameForAreaOfPoint(clickedPoint, ancData, "ANC_ID"); //getContainingANC(clickedPoint);
    const containingPlanningArea = getNameForAreaOfPoint(clickedPoint, compPlanData, "NAME"); //getContainingPlanningArea(clickedPoint);
    const containingWard = getNameForAreaOfPoint(clickedPoint, wardData, "NAME");

    if (currentSelectedZone) {
      updateZoningLabel(feature, currentSelectedZone);
    }

    const ancText = containingANC ? `<strong>ANC:</strong> ${containingANC}<br>` : '';
    const planningAreaText = containingPlanningArea ? `<strong>Planning Area:</strong> ${containingPlanningArea}<br>` : '';
    const wardAreaText = containingWard ? `<strong>Ward:</strong> ${containingWard}<br>` : '';

    const householdsPerSqMileValue = householdsPerSqMile[feature.properties.ZONING_LABEL] || 0;
    const numberOfHouseholds = Math.round(zoneAreaInSquareMi * householdsPerSqMileValue);
    const diff = numberOfHouseholds - oldNumberOfHouseholds;

    updateTotalChange(diff); // Update the total change in households

    e.target.setStyle(geoJsonStyle(feature, 'ZONING_LABEL', zoningColors));
    e.target.setPopupContent(`${generatePopupContent(feature)}${ancText}${planningAreaText}${wardAreaText}`);
  };

  return (
    <GeoJSON
      key="geojson-layer"
      data={geoJsonData}
      style={(feature) => geoJsonStyle(feature, 'ZONING_LABEL', zoningColors)}
      onEachFeature={(feature, layer) => {
        layer.on({
          click: (e) => onFeatureClick(e, feature, updateTotalChange),
          contextmenu: (e) => onRevertClick(e, feature, updateTotalChange), // Add this line to handle right-click events
        });
        layer.bindPopup(); // create popup
      }}
    />
  );
};

export default ZoningGeoJSON;
