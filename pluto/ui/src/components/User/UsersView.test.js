import React from 'react';
import { shallow } from 'enzyme';
import UsersView from './UsersView';
import '../../Enzyme';

describe('<UsersView />', () => {
  // It renders top div class (or top parent) => done
  it('renders top div class', () => {
    const wrapper = shallow(<UsersView />);
    expect(wrapper.exists('.row')).toEqual(true);
  });
});
