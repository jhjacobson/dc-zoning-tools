import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geoJsonStyle = {
  fillColor: "blue",
  weight: 1,
  opacity: 1,
  color: "white",
  fillOpacity: 0.5,
};

function App() {
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
    <div className="App">
      <MapContainer center={[38.9, -77.02]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData && <GeoJSON key="geojson-layer" data={geoJsonData} style={geoJsonStyle} />}
      </MapContainer>
    </div>
  );
}

export default App;
