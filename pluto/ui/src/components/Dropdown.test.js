import React from 'react';
import { shallow } from 'enzyme';
import Dropdown from './Dropdown';
import '../Enzyme';

describe('<Dropdown />', () => {
  const props = {
    objects: [
      {
        objectName: 'abc',
        isAsset: true,
        isPersona: false,
      },
      {
        objectName: 'def',
        isAsset: true,
        isPersona: false,
      },
    ],
  };
  it('renders X items in dropdown', () => {
    const menuItems = props.objects.map(object => ({ value: object.objectName, displayText: object.objectName }));
    const wrapper = shallow(<Dropdown menuItems={menuItems} selectText="select a value" selectedObjectName="select" handleChange={() => true} />);
    expect(wrapper.find('option')).toHaveLength(3);
  });
  // It triggers onclick/onchange events
  it('triggers onClick method handleChange', () => {
    const renderMock = jest.fn();
    const menuItems = props.objects.map(object => ({ value: object.objectName, displayText: object.objectName }));
    const wrapper = shallow(<Dropdown
      menuItems={menuItems}
      selectText="select a value"
      handleChange={renderMock}
      selectedObjectName="select"
    />);
    wrapper.find('select').simulate('change', {
      target: {
        value: 'abc',
        options: { selectedIndex: 1 },
      },
    });
    expect(renderMock).toHaveBeenCalled();
  });
});
