
import React from "react";
import {
    Container,
    Row,
    Col,
} from "react-bootstrap";
import Spinner from '../Spinner';
import { Card } from "./../Card/Card";

const FactoryDetails = (props) => {

    const { man } = props;
    return (

        <div className="content">
            <Container fluid>
                <Row>
                    <Col md={12}>
                        {man ?
                            <Card
                                title={man.factoryID}
                                category="Factory"
                                content={
                                    <div>                                       
                                        <div className="typo-line">
                                            <text>
                                                <p className="category">Brand IDs</p>
                                                {man.brandIDs.map(v => v + " ")}
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
                                    </div>
                                }
                            /> : <Spinner />}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default FactoryDetails;
