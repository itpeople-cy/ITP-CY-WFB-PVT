import React from 'react';
import { shallow, mount } from 'enzyme';
import AssetsView from './AssetsView';
import '../../Enzyme';
import AssetService from '../../services/Asset';

jest.mock('../../services/Asset');

describe('<AssetsView />', () => {
  let spy;
  beforeEach(() => {
    AssetService.mockClear();
    if (spy) {
      spy.mockClear();
    }
  });
  afterEach(() => {
    AssetService.mockClear();
    if (spy) {
      spy.mockClear();
    }
  });

  const props = {
    objects: {
      objects: [
        {
          objectName: 'Obj1',
          isAsset: true,
          isPersona: false,
          keys: [
            {
              type: 'string',
              name: 'key1',
            },
          ],
        },
        {
          objectName: 'Obj2',
          isAsset: true,
          isPersona: false,
          keys: [
            {
              type: 'string',
              name: 'key2',
            },
          ],
        },
      ],
    },
    schema: {
      type: 'object',
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        Obj1: {
          type: 'object',
          properties: {
            key1: { type: 'string' },
          },
        },
        Obj2: {
          type: 'object',
          properties: {
            key2: { type: 'string' },
          },
        },
      },
    },
  };

  it('handles clicked tab', () => {
    spy = jest.spyOn(AssetsView.prototype, 'handleSelectObject');
    const wrapper = shallow(<AssetsView {...props} clickedTab="create" assetQueryResults={[]} />);
    wrapper.instance().handleClickedTab({
      target: {
        name: 'create',
      },
      preventDefault: () => { },
    });
    expect(wrapper.instance().state.clickedTab).toEqual('CREATE');
  });

  it('handles select object', () => {
    spy = jest.spyOn(AssetsView.prototype, 'handleSelectObject');
    const wrapper = mount(<AssetsView {...props} clickedTab="search" assetQueryResults={[]} />);
    wrapper.instance().handleSelectObject('Obj2');
    expect(wrapper.instance().state.activeObjectIndex).toEqual(1);
  });
  it('renders top div class, row', () => {
    const wrapper = shallow(<AssetsView activeObject={props.activeObject} clickedTab="search" assetQueryResults={[]} />);
    expect(wrapper.exists('.row')).toEqual(true);
  });
  it('renders one Tab component', () => {
    const wrapper = shallow(<AssetsView {...props} clickedTab="search" assetQueryResults={[]} />);
    expect(wrapper.find('Tab')).toHaveLength(1);
  });
  it('renders one Card component', () => {
    const wrapper = shallow(<AssetsView {...props} clickedTab="search" assetQueryResults={[]} />);
    expect(wrapper.find('Card')).toHaveLength(1);
  });
  it('should call the AssetService create service when the user clicks on Submit on the Create screen', (done) => {
    const MOCK_RETURN_VALUE = { objectBytes: 'Hello' };
    const expectedAssetQueryResults = new Array(MOCK_RETURN_VALUE);
    AssetService.prototype.create = jest.fn(async () => JSON.stringify(MOCK_RETURN_VALUE));
    const mockCreate = AssetService.prototype.create;
    const wrapper = mount(<AssetsView
      {...props}
      clickedTab="create"
      isLoading={false}
    />);
      // Constructor should have been called again:
    expect(AssetService).toHaveBeenCalledTimes(1);
    wrapper.find('#create-tab').simulate('click');
    wrapper.find('select').simulate('change', { target: { value: 'Obj2' } });
    expect(wrapper.find('button')).toHaveLength(1);
    wrapper.find('button').simulate('submit');
    setTimeout(() => {
      wrapper.update();
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(wrapper.state().assetQueryResults).toEqual(expectedAssetQueryResults);
      done();
    });
  });

  // handleGetAssetList
  it('handles get asset list', (done) => {
    const MOCK_RETURN_VALUE = {
      objectBytes: '[{"AssetId":"1"},{"AssetId":"2"}]',
    };
    const expectedAssetQueryResults = MOCK_RETURN_VALUE;
    AssetService.prototype.getAssetList = jest.fn(() => expectedAssetQueryResults);
    const mockGetAssetList = AssetService.prototype.getAssetList;
    const wrapper = mount(<AssetsView
      {...props}
      clickedTab="search"
      assetQueryResults={[]}
    />);
    wrapper.find('#search-tab').simulate('click');
    wrapper.find('select').simulate('change', { target: { value: 'Obj2' } });
    wrapper.find('#queryAllClicked').simulate('click');
    setTimeout(() => {
      wrapper.update();
      expect(mockGetAssetList).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().state.assetQueryResults).toEqual(JSON.parse(expectedAssetQueryResults.objectBytes));
      done();
    });
  });

  // handleGetAssetSingle
  it('handles get asset single', () => {
    const MOCK_RETURN_VALUE = {
      objectBytes: '[{"AssetId":"1"}]',
    };
    const expectedAssetQueryResults = MOCK_RETURN_VALUE;
    AssetService.prototype.getAssetSingle = jest.fn(async () => expectedAssetQueryResults);
    const mockGetAssetSingle = AssetService.prototype.getAssetSingle;
    const wrapper = mount(<AssetsView
      {...props}
      clickedTab="search"
      assetQueryResults={[]}
    />);
    wrapper.find('#search-tab').simulate('click');
    wrapper.find('select').simulate('change', { target: { value: 'Obj2' } });

    wrapper.find('#queryClicked').simulate('click');
    setTimeout(() => {
      wrapper.update();

      expect(mockGetAssetSingle).toHaveBeenCalledTimes(1);
      expect(wrapper.instance().state.assetQueryResults).toEqual(JSON.parse(expectedAssetQueryResults.objectBytes));
      done();
    });
  });
});
