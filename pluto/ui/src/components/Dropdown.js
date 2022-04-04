import React from 'react';
import PropTypes from 'prop-types';

function Dropdown({
  selectText, menuItems, selectedObjectName, handleChange,
}) {
  return (
    <select value={selectedObjectName} className="form-control" onChange={event => handleChange(event.target.value, menuItems)}>
      <option value="select">{selectText}</option>
      {menuItems.map((object, i) => <option key={i} value={object.value}>{object.displayText}</option>)}
    </select>
  );
}

Dropdown.propTypes = {
  selectText: PropTypes.string.isRequired,
  menuItems: PropTypes.array.isRequired,
  selectedObjectName: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Dropdown;
