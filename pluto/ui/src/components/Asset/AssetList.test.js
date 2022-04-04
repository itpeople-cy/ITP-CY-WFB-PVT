import React from 'react';
import { shallow } from 'enzyme';
import AssetList from './AssetList';
import '../../Enzyme';

// X items show in dropdown
describe('<AssetList />', () => {
  const props = {
    objects: [
      {
        objectName: 'hi',
        isAsset: true,
        isPersona: false,
      },
      {
        objectName: 'hello',
        isAsset: true,
        isPersona: false,
      },
      {
        objectName: 'hey',
        isAsset: false,
        isPersona: true,
      },
    ],
  };
  it('renders one Dropdown component', () => {
    const wrapper = shallow(<AssetList objects={props.objects} selectedObjectName="select" handleChange={() => true} />);
    expect(wrapper.find('Dropdown')).toHaveLength(1);
  });

  // It renders top div class (or top parent)
  it('renders top div class', () => {
    const wrapper = shallow(<AssetList objects={props.objects} selectedObjectName="select" handleChange={() => true} />);
    expect(wrapper.exists('.form-group')).toEqual(true);
  });
});
