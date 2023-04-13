export const fetchGeoJsonData = async () => {
    const response = await fetch('/data.geojson');
    const data = await response.json();
    return data;
  };