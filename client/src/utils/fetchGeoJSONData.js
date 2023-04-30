// utils/fetchGeoJSONData.js
export const fetchGeoJsonData = async (filePath) => {
  const response = await fetch(filePath);
  const data = await response.json();
  return data;
};
