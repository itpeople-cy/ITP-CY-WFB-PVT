import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Tab from '../Tab';
import AssetResults from './AssetResults';
import Card from '../Card';
import AssetService from '../../services/Asset';
import inputJSON from '../../assets/app.model.json';
import schemaJSON from '../../assets/schema.model.json';


// AssetsView is the logical parent of AssetList, Create, Search, and Results
// Its state properties are described as followed:
// isLoading - triggers loading spinner
// objects - holds inputJSON
// assetQueryResults - holds objects to be displayed by AssetSearch, Results and Create
// activeObjectIndex - modifies object.objects[activeObjectIndex}] will be set as activeObject
// clickedTab - dictates the view, currently search or create

class AssetsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      objects: props.objects || inputJSON,
      schema: props.schema || schemaJSON,
      assetQueryResults: [],
      activeObjectIndex: 0,
      activeObjectName: 'select',
      selectedSchema: null,
      clickedTab: 'SEARCH',

    };

    this.asset = new AssetService();

    this.handleSelectObject = this.handleSelectObject.bind(this);
    this.handleCreateAsset = this.handleCreateAsset.bind(this);
    this.handleGetAssetSingle = this.handleGetAssetSingle.bind(this);
    this.handleGetAssetList = this.handleGetAssetList.bind(this);
    this.handleClickedTab = this.handleClickedTab.bind(this);
    this.handleSelectedSchema = this.handleSelectedSchema.bind(this);
  }

  // Sets activeObjectIndex (and in turn, activeObject) from dropdown picker (AssetsList)
  handleCreateAsset = async ({ formData }) => {
    this.setState({
      assetQueryResults: [],
      isLoading: true,
    });
    const responseObj = [];
    try {
      const { activeObjectName } = this.state;
      let response = await this.asset.create(activeObjectName, formData);
      response = JSON.parse(response);
      if (response && response.objectBytes) {
        responseObj.push(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false, assetQueryResults: responseObj });
    }
  }

  handleClickedTab(event) {
    const name = event.target.name.toUpperCase();
    event.preventDefault();
    this.setState({
      clickedTab: name,
      selectedSchema: null,
      activeObjectIndex: 0,
      activeObjectName: 'select',
      isLoading: false,
      assetQueryResults: [],
    });
  }

  handleSelectedSchema() {
    this.setState({
      isLoading: true,
    });
  }

  handleSelectObject(value) {
    const { objects } = this.state;
    const { schema } = this.state;
    const index = objects.objects.findIndex(x => x.objectName === value);
    const match = _.find(schema.properties, (item, i) => _.isEqual(i, value));
    this.setState({
      selectedSchema: match,
      activeObjectIndex: index,
      activeObjectName: value,
    });
  }

  async handleGetAssetList(event, assetName) {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const response = await this.asset.getAssetList(assetName);
      const responseObj = [];
      if (response) {
        const jsonObj = JSON.parse(response.objectBytes);
        if (jsonObj && jsonObj.length > 0) {
          jsonObj.map(element => responseObj.push(element));
        }
      }
      this.setState({
        assetQueryResults: responseObj,
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async handleGetAssetSingle(event, assetName, assetAttributes) {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const response = await this.asset.getAssetSingle(assetName, assetAttributes);
      const responseObj = [];
      if (response && response.objectBytes) {
        responseObj.push(JSON.parse(response.objectBytes));
      }
      this.setState({
        assetQueryResults: responseObj,
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }
  render() {
    const {
      clickedTab, assetQueryResults, isLoading, objects, activeObjectIndex, selectedSchema, activeObjectName,
    } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h1>Blockchain Assets</h1>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="search-tab" data-toggle="tab" href="#search" name="search" role="tab" aria-controls="search" onClick={this.handleClickedTab} aria-selected="true">Search</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="create-tab" data-toggle="tab" href="#create" name="create" role="tab" aria-controls="create" onClick={this.handleClickedTab} aria-selected="false">Create</a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="row">
            <Tab
              {...inputJSON}
              handleSelectObject={this.handleSelectObject}
              handleCreateAsset={this.handleCreateAsset}
              activeObject={objects.objects[activeObjectIndex]}
              isLoading={isLoading}
              handleGetAssetList={this.handleGetAssetList}
              handleGetAssetSingle={this.handleGetAssetSingle}
              clickedTab={clickedTab}
              selectedActiveObjectName={activeObjectName}
              selectedSchema={selectedSchema}
            />
            {clickedTab === 'SEARCH'
              && (
                <div className="col-12 col-md-6">
                  <Card title={`Results ${assetQueryResults.length > 0 ? `(${assetQueryResults.length})` : ''}`}>
                    <AssetResults assetName={activeObjectName} assets={assetQueryResults} isLoading={isLoading} />
                  </Card>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}
AssetsView.propTypes = {
  clickedTab: PropTypes.string.isRequired,
  assetQueryResults: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AssetsView;
