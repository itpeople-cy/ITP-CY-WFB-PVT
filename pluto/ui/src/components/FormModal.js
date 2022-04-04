import React from "react";
import { Modal,Button } from "react-bootstrap";
import "../assets/styling/modal.css";

const FormModal = props => {
  const { show, heading, handleClose , saveAndClose} = props;
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
            <button className='btn btn-default' onClick={handleClose}>Cancel</button>
            <button className='btn btn-primary' onClick={saveAndClose}>
              Save
            </button>
          </Modal.Footer>
    </Modal>
  );
};
export default FormModal;
