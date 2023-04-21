import React from 'react';

const ANCToggle = ({ showANC, setShowANC }) => {
  const handleToggleClick = () => {
    setShowANC(!showANC);
  };

  return (
    <div style={{ position: 'absolute', top: '50px', right: '10px', zIndex: 1000 }}>
      <button onClick={handleToggleClick}>{showANC ? 'Hide ANC Boundaries' : 'Show ANC Boundaries'}</button>
    </div>
  );
};

export default ANCToggle;
