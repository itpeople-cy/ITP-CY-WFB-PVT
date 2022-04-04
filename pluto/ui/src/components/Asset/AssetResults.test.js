import React from 'react';
import { shallow } from 'enzyme';
import AssetResults from './AssetResults';
import '../../Enzyme';

describe('<AssetResults />', () => {
  const props = {
    empty_list: [],
    assets: [{
      abc: 'abc',
    }, {
      def: 'def',
    }],
    isLoading: false,
  };
  it('renders the length of the assets', () => {
    const wrapper = shallow(<AssetResults assets={props.assets} isLoading={props.isLoading} />);
    expect(wrapper.find('Asset')).toHaveLength(2);
  });
  it('renders when assets are empty', () => {
    const wrapper = shallow(<AssetResults assets={props.empty_list} isLoading={props.isLoading} />);
    expect(wrapper.find('Asset')).toHaveLength(0);
  });
});
