import React from 'react';

const ZoneSelector = ({ setSelectedZone }) => {
  const zoneLabels = ['ARTS-1', 'RF-1', 'MU-5A','MU-14', 'RA-2']; // Update this array with the actual zoning labels

  return (
    <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 1000 }}>
      <label htmlFor="zone-selector">Select a Zone: </label>
      <select id="zone-selector" onChange={(e) => setSelectedZone(e.target.value)}>
        <option value="">--Select a zone--</option>
        {zoneLabels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ZoneSelector;