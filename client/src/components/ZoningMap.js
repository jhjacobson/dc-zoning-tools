import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const getColorByLabel = (label) => {
    switch (label) {
      case 'MU-4':
        return 'green';
      case 'RA-2':
        return 'blue';
      case 'RF-1':
        return 'yellow';
      case 'UNZONED':
        return 'gray';
      case 'NC-7':
        return '#02a7a8';
      case 'ARTS-3':
        return '#0246a8';
      case 'ARTS-4':
        return '#5402a7';
      case 'RA-4':
        return '#6b02a6';
      case 'MU-5A':
        return '#02a69b';
      default:
        return 'gray';
    }
  };

const geoJsonStyle = (feature) => {
return {
    fillColor: getColorByLabel(feature.properties.ZONING_LABEL),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5,
};
};

const onFeatureClick = () => {};

const ZoningMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/data.geojson');
      const data = await response.json();
      setGeoJsonData(data);
    }
    fetchData();
  }, []);

  return (
    <MapContainer center={[38.9, -77.02]} zoom={13} style={{ height: "100vh", width: "100%" }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {geoJsonData && (
      <GeoJSON
        key="geojson-layer"
        data={geoJsonData}
        style={geoJsonStyle}
        onEachFeature={(feature, layer) => {
          console.log("Feature properties:", feature.properties)
          layer.on({
            click: onFeatureClick,
          });
          layer.bindPopup(`<strong>Zoning Label:</strong> ${feature.properties.ZONING_LABEL}`);
        }}
      />
    )}
  </MapContainer>
  );
};

export default ZoningMap;