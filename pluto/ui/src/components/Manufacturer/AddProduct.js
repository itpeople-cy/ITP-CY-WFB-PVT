import React, { useState, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "./../Card/Card";
import { withRouter } from "react-router-dom";
import { BrandContext } from "../../contexts/BrandContext";
import BackIcon from "../../assets/img/BackIcon.js";
import { addProduct } from "../../services/ManufacturerService";
import { successHandler, errorHandler } from "../../services/RequestHandler";
import Dropzone from "react-dropzone";
import SpinnerDialog from "../SpinnerDialog";
import Thumb from "./Thumb";

const dropzoneStyle = {
  width: "100%",
  height: "auto",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5
};

const AddProduct = props => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { manufacturerDetails } = useContext(BrandContext);
  const man = JSON.parse(
    manufacturerDetails && manufacturerDetails.objectBytes
  );
  const handleFormikSubmit = async (values, { setSubmitting, resetForm }) => {
    const formValues = new FormData();
    Object.keys(values).map((v, i) => formValues.set(v, values[v]));

    setSubmitting(false);
    try {
      setLoading(true);
      const response = await addProduct(formValues, {
        "accept-encoding": "gzip, deflate",
        Connection: "keep-alive",
        "cache-control": "no-cache",
        "content-type": "multipart/form-data"
      });
      if (response.status === 200) {
        successHandler("Product Added Succesfully!!");
        resetForm();
        setLoading(false);
        props.history.push(`/manufacturer`);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
      errorHandler(error);
    }
  };
  const handleClick = () => {
    props.history.push("/manufacturer");
  };
  return (
    <div className="content">
      <Container>
        <button
          className="btn btn-default"
          onClick={() => {
            handleClick();
          }}
        >
          <BackIcon /> manufacturer
        </button>

        <br />
        <Row>
          <Col md={12}>
            <Card
              title="Add Product"
              content={
                <Formik
                  initialValues={{
                    skuID: "",
                    factoryID: "",
                    brandID: "",
                    styleID: "",
                    upCode: "",
                    color: "",
                    msrp: "",
                    image: []
                  }}
                  onSubmit={handleFormikSubmit}
                  validationSchema={Yup.object().shape({
                    skuID: Yup.string().required("Required"),
                    factoryID: Yup.string().required("Required"),
                    brandID: Yup.string().required("Required"),
                    styleID: Yup.string().required("Required"),
                    upCode: Yup.string().required("Required"),
                    color: Yup.string().required("Required"),
                    msrp: Yup.string().required("Required")
                  })}
                >
                  {props => {
                    const {
                      values,
                      touched,
                      errors,
                      setFieldValue,
                      handleBlur,
                      handleChange,
                      handleSubmit
                    } = props;
                    return (
                      <Form onSubmit={handleSubmit}>
                        <Container fluid>
                          <Row>
                            <Col md={5}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>manufacturer</p>
                                </label>
                                <div>
                                  <input
                                    id="manufacturer"
                                    type="text"
                                    name="manufacturer"
                                    disabled
                                    value={manufacturerDetails ? man.name : ""}
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>SKU ID</p>
                                </label>
                                <div>
                                  <input
                                    id="skuID"
                                    type="text"
                                    name="skuID"
                                    value={values.skuID}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter SKU Id"
                                  />
                                  {errors.skuID && touched.skuID ? (
                                    <div className="text-danger">
                                      {errors.skuID}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>Factory ID</p>
                                </label>
                                <div>
                                  <select
                                    id="factoryID"
                                    name="factoryID"
                                    value={values.factoryID}
                                    onChange={handleChange}
                                    className="form-control"
                                  >
                                    <option value={null}>--select--</option>
                                    {man
                                      ? man.factoryIDs.map((v, i) => (
                                          <option value={v} key={i}>
                                            {v}
                                          </option>
                                        ))
                                      : null}
                                  </select>
                                  {errors.factoryID && touched.factoryID ? (
                                    <div className="text-danger">
                                      {" "}
                                      {errors.factoryID}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>BRAND ID</p>
                                </label>
                                <div>
                                  <select
                                    id="brandID"
                                    name="brandID"
                                    //value={values.brandID}
                                    onChange={handleChange}
                                    className="form-control"
                                  >
                                    <option value={null}>--select--</option>
                                    {man
                                      ? man.brandIDs.map((v, i) => (
                                          <option value={v} key={i}>
                                            {v}
                                          </option>
                                        ))
                                      : null}
                                  </select>
                                  {errors.brandID && touched.brandID ? (
                                    <div className="text-danger">
                                      {errors.brandID}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>STYLE ID</p>
                                </label>
                                <div>
                                  <input
                                    id="styleID"
                                    type="text"
                                    name="styleID"
                                    value={values.styleID}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter Style Id"
                                  />
                                  {errors.styleID && touched.styleID ? (
                                    <div className="text-danger">
                                      {errors.styleID}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>UP Code</p>
                                </label>
                                <div>
                                  <input
                                    id="upCode"
                                    type="text"
                                    name="upCode"
                                    value={values.upCode}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter UP code"
                                  />
                                  {errors.upCode && touched.upCode ? (
                                    <div className="text-danger">
                                      {errors.upCode}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>COLOR</p>
                                </label>
                                <div>
                                  <input
                                    id="color"
                                    type="text"
                                    name="color"
                                    value={values.color}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Enter Color"
                                  />
                                  {errors.color && touched.color ? (
                                    <div className="text-danger">
                                      {errors.color}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  <p>MSRP</p>
                                </label>
                                <div>
                                  <input
                                    id="msrp"
                                    type="text"
                                    name="msrp"
                                    value={values.msrp}
                                    onChange={handleChange}
                                    className="form-control"
                                  />
                                  {errors.msrp && touched.msrp ? (
                                    <div className="text-danger">
                                      {errors.msrp}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <div className="form-group">
                                <label className="col-form-label">
                                  Upload images
                                </label>
                                <Dropzone
                                  style={dropzoneStyle}
                                  accept="image/*"
                                  onDrop={acceptedFiles => {
                                    // do nothing if no files
                                    if (acceptedFiles.length === 0) {
                                      return;
                                    }

                                    // on drop we add to the existing files
                                    setFieldValue(
                                      "image",
                                      values.image.concat(acceptedFiles)
                                    );
                                  }}
                                >
                                  {({
                                    isDragActive,
                                    isDragReject,
                                    acceptedFiles,
                                    rejectedFiles,
                                    getRootProps,
                                    getInputProps
                                  }) => {
                                    if (isDragActive) {
                                      return "This file is authorized";
                                    }

                                    if (isDragReject) {
                                      return "This file is not authorized";
                                    }

                                    if (values.image.length === 0) {
                                      return (
                                        <div {...getRootProps()}>
                                          <input {...getInputProps()} />
                                          <p>
                                            Click or drag an image to upload!
                                          </p>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        {values.image.map((file, i) => (
                                          <Thumb key={i} file={file} />
                                        ))}
                                      </div>
                                    );
                                  }}
                                </Dropzone>
                              </div>
                            </Col>
                          </Row>
                          {/* <Row>
                            <Col md={12}>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <label className="input-group-text" id="text">
                                    Upload
                                  </label>
                                </div>
                                <div class="custom-file">
                                  <input
                                    type="file"
                                    className="custom-file-input"
                                    id="image"
                                    name="image"
                                    aria-describedby="image"
                                    value={values.image}
                                    multiple
                                    onChange={handleChange}
                                    touched={touched["image "]}
                                    onBlur={handleBlur}
                                  />
                                  <label
                                    className="custom-file-label"
                                    for="inputGroupFile01"
                                  >
                                    {values.image && values.image.length
                                      ? values.images.length
                                        ? values.image
                                        : values.image.map(v => (
                                            <span key={v}>v</span>
                                          ))
                                      : "Choose file"}
                                  </label>
                                </div>
                              </div>

                              {errors.image && touched.image ? (
                                <div className="text-danger">
                                  {errors.image}
                                </div>
                              ) : null}
                            </Col>
                          </Row> */}
                        </Container>
                        <div className="row ">
                          <div className="col-6">
                            <div className="mt-4">
                              <button
                                type="submit"
                                className="btn btn-primary"
                                id="login"
                              >
                                Add Product
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="clearfix" />
                      </Form>
                    );
                  }}
                </Formik>
              }
            />
          </Col>
        </Row>
        {error && JSON.stringify(error.response.data, null, 2)}
        <SpinnerDialog show={loading}/>
      </Container>
    </div>
  );
};

export default withRouter(AddProduct);
