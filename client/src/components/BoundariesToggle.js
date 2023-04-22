import React from 'react';

const BoundariesToggle = ({ showBoundaries, setShowBoundaries, label, style }) => {
  const handleToggleClick = () => {
    setShowBoundaries(!showBoundaries);
  };

  return (
    <div style={{ position: 'absolute', zIndex: 1000, ...style }}>
      <button onClick={handleToggleClick}>
        {showBoundaries ? `Hide ${label} Boundaries` : `Show ${label} Boundaries`}
      </button>
    </div>
  );
};

export default BoundariesToggle;
