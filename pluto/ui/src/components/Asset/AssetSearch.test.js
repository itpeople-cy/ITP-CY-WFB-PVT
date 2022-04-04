import React from 'react';
import { shallow, mount } from 'enzyme';
import AssetSearch from './AssetSearch';
import '../../Enzyme';

describe('<AssetSearch />', () => {
  let spy;

  afterEach(() => {
    spy.mockClear();
  });

  const renderMock = jest.fn();

  const props = {
    activeObject: {
      keys: [{
        name: 'UUID',
        type: 'string',
      }],
      attributes: [{
        name: 'FromID',
        type: 'string',
      },
      {
        name: 'ToID',
        type: 'string',
      }],
    },
  };

  it('mounts component', () => {
    spy = jest.spyOn(AssetSearch.prototype, 'componentDidMount');
    const wrapper = mount(<AssetSearch {...props} />);
    wrapper.instance().componentDidMount();
    expect(spy).toHaveBeenCalled();
  });

  it('sets up available fields', () => {
    const wrapper = shallow(<AssetSearch activeObject={props.activeObject} />);
    wrapper.instance().setupAvailableFields(props);
    expect(wrapper.instance().state.isQueryButtonDisabled).toEqual(true);
    expect(wrapper.instance().props.activeObject.keys).toHaveLength(1);
    expect(wrapper.instance().state.availableFields).toBeTruthy();
  });

  it('handles form validation', () => {
    const wrapper = shallow(<AssetSearch
      activeObject={props.activeObject}
      queryAllClicked={() => true}
      formFields={{}}
      queryClicked={() => true}
    />);
    wrapper.instance().handleFormValidation();
    expect(wrapper.instance().state.isQueryButtonDisabled).toEqual(true);
  });

  it('renders X items in dropdown', () => {
    const wrapper = shallow(<AssetSearch
      activeObject={props.activeObject}
      queryAllClicked={() => true}
      formFields={{}}
      queryClicked={() => true}
    />);
    expect(wrapper.find('Field')).toHaveLength(1);// There is 1 key
  });

  it('renders top div class, form-group', () => {
    const wrapper = shallow(<AssetSearch
      activeObject={props.activeObject}
      queryAllClicked={() => true}
      formFields={{}}
      queryClicked={() => true}
    />);
    expect(wrapper.exists('.form-group')).toEqual(true);
  });

  it('triggers onClick method queryClicked', () => {
    const wrapper = shallow(<AssetSearch
      activeObject={props.activeObject}
      queryClicked={renderMock}
      queryAllClicked={renderMock}
      formFields={{}}
    />);
    wrapper.find('#queryClicked').simulate('click');
    expect(renderMock).toHaveBeenCalled();
  });

  it('triggers onClick method queryAllClicked', () => {
    const wrapper = shallow(<AssetSearch
      activeObject={props.activeObject}
      queryClicked={renderMock}
      queryAllClicked={renderMock}
      formFields={{}}
    />);
    wrapper.find('#queryAllClicked').simulate('click');
    expect(renderMock).toHaveBeenCalled();
  });
});
