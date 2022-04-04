import React from "react";
import { Container, Accordion, Card, Row, Col } from "react-bootstrap";
import Spinner from "../Spinner";
//import { Card } from "./../Card/Card";
import { withRouter } from "react-router-dom";

const ManDetails = props => {
  const { man } = props;  
  const handleClickAdd=() => {
      props.history.push("/manufacturer/addProduct")
  }
  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md={12}>
            {man ? (
              <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  {man.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body> 
                  <div>
                    <div className="typo-line">
                      <text>
                        <p className="category">Manufacturer ID</p>
                        {man.manufacturerID}
                      </text>
                    </div>
                    <div className="typo-line">
                      <text>
                        <p className="category">Brand IDs</p>
                        {man.brandIDs.map(v => v + " ")}
                      </text>
                    </div>
                    <div className="typo-line">
                      <text>
                        <p className="category">Factory IDs</p>
                        {man.factoryIDs.map(v => v + " ")}
                      </text>
                    </div>
                    <div className="typo-line">
                      <text>
                        <p className="category">Location</p>
                        <div className="typo-line">
                          <text>
                            <p className="category">gps</p>
                            {man.location.gps}
                          </text>
                        </div>
                        <div className="typo-line">
                          <text>
                            <p className="category">Location Id</p>
                            {man.location.locationID}
                          </text>
                        </div>
                        <div className="typo-line">
                          <text>
                            <p className="category">Location Name</p>
                            {man.location.name}
                          </text>
                        </div>
                      </text>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => {handleClickAdd()}}
                    >
                      Add New Product
                    </button>
                  </div>
                </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
             
            ) : (
              <Spinner />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withRouter(ManDetails);
