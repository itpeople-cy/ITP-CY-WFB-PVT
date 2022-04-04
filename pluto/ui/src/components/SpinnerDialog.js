import React from "react";
import { Modal, Button } from "react-bootstrap";
import Spinner from "./Spinner";

import "../assets/styling/modal.css";

const SpinnerDialog = props => {
  const { show, handleClose } = props;
  return (
    <Modal dialogClassName="modal-10w" size="sm" show={show} onHide={handleClose} centered>
      <Modal.Body>
        <p>Please Wait...</p>
        <Spinner />
      </Modal.Body>
    </Modal>
  );
};
export default SpinnerDialog;
