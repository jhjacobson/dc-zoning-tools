import React from 'react';

const ZoningToggle = ({ showZoning, setShowZoning }) => {
  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
      <label htmlFor="toggle-zoning">Toggle zoning data</label>
      <input
        id="toggle-zoning"
        type="checkbox"
        checked={showZoning}
        onChange={(e) => setShowZoning(e.target.checked)}
      />
    </div>
  );
};

export default ZoningToggle;
