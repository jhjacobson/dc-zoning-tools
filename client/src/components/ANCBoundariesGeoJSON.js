import React from 'react';
import { GeoJSON } from 'react-leaflet';

const ANCBoundariesGeoJSON = ({ geoJsonData }) => {
  const ancBoundaryStyle = {
    color: 'blue',
    weight: 2,
    opacity: 1,
    fill: false,
  };

  return (
    <GeoJSON key="anc-boundary-layer" data={geoJsonData} style={ancBoundaryStyle} />
  );
};

export default ANCBoundariesGeoJSON;
