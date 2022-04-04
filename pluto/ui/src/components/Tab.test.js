import React from 'react';
import { shallow } from 'enzyme';
import Tab from './Tab';
import '../Enzyme';

describe('<Tab />', () => {
  it('renders AssetCreate', () => {
    const wrapper = shallow(<Tab clickedTab="CREATE" isLoading="true" activeObject="select" handleSelectObject={() => true} handleCreateAsset={() => true} handleGetAssetSingle={() => true} handleGetAssetList={() => true} selectedSchema={() => true} />);
    expect(wrapper.find('AssetCreate').exists()).toBe(true);
  });

  it('renders AssetSearch', () => {
    const wrapper = shallow(<Tab clickedTab="SEARCH" isLoading="true" activeObject="select" handleSelectObject={() => true} handleCreateAsset={() => true} handleGetAssetSingle={() => true} handleGetAssetList={() => true} selectedSchema={() => true} />);
    expect(wrapper.find('AssetSearch').exists()).toBe(true);
  });
});
