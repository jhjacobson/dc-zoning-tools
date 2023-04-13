import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { zoningColors } from './zoningColors';


const getColorByLabel = (label) => zoningColors[label];

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
  const [showZoning, setShowZoning] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/data.geojson');
      const data = await response.json();
      setGeoJsonData(data);
    }
    fetchData();
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer center={[38.9, -77.02]} zoom={13} style={{ height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <>
            {showZoning && (
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
            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
              <label htmlFor="toggle-zoning">Toggle zoning data</label>
              <input
                id="toggle-zoning"
                type="checkbox"
                checked={showZoning}
                onChange={(e) => setShowZoning(e.target.checked)}
              />
            </div>
          </>
        )}
        {!geoJsonData && <p>Loading data...</p>}
      </MapContainer>
    </div>
  );
};

export default ZoningMap;
