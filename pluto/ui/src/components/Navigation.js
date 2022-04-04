import React, { Component, useContext } from "react";
import $ from "jquery";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import AppContext from "../contexts/AppContext";

import AppIcon from "../assets/img/AppIcon";
import { UserContext } from "../contexts/UserContext";

class Navigation extends Component {
  componentDidMount() {
    $(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }

  render() {
    return (
      <div>
        <SideNav location={this.props.location} history={this.props.history} />
        <TopNav location={this.props.location} history={this.props.history} />
      </div>
    );
  }
}
Navigation.defaultProps = {};

Navigation.propTypes = {};

export default withRouter(Navigation);

const SideNav = props => {
  const { isLoggedIn } = useContext(UserContext);
  const context = useContext(AppContext);
  const landing = window.localStorage.getItem("landing-page");
  console.log(props.history.location.state);
  return (
    <nav className="sidenav flex-md-nowrap p-0 d-none d-md-block">
      <div className="nav-item app-icon-item">
        <AppIcon />
      </div>

      {context.state.views.map(
        view =>
          view.show !== false &&
          !view.loggedIn && (
            <SideNavItem
              history={props.history}
              label={view.label}
              path={view.path}
              icon={view.icon}
            />
          )
      )}
      {isLoggedIn &&
        context.state.views.map(
          view =>
            view.loggedIn &&
            view.viewId === landing && (
              <SideNavItem
                history={props.history}
                label={view.label}
                path={view.path}
                icon={view.icon}
              />
            )
        )}
    </nav>
  );
};

const SideNavItem = ({ history, label, path, icon }) => {
  const Icon = icon;
  return (
    <div
      className="nav-item"
      data-toggle="tooltip"
      data-placement="right"
      title={label}
      onClick={() => history.push(path)}
    >
      <Icon fill={window.location.pathname === path ? "#3C96FF" : "#849AA7"} />
    </div>
  );
};
SideNavItem.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired
};

const TopNav = props => {
  const { isLoggedIn } = useContext(UserContext);
  const context = useContext(AppContext);
  const landing = window.localStorage.getItem("landing-page");
  console.log(props.history.location.state);
  return (
    <nav className="navbar navbar-dark d-block d-md-none">
      <ul className="top-nav d-flex justify-content-around">
        {context.state.views.map(
          view =>
            view.show !== false &&
            !view.loggedIn && (
              <SideNavItem
                history={props.history}
                label={view.label}
                path={view.path}
                icon={view.icon}
              />
            )
        )}
        {isLoggedIn &&
          context.state.views.map(
            view =>
              view.loggedIn &&
              view.viewId === landing && (
                <SideNavItem
                  history={props.history}
                  label={view.label}
                  path={view.path}
                  icon={view.icon}
                />
              )
          )}ß
      </ul>
    </nav>
  );
};

const TopNavItem = ({ path, icon }) => {
  const Icon = icon;
  return (
    <li
      className={`${window.location.pathname === path ? " active" : ""}`}
      onClick={() => (window.location.pathname = path)}
    >
      <Icon fill={window.location.pathname === path ? "#3C96FF" : "#849AA7"} />
    </li>
  );
};

TopNavItem.propTypes = {
  path: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired
};
