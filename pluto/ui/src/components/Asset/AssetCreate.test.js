import React from 'react';
import { shallow, mount } from 'enzyme';
import AssetCreate from './AssetCreate';
import '../../Enzyme';

describe('<AssetCreate />', () => {
  const props = {
    selectedSchema: {
      properties: {
        Settlements: {
          type: 'object',
          SettlementID: {
            type: 'string',
          },
          FromID: {
            type: 'string',
          },
          ToID: {
            type: 'string',
          },
          OrderID: {
            type: 'string',
          },
        },
      },
    },
  };

  it('renders X items in dropdown', () => {
    const wrapper = shallow(<AssetCreate selectedSchema={props.selectedSchema} />);
    expect(wrapper.find('Field')).toHaveLength(0);
  });

  it('renders top div class, form-group', () => {
    const wrapper = shallow(<AssetCreate selectedSchema={props.selectedSchema} />);
    expect(wrapper.exists('.form-group')).toEqual(true);
  });

  it('renders the Form', () => {
    const wrapper = shallow(<AssetCreate selectedSchema={props.selectedSchema} />);
    expect(wrapper.exists('Form')).toEqual(true);
  });

  it('renders a spinner when loading', () => {
    const wrapper = mount(<AssetCreate selectedSchema={props.selectedSchema} />);
    wrapper.setProps({ isLoading: true });
    expect(wrapper.find('Spinner').exists()).toBe(true);
  });

  it('should call the createClicked function', () => {
    const mockCreateClicked = jest.fn();
    const wrapper = mount(<AssetCreate selectedSchema={props.selectedSchema} createClicked={mockCreateClicked} />);
    expect(wrapper.find('button')).toHaveLength(1);
    wrapper.find('button').simulate('submit');
    expect(mockCreateClicked).toBeCalledTimes(1);
  });
});
