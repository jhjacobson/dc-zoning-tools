import json

# Load the GeoJSON file
with open('../client/public/datasets/zoning_map.geojson', 'r') as f:
    geojson_data = json.load(f)

# Load the simplified zone mapping
with open('simplified_zone_mapping.json', 'r') as f:
    zone_mapping = json.load(f)

# List of properties to delete
properties_to_delete = ['ZONING_WEB_URL','ZONING_CHANGE_NARRATIVE','ZONING_STATUS', 'IZ_DESIGNATION','ZONE_DESCRIPTION', "ZR58", "ZR16"]

# Iterate over the features in the GeoJSON and update the properties
for feature in geojson_data['features']:
    old_zone = feature['properties']['ZONING']
    if old_zone in zone_mapping:
        new_zone = zone_mapping[old_zone]
        feature['properties']['ZONING'] = new_zone
        feature['properties']['ZONING_LABEL'] = new_zone
        
    # Delete properties from the properties_to_delete list
    for prop in properties_to_delete:
        if prop in feature['properties']:
            del feature['properties'][prop]

# Save the updated GeoJSON back to a file
with open('simplified_zoning_map.geojson', 'w') as f:
    json.dump(geojson_data, f)

print("GeoJSON updated!")