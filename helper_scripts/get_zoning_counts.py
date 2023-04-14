import json

# Load the GeoJSON file
with open('../client/public/data.geojson') as f:
    geojson = json.load(f)

# Initialize an empty dictionary to hold the counts
zoning_counts = {}

# Loop through the features and count the occurrences of the "ZONING_LABEL" property
for feature in geojson['features']:
    zoning_label = feature['properties'].get('ZONING_LABEL')
    if zoning_label:
        zoning_counts[zoning_label] = zoning_counts.get(zoning_label, 0) + 1

# Print the counts
print(zoning_counts)