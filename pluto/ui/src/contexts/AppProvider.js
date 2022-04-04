import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';
import { config } from '../configs/AppConfig';


class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = config;
  }
  render() {
    const { children } = this.props;
    return (
      <AppContext.Provider value={{
        state: this.state,
        updateState: (statePropToUpdate, value) => this.setState({ [statePropToUpdate]: value }),
      }}
      >
        {children}
      </AppContext.Provider>
    );
  }
}
AppProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default AppProvider;
