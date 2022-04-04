import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import SpinnerDialog from "../SpinnerDialog";
import { Card } from "./../Card/Card";
import { withRouter } from "react-router-dom";
import FormModal from "../FormModal";
import { toast } from "react-toastify";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  getUntaggedProducts,
  getUnassignedTags,
  assignTag
} from "../../services/FactoryService";

const UntaggedProducts = props => {
  const { man } = props;
  const [brand, setBrand] = useState(null);
  const [det, setDet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productID, setProductID] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const data = await getUntaggedProducts("LV");
      const det = await getUnassignedTags("chemical");
      // setDet(data);
      setTags(JSON.parse(det.objectBytes));
    };
    fetchData();
  }, []);
  const handleSelectChange = e => {
    setSelectedTag(e.target.value);
  };
  const handleButtonClick = async (productID, factoryID, brandID) => {
    setProductID(productID);
    // setShowModal(true);
try{
  setLoading(true);
    const res = await assignTag({
      tagTechnology: "qrcode",
      productID,
      factoryID,
      brandID
    });
    if (res && res.status && res.status === "SUCCESS") {
      setLoading(false);
      toast.success(
        <div className="text-center">
          Product {productID} sucessfully assigned a tag
        </div>,
        {
          pauseOnHover: false,
          autoClose: 3000
        }
      );
      }
      handleSearchClick();
    }
      catch(e){
        setLoading(false);
      }
  };
  const buttonFormatter = (cell, row) => {
    return (
      <button
        className="btn btn-primary"
        disabled={row.brandID==='DG'}
        onClick={() => {
          handleButtonClick(row.productID, row.factoryID, row.brandID);
        }}
      >
        {" "}
        Assign Tag
      </button>
    );
  };
  const handleChange = e => {
    setBrand(e.target.value);
  };
  const handleSearchClick = async () => {
    const result = await getUntaggedProducts(brand);

    if (result.status !== "SUCCESS")
      toast.error(<div className="text-center">No data Available</div>, {
        pauseOnHover: false,
        autoClose: 3000
      });
    else setDet(result);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <div>
      <div>
        <Row>
          <Col>
            <Form.Control
              required
              name="searchBrand"
              placeholder="Enter Brand"
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
        <TableHeaderColumn isKey dataField="brandID">
          Brand ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="factoryID">Factory ID</TableHeaderColumn>
        <TableHeaderColumn dataField="color">Color</TableHeaderColumn>
        <TableHeaderColumn dataField="msrp"> MSRP </TableHeaderColumn>
        <TableHeaderColumn dataField="productID">Product ID</TableHeaderColumn>
        <TableHeaderColumn dataField="skuID">SKU ID</TableHeaderColumn>
        <TableHeaderColumn dataField="styleID"> Style ID </TableHeaderColumn>
        <TableHeaderColumn dataField="upCode"> UP Code</TableHeaderColumn>
        <TableHeaderColumn dataField="button" dataFormat={buttonFormatter}>
          Actions
        </TableHeaderColumn>
      </BootstrapTable>

      <FormModal
        show={showModal}
        heading="Assign a tag"
        handleClose={() => {
          handleClose();
        }}
      >
        <div className="form-group ">
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">
              <b>
                <p>Product ID</p>
              </b>
            </label>
            <div className="row">
              <input
                id="productID"
                type="text"
                name="productID"
                // onChange={handleChange}
                value={productID}
                className="form-control"
                disabled
              />
            </div>
          </div>
          <div className="form-group ">
            <div className="form-group row">
              <label className="col-sm-3 col-form-label">
                <b>
                  <p>Select Tag</p>
                </b>
              </label>
              <div className="row">
                <select
                  id="tag"
                  name="tag"
                  onChange={handleSelectChange}
                  value={selectedTag}
                  className="form-control"
                >
                  <option value={null}>{"--Select--"}</option>
                
                </select>
              </div>
            </div>
          </div>
        </div>
      </FormModal>
      <SpinnerDialog show={loading}/>
    </div>
  );
};

export default withRouter(UntaggedProducts);
