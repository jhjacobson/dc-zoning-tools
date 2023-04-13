import { zoningColors } from '../constants/zoningColors';

export const getColorByLabel = (label) => zoningColors[label];

export const geoJsonStyle = (feature) => {
  return {
    fillColor: getColorByLabel(feature.properties.ZONING_LABEL),
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.5,
  };
};