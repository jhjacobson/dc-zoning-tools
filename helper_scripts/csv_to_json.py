import csv
import json

def csv_to_json_object(csv_filepath, json_filepath):
    """Convert a CSV file to a single JSON object."""
    data = {}

    with open(csv_filepath, 'r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for row in csv_reader:
            key = row[0]
            value = row[1]
            data[key] = value

    with open(json_filepath, 'w') as json_file:
        json.dump(data, json_file, indent=4)

csv_to_json_object('simplified_zone_mapping.csv', 'simplified_zone_mapping.json')
