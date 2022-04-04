import React from "react";
import { Row, Col } from "react-bootstrap";
import { Card } from "./../Card/Card";
import { Link, withRouter } from "react-router-dom";

const Login = props => {
  const handleClick = loginSource => {
    props.history.push({
      pathname: `/login`,
      state: { landing: loginSource }
    });
  };
  return (
    <div className="container-fluid">
      <Row>
        <Col md={5} xs={6} lg={4} xl={3}>
          <Card
            title={"Login"}
            category="Please choose a role"
            content={
              <div className="typo-line-nh">
                <button
                  onClick={() => handleClick("factory")}
                  type="button"
                  className="btn btn-link"
                >
                  Factory User Login
                </button>
                <button
                  onClick={() => handleClick("manufacturer")}
                  type="button"
                  className="btn btn-link"
                >
                  Manufacturer Login
                </button>
              </div>
            }
          />
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(Login);
