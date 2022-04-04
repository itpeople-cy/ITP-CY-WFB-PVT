import React, { useState, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import User from '../../services/User';
import { withRouter } from 'react-router-dom';
import { successHandler, errorHandler } from '../../services/RequestHandler';
import { UserContext } from '../../contexts/UserContext';


const UserLogin = (props) => {

  const [loggedIn, setLoggedIn] = useState(false);

  const { isLoggedIn, loggedInUser, onLogin, onLogout } = useContext(UserContext);

  const handleFormikSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(false);
    const user = new User();
    try {
      const response = await user.login(values);
      if (response.status === 200) {
        if (response.data && response.data.accessToken) {
          // TODO: Should I save for each user token value, if so change the key to have username
          window.localStorage.setItem('x-access-token', response.data.accessToken);
          window.localStorage.setItem('landing-page',props.history.location.state.landing)
          successHandler('Login is success !!');
          resetForm();
          props.history.push(`/${props.history.location.state.landing}`);
          onLogin(response.data.email)
          setLoggedIn(true)
        }
      }
    } catch (error) {
      errorHandler(error);
    }
  };
  const handleLogoutClick= () => {
    onLogout();
    window.localStorage.removeItem('x-access-token');
    window.localStorage.removeItem('login-email');
    window.localStorage.removeItem('landing-page');
    props.history.push('/');
  }
  return (
    isLoggedIn ? <div>{loggedInUser} - <button className="btn btn-secondary" onClick={handleLogoutClick}> logout </button> </div> :
      <div className="app">
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleFormikSubmit}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is Required'),
            password: Yup.string()
              .required('Password is Required'),
          })}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
            } = props;
            return (
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="mt-4">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        <b><h1>Email</h1></b>
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {errors.email && touched.email ? (
                          <div className="text-danger">{errors.email}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="mt-4">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">
                        <b><h1>Password</h1></b>
                      </label>
                      <div className="col-sm-6">
                        <input
                          id="password"
                          type="password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          className="form-control"
                        />
                        {errors.password && touched.password ? (
                          <div className="text-danger">{errors.password}</div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-around">
                  <div className="col-4">
                    <div className="mt-4">
                      <button type="submit" className="btn btn-primary" id="login">Login</button>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
  )
};

UserLogin.propTypes = {
  values: PropTypes.string.isRequired,
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default withRouter(UserLogin);
