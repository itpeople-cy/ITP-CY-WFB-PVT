import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getUnshippedProducts,
  shipProduct
} from "../../services/FactoryService";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SpinnerDialog from "../SpinnerDialog";

const UnshippedProducts = props => {
  const { man } = props;
  const [productID, setProductID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [det, setDet] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getUnshippedProducts();
      if (res && res.status && res.status === "SUCCESS") {
        setDet(res);
      }
    } catch (e) {
      setDet(null);
    }
  };

  const handleButtonClick = async (productID, factoryID, brandID) => {
    //setProductID(productID);
    // setShowModal(true);
    try {
      setLoading(true);
      let payload = {
        productID: productID,
        orderNumber: "O123",
        retailerID: "RT002"
      };
      if (brandID === "DG")
        payload = {
          productID: productID,
          orderNumber: "O123",
          retailerID: "RT004"
        };
      const res = await shipProduct(payload);
      if (res && res.status && res.status === "SUCCESS") {
        setLoading(false);
        toast.success(
          <div className="text-center">
            Product {productID} sucessfully shipped
          </div>,
          {
            pauseOnHover: false,
            autoClose: 3000
          }
        );
      }
      fetchData();
    } catch (e) {
      setLoading(false);
    }
  };
  const buttonFormatter = (cell, row) => {
    return (
      <button
        className="btn btn-primary"
        onClick={() => {
          handleButtonClick(row.productID, row.factoryID, row.brandID);
        }}
      >
        Ship Product
      </button>
    );
  };
  return (
    <div className="content">
      {
        <BootstrapTable data={det && JSON.parse(det.objectBytes)} striped hover>
          <TableHeaderColumn dataField="brandID">Brand ID</TableHeaderColumn>
          <TableHeaderColumn dataField="factoryID">
            Factory ID
          </TableHeaderColumn>
          <TableHeaderColumn dataField="tagID">Tag ID</TableHeaderColumn>
          <TableHeaderColumn isKey dataField="productID">
            Product Id
          </TableHeaderColumn>
          <TableHeaderColumn dataField="button" dataFormat={buttonFormatter}>
            Actions
          </TableHeaderColumn>
        </BootstrapTable>
      }
       
      <SpinnerDialog show={loading} />
    </div>
  );
};

export default withRouter(UnshippedProducts);
