export const getColorByLabel = (label, colorMapping) => colorMapping[label];

export const geoJsonStyle = (feature, propertyName, colorMapping) => {
  return {
    fillColor: getColorByLabel(feature.properties[propertyName], colorMapping),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5,
  };
};
