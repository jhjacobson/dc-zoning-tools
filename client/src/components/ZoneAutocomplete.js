import React, { useState } from 'react';
import Select from 'react-select';

const ZoneAutocomplete = ({ zoneLabels, onZoneChange, map }) => {
  const options = zoneLabels.map((label) => ({ value: label, label }));
  const [menuIsOpen, setMenuIsOpen] = useState(false);


  const handleChange = (selectedOption) => {
    onZoneChange(selectedOption?.value || '');
  };

  const ClearIndicator = (props) => {
    const {
      children = '✖',
      getStyles,
      innerProps: { ref, ...restInnerProps }
    } = props;
    return (
      <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
        {children}
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 50,
        zIndex: 1000,
        width: '250px',
      }}
    >
      <Select
        placeholder="Select a zoning label..."
        options={options}
        onChange={handleChange}
        onFocus={() => {
          setMenuIsOpen(true);
          if (map) {
            map.dragging.disable();
            map.scrollWheelZoom.disable();
          }
        }}
        onBlur={() => {
          setTimeout(() => setMenuIsOpen(false), 200);
          if (map) {
            map.dragging.enable();
            map.scrollWheelZoom.enable();
          }
        }}
        menuIsOpen={menuIsOpen}
        isClearable
        components={{ ClearIndicator }}
      />
    </div>
  );
};

export default ZoneAutocomplete;
