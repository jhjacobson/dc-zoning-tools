import React, { useState } from 'react';
import Select, { components } from 'react-select';

const ZoneAutocomplete = ({ zoneLabels, onZoneChange, map }) => {
  const options = zoneLabels.map((label) => ({ value: label, label }));
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleChange = (selectedOption) => {
    onZoneChange(selectedOption?.value || '');
    setMenuIsOpen(false);
  };

  const ClearIndicator = (props) => {
    const {
      children = '✖',
      innerProps: { ref, ...restInnerProps },
    } = props;
    return (
      <components.ClearIndicator {...props}>
        <div {...restInnerProps} ref={ref}>
          {children}
        </div>
      </components.ClearIndicator>
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
