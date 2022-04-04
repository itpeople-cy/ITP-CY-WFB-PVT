import React, { Component } from 'react';
import UserLogin from './UserLogin';
import UserRegister from './UserRegister';
import Card from '../Card';


class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedTab: 'LOGIN',
    };
    this.handleClickedTab = this.handleClickedTab.bind(this);
  }
  handleClickedTab(event) {
    const name = event.target.name.toUpperCase();
    event.preventDefault();
    this.setState({
      clickedTab: name,
    });
  }
  render() {
    const {
      clickedTab,
    } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link active" id="login-tab" data-toggle="tab" href="#login" name="login" role="tab" aria-controls="login" onClick={this.handleClickedTab} aria-selected="true">Login</a>
              </li>
             {/*  <li className="nav-item">
                <a className="nav-link" id="register-tab" data-toggle="tab" href="#register" name="register" role="tab" aria-controls="register" onClick={this.handleClickedTab} aria-selected="false">Register</a>
              </li> */}
            </ul>
          </div>
        </div>
        <div>
          <div className="row">
            <UserTab
              clickedTab={clickedTab}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default UsersView;

// Tab renders chosen tabs
const UserTab = ({ clickedTab }) => {
  switch (clickedTab) {
    case 'REGISTER':
      return (
        <div className="col-8">
          <Card title="Users">
            <UserRegister />
          </Card>
        </div>
      );
    case 'LOGIN':
      return (
        <div className="col-8">
          <Card title="Users">
            <UserLogin />
          </Card>
        </div>
      );
    default:
      break;
  }
  return null;
};
