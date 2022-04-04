import React from 'react';
import { mount } from 'enzyme';
import UserRegister from './UserRegister';
import '../../Enzyme';

describe('<UserRegister />', () => {
  // It renders top div class (or top parent) => done
  it('renders top div class', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.exists('.app')).toEqual(true);
  });
  it('checks for email field', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#email').exists()).toEqual(true);
  });
  it('checks for password filed', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#password').exists()).toEqual(true);
  });
  it('checks for Select dropdown', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#org').exists()).toEqual(true);
  });
  it('checks for Role dropdown', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#role').exists()).toEqual(true);
  });
  it('checks for Register button', () => {
    const wrapper = mount(<UserRegister values="hi" handleChange={() => true} handleSubmit={() => true} />);
    expect(wrapper.find('#register').exists()).toEqual(true);
  });
});

