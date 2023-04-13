import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { getColorByLabel, geoJsonStyle } from '../utils/zoningUtils';

const onFeatureClick = () => {};

const ZoningGeoJSON = ({ geoJsonData }) => {
  return (
    <GeoJSON
      key="geojson-layer"
      data={geoJsonData}
      style={geoJsonStyle}
      onEachFeature={(feature, layer) => {
        console.log('Feature properties:', feature.properties);
        layer.on({
          click: onFeatureClick,
        });
        layer.bindPopup(`<strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}`);
      }}
    />
  );
};

export default ZoningGeoJSON;