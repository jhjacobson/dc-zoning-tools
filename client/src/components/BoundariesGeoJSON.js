import React from 'react';
import { GeoJSON } from 'react-leaflet';

const BoundariesGeoJSON = ({ geoJsonData, color }) => {
  return (
    <GeoJSON
      key="boundary-geojson-layer"
      data={geoJsonData}
      style={{
        weight: 1,
        opacity: 1,
        color: color,
        fillOpacity: 0,
      }}
    />
  );
};

export default BoundariesGeoJSON;
