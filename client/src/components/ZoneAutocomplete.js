import React, { useEffect } from 'react';
import Select, { components } from 'react-select';

const ZoneAutocomplete = ({ zoneLabels, onZoneChange, map }) => {
  console.log('Received map prop in ZoneAutocomplete:', map);
  const options = zoneLabels.map((label) => ({ value: label, label }));

  const stopScrollPropagation = (e) => {
    console.log('stopScrollPropagation called', e.target);
    e.stopPropagation();
    // Optionally, prevent the default to stop any default behavior as well
    e.preventDefault();
  };

  const handleMenuOpen = () => {
    console.log('Menu opened and before if statement');
    console.log('value of map is: ', map)
    if (map) {
      console.log('Menu opened and after if statement');
      // Disable map interactions
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      // Additional interactions can be disabled as needed
      setTimeout(() => {
        const menuOuter = document.querySelector('.Select-menu-outer');
        if (menuOuter) {
          console.log('Menu outer found:', menuOuter)
          menuOuter.addEventListener('wheel', stopScrollPropagation);
          menuOuter.addEventListener('mousedown', stopScrollPropagation); // Prevent map from capturing clicks
        }
      }, 10);
    }
  };
  

  const handleMenuClose = () => {
    console.log('Menu closed and before if statement');
    if (map) {
      console.log('Menu closed and after if statement');
      // Enable map interactions
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      // Additional interactions can be enabled as needed
      const menuOuter = document.querySelector('.Select-menu-outer');
      if (menuOuter) {
        console.log('Menu outer found in handleMenuClose', menuOuter)
        menuOuter.removeEventListener('wheel', stopScrollPropagation);
        menuOuter.removeEventListener('mousedown', stopScrollPropagation); // Allow map to capture clicks again
      }
    }
  };
  

  useEffect(() => {
    // Clean up the event listener when the component is unmounted
    return () => {
      const menuOuter = document.querySelector('.Select-menu-outer');
      if (menuOuter) {
        console.log('Cleanup: removing event listeners', menuOuter)
        menuOuter.removeEventListener('wheel', stopScrollPropagation);
      }
    };
  }, []);

  const handleChange = (selectedOption) => {
    console.log('Zone selected:', selectedOption);
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
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        isClearable
        components={{ ClearIndicator }}
      />
    </div>
  );
};

export default ZoneAutocomplete;
