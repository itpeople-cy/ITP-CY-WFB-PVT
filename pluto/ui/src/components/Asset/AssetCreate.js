import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-jsonschema-form';
import Spinner from '../Spinner';

// View for creating Assets
// Displays selected schema properties
class AssetCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formFields: {},
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { formFields } = this.state;
    this.setState({
      formFields: {
        ...formFields,
        [event.target.name]: event.target.value,
      },
    });
  }

  render() {
    const {
      isLoading, selectedSchema, createClicked,
    } = this.props;
    return (
      <div className="form-group">
        {isLoading && <Spinner />}
        {selectedSchema ? (
          <div className="col-sm-4">
            <Form schema={selectedSchema} onSubmit={createClicked} />
          </div>
        ) : null}
      </div>
    );
  }
}

AssetCreate.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  selectedSchema: PropTypes.object.isRequired,
  createClicked: PropTypes.func.isRequired,
};

export default AssetCreate;

const Field = ({
  name, handleChange, handleKeyUp,
}) => (
  <div className="form-group">
    <label>{name}</label>
    <input type="text" className="form-control" name={name} onChange={handleChange} onKeyUp={handleKeyUp} />
  </div>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
