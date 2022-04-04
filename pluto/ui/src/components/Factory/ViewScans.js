import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import SpinnerDialog from "./../SpinnerDialog";
import { withRouter } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { getScans } from "../../services/FactoryService";

const ViewScans = props => {
  const [det, setDet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productID, setProductID] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // const data = await getUntaggedProducts("LV");
      //const det= await getUnassignedTags("chemical");
      //setDet(data);
    };
    fetchData();
  }, []);

  const handleChange = e => {
    setProductID(e.target.value);
  };
  const handleSearchClick = async () => {
    setLoading(true);
    try {
    const result = await getScans(productID);
    setDet(result);
    setLoading(false);
    }
    catch(e) {
      setLoading(false);
    }
  };
const  showGPS=(cell, row)=> {
  return cell.gps;
}
  return (
    <div>
      <div>
        <Row>
          <Col>
            <Form.Control
              required
              name="searchScans"
              placeholder="Enter Product Id"
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Button onClick={handleSearchClick}>Search</Button>
          </Col>
        </Row>
      </div>
      <br />

      <BootstrapTable data={det && JSON.parse(det.objectBytes)} striped hover>
      <TableHeaderColumn dataField="productID">Product ID</TableHeaderColumn>
        <TableHeaderColumn  dataField="scanBy">
         Scan By
        </TableHeaderColumn>

        <TableHeaderColumn isKey dataField="scanID">Scan ID</TableHeaderColumn>
        <TableHeaderColumn dataField="tagID">Tag ID</TableHeaderColumn>
        <TableHeaderColumn dataField="time"> Time </TableHeaderColumn>
        
        <TableHeaderColumn dataField="location" dataFormat={showGPS}>GPS</TableHeaderColumn>   
      </BootstrapTable>
      <SpinnerDialog show={loading}/>
    </div>
  );
};

export default withRouter(ViewScans);
