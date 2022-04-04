import React, { useState, useEffect } from "react";
import { Form, Row, Col,Button } from "react-bootstrap";
import Spinner from "../Spinner";
import { Card } from "./../Card/Card";
import { withRouter } from "react-router-dom";
import { getUnassignedTags } from "../../services/FactoryService";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { toast } from 'react-toastify';


const UnassignedTags = props => {
  const { man } = props;
  const [brand, setBrand] = useState(null);
  const [det, setDet] = useState(null);

  useEffect(() => {}, []);
  const handleClickAdd = () => {
    props.history.push("/manufacturer/addProduct");
  };
  const handleChange = e => {
    setBrand(e.target.value);
  };
  const handleSearchClick = async (e) => {
const form=e.currentTarget;
    const result = await getUnassignedTags(brand);
    //const resObj=JSON.parse(result);
    if (result.status!=='SUCCESS')
    toast.error((<div className="text-center">No data Available</div>), {
        pauseOnHover: false,
        autoClose: 3000,
      });
    else 
    setDet(result);
  };
  const buttonFormatter = (cell, row) => {
    return <button className="btn btn-primary"> Assign Product</button>;
  };
  return (
    <div>
      <div>
        <Row>
          <Col>
            <Form.Control
            required
            name="taggingTechnology"
              placeholder="Enter Tag Technology"
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Button onClick={handleSearchClick}>Search</Button>
          </Col>
        </Row>
      </div>
      <br/>
      {/* <pre>{JSON.stringify(det && JSON.parse(det.objectBytes), null, 2)}</pre> */}
      <BootstrapTable data={det && JSON.parse(det.objectBytes)} striped hover>
        <TableHeaderColumn isKey dataField="brandID">
          Brand ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="factoryID">Factory ID</TableHeaderColumn>
        <TableHeaderColumn dataField="tagSupplierID">
          Tag Supplier
        </TableHeaderColumn>
        <TableHeaderColumn dataField="tagID">Tag ID</TableHeaderColumn>
        <TableHeaderColumn dataField="tagTechnology">
          Tag Technology
        </TableHeaderColumn>
        {/* <TableHeaderColumn dataField="button" dataFormat={buttonFormatter}>
          Actions
        </TableHeaderColumn> */}
      </BootstrapTable>
    </div>
  );
};

export default withRouter(UnassignedTags);
