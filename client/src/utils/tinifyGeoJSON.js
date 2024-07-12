// sample invocation:
// for f in ../../public/datasets/*.geojson; do node tinifyGeoJSON.js "$f" > "${f}.new" && mv "${f}.new" "$f"; done

const fs = require('fs');
const turf = require('@turf/turf');

const filename = process.argv[2];
const geojson = JSON.parse(fs.readFileSync(filename, 'utf8'));

// Process each feature in the feature collection
geojson.features = geojson.features.map(feature => {
  feature = turf.truncate(feature, { precision: 6, coordinates: 2 });

  // Keep only the specified properties if command line arg is specified
  let newProperties = feature.properties;
  if (process.argv[3]) {
    const properties = process.argv[3].split(',');
    properties.forEach(prop => {
      if (feature.properties[prop]) {
        newProperties[prop] = feature.properties[prop];
      }
    });
  }

  // Return the modified feature
  return {
    ...feature,
    properties: newProperties
  };
});

console.log(JSON.stringify(geojson));