import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Dropdown from '../Dropdown';
// Dropdown picker in AssetsView
// Is given inputJSON, handleChange sets the activeObjectIndex which in turn sets the activeObject for AssetSearch and AssetCreate

function AssetList({
  objects, handleChange, selectedObjectName,
}) {
  const menuItems = _.map(objects.filter(object => (object.isAsset === true)), object => ({ value: object.objectName, displayText: object.objectName }));
  return (
    <div className="form-group">
      <label><h4>Asset</h4></label>
      <small className="form-text text-muted">Select the asset from the list below</small>
      <Dropdown
        selectText="Select an asset"
        menuItems={menuItems}
        handleChange={handleChange}
        selectedObjectName={selectedObjectName}
      />
    </div>
  );
}


AssetList.propTypes = {
  objects: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedObjectName: PropTypes.string.isRequired,
};

export default AssetList;
