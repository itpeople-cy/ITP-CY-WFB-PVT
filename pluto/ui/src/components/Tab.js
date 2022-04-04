import React from 'react';
import PropTypes from 'prop-types';
import AssetList from './Asset/AssetList';
import AssetCreate from './Asset/AssetCreate';
import AssetSearch from './Asset/AssetSearch';
import Card from './Card';
import inputJSON from '../assets/app.model.json';

// Tab renders chosen tabs
const Tab = ({
  handleSelectObject, handleCreateAsset, activeObject, isLoading, handleGetAssetList, handleGetAssetSingle, clickedTab, selectedActiveObjectName, selectedSchema,
}) => {
  switch (clickedTab) {
    case 'CREATE':
      return (
        <div className="col-12">
          <Card>
            <AssetList
              {...inputJSON}
              handleChange={handleSelectObject}
              selectedObjectName={selectedActiveObjectName}
            />
            <AssetCreate
              {...inputJSON}
              createClicked={handleCreateAsset}
              isLoading={isLoading}
              selectedSchema={selectedSchema}
            />
          </Card>
        </div>
      );
    case 'SEARCH':
      return (
        <div className="col-12 col-md-6">
          <Card>
            <AssetList
              {...inputJSON}
              handleChange={handleSelectObject}
              selectedObjectName={selectedActiveObjectName}
            />
            <AssetSearch
              {...inputJSON}
              queryAllClicked={handleGetAssetList}
              queryClicked={handleGetAssetSingle}
              activeObject={activeObject}
              selectedObjectName={selectedActiveObjectName}
            />
          </Card>
        </div>
      );
    default:
      break;
  }
  return null;
};

Tab.propTypes = {
  clickedTab: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeObject: PropTypes.object.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  handleCreateAsset: PropTypes.func.isRequired,
  handleGetAssetSingle: PropTypes.func.isRequired,
  handleGetAssetList: PropTypes.func.isRequired,
  selectedSchema: PropTypes.object.isRequired,
};

export default Tab;
