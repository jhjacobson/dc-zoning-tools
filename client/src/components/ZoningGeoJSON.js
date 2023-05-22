// Responsible for rendering the GeoJSON layer with the zoning data.
// It takes care of styling the zones based on their labels and handles
// click events on each zone feature.
import React, { useRef, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { geoJsonStyle } from '../utils/zoningUtils';
import { zoningColors } from '../constants/zoningColors';
import { AREA_CONVERSION } from '../constants/areaConversion';
import { householdsPerSqMile } from '../constants/householdsPerSqMile';
import { area, booleanPointInPolygon } from '@turf/turf';

const ZoningGeoJSON = ({
  geoJsonData,
  selectedZone,
  _setSelectedZone,
  updateTotalChange,
  ancData,
  compPlanData,
  wardData,
  flumData
}) => {
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
  const getNameForAreaOfPoint = (point, areaData, propertyKey) => {
    const containingArea = areaData.features.find((areaFeature) => {
      const isPointInPolygon = booleanPointInPolygon(point, areaFeature);
      return isPointInPolygon;
    });
    return containingArea ? containingArea.properties[propertyKey] : null;
  };

  const updateFeaturePopupAndStyle = (e, feature, updateTotalChange, newZoningLabel = null) => {
    const oldZoningLabel = feature.properties.ZONING_LABEL;
    const oldHouseholdsPerSqMileValue = householdsPerSqMile[oldZoningLabel] || 0;
    const zoneAreaInSquareMi = calculateArea(feature);
    const oldNumberOfHouseholds = Math.round(zoneAreaInSquareMi * oldHouseholdsPerSqMileValue);

    const clickedPoint = [e.latlng.lng, e.latlng.lat];
    const containingANC = getNameForAreaOfPoint(clickedPoint, ancData, 'ANC_ID');
    const containingPlanningArea = getNameForAreaOfPoint(clickedPoint, compPlanData, 'NAME');
    const containingWard = getNameForAreaOfPoint(clickedPoint, wardData, 'NAME');
    const containingFLUM = getNameForAreaOfPoint(clickedPoint, flumData, 'ALLCODES');

    if (newZoningLabel) {
      updateZoningLabel(feature, newZoningLabel);
    }

    const ancText = containingANC ? `<strong>ANC:</strong> ${containingANC}<br>` : '';
    const planningAreaText = containingPlanningArea
      ? `<strong>Planning Area:</strong> ${containingPlanningArea}<br>`
      : '';
    const wardAreaText = containingWard ? `<strong>Ward:</strong> ${containingWard}<br>` : '';
    const flumAreaText = containingFLUM ? `<strong>FLUM:</strong> ${containingFLUM}<br>` : '';
    //const flumAreaText = "test";

    const householdsPerSqMileValue = householdsPerSqMile[feature.properties.ZONING_LABEL] || 0;
    const numberOfHouseholds = Math.round(zoneAreaInSquareMi * householdsPerSqMileValue);
    const diff = numberOfHouseholds - oldNumberOfHouseholds;

    updateTotalChange(diff); // Update the total change in households

    e.target.setStyle(geoJsonStyle(feature, 'ZONING_LABEL', zoningColors));
    e.target.setPopupContent(
      `${generatePopupContent(feature)}${ancText}${planningAreaText}${wardAreaText}${flumAreaText}`
    );
  };

  const onRevertClick = (e, feature, updateTotalChange) => {
    updateFeaturePopupAndStyle(
      e,
      feature,
      updateTotalChange,
      feature.properties.originalZoningLabel
    );
  };

  const onFeatureClick = (e, feature, updateTotalChange) => {
    const currentSelectedZone = selectedZoneRef.current;
    if (currentSelectedZone) {
      updateFeaturePopupAndStyle(e, feature, updateTotalChange, currentSelectedZone);
    } else {
      updateFeaturePopupAndStyle(e, feature, updateTotalChange);
    }
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
