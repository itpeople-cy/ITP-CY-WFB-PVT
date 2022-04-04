import React from 'react';
import { mount } from 'enzyme';
import UserLogin from './UserLogin';
import '../../Enzyme';

describe('<UserLogin />', () => {
  // It renders top div class (or top parent) => done
  it('renders top div class', () => {
    const wrapper = mount(<UserLogin values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.exists('.app')).toEqual(true);
  });
  it('checks for email field', () => {
    const wrapper = mount(<UserLogin values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#email').exists()).toEqual(true);
  });
  it('checks for password filed', () => {
    const wrapper = mount(<UserLogin values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#password').exists()).toEqual(true);
  });
  it('checks for Select dropdown', () => {
    const wrapper = mount(<UserLogin values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#org').exists()).toEqual(true);
  });
  it('checks for Login button', () => {
    const wrapper = mount(<UserLogin values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#login').exists()).toEqual(true);
  });
});
