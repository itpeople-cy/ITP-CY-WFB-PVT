import React, { useState, useRef } from "react";
import { Container, Accordian, Row, Col } from "react-bootstrap";
import Spinner from "../Spinner";
import { Card } from "./../Card/Card";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

const QueryProduct = props => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { man, prodDetails, getProducts } = props;

  const handleSelectBrand = brand => {
    setSelectedBrand(brand);
    getProducts(brand);
  };
  const handleProductClick = product => {
    setSelectedProduct(product);
  };
  return (
    <div className="content">
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card
              title={"Query Product - Select a brand"}
              category=""
              content={
                <div>
                  {man &&
                    man.brandIDs.map(v => (
                      <button
                        onClick={() => handleSelectBrand(v)}
                        className={`btn btn-link ${
                          v === selectedBrand ? " selected" : ""
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  <br />
                </div>
              }
            />
          </Col>
        </Row>
        <div>
          <BootstrapTable data={prodDetails} striped hover>
            <TableHeaderColumn isKey dataField="brandID">
              Brand ID
            </TableHeaderColumn>
            <TableHeaderColumn dataField="productID">
              Product ID
            </TableHeaderColumn>
            <TableHeaderColumn dataField="factoryID">
              Factory ID
            </TableHeaderColumn>
            <TableHeaderColumn dataField="styleID">Style ID</TableHeaderColumn>
            <TableHeaderColumn dataField="color">Color</TableHeaderColumn>
            <TableHeaderColumn dataField="msrp"> MSRP </TableHeaderColumn>
            <TableHeaderColumn dataField="skuID">SKU ID</TableHeaderColumn>
            <TableHeaderColumn dataField="upCode"> UP Code</TableHeaderColumn>
            <TableHeaderColumn dataField="tagID"> Tag ID</TableHeaderColumn>
          </BootstrapTable>
        </div>
      </Container>
    </div>
  );
};

export default QueryProduct;
