import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import _ from 'lodash';
import User from '../../services/User';
import { successHandler, errorHandler } from '../../services/RequestHandler';
import appModel from '../../assets/app.model.json';

const handleFormikRegister = async (values, { setSubmitting, resetForm }) => {
  setSubmitting(false);
  const user = new User();
  try {
    const response = await user.register(values);
    if (response.status === 200) {
      if (response.data && response.data.success) {
        successHandler('Registered successfully ');
        resetForm();
      }
    }
  } catch (error) {
    errorHandler(error);
  }
};
const UserRegister = () => (
  <div className="app">
    <Formik
      initialValues={{
        email: '', password: '', org: 'Choose an org', role: 'Choose a role',
      }}
      onSubmit={handleFormikRegister}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Required'),
        password: Yup.string()
          .required('Required'),
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
        const menuItems = (() => {
          const { objects } = appModel;
          let temp = [];
          _.forEach(objects, (object) => {
            _.forEach(object.roles, (role) => {
              temp.push(role.name);
            });
          });
          temp = _.uniq(temp);
          temp = _.map(temp, t => ({
            value: t,
            displayText: t,
          }));
          return temp;
        })();
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
                      <div>{errors.email}</div>
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
                      <div>{errors.password}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="mt-4">
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    <b><h1>Select</h1></b>
                  </label>
                  <div className="col-sm-6">
                    <label>
                      <select
                        id="org"
                        name="org"
                        value={values.org}
                        className="custom-select mr-sm-2"
                        onChange={handleChange}
                      >
                        <option value="">Choose an org</option>
                        <option name="1">org1</option>
                        <option name="2">org2</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="mt-4">
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label">
                    <b><h1>Role</h1></b>
                  </label>
                  <div className="col-sm-6">
                    <label>
                      <select
                        id="role"
                        name="role"
                        value={values.role}
                        className="custom-select mr-sm-2"
                        onChange={handleChange}
                      >
                        <option value="">Choose a role</option>
                        {menuItems.map((item, i) => <option key={i} value={item.value}>{item.displayText}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-around">
              <div className="col-4">
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary" id="register">Register</button>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  </div>
);

UserRegister.propTypes = {
  values: PropTypes.string.isRequired,
  touched: PropTypes.bool.isRequired,
  errors: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default UserRegister;
