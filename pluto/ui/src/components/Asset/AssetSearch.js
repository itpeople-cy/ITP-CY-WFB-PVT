import React, { Component } from 'react';
import PropTypes from 'prop-types';

// AssetSearch works in conjunction with AssetResults
// AssetSearch allows search for chosen activeObject chosen from AssetList
// Has 2 options: queryClicked or queryAllClicked
class AssetSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableFields: [],
      formFields: {},
      isQueryButtonDisabled: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
  }

  componentDidMount() {
    this.setupAvailableFields(this.props);
  }

  setupAvailableFields(props) {
    const fields = [];
    props.activeObject.keys.map(key => fields.push(key.name));
    this.setState({ isQueryButtonDisabled: true, formFields: {}, availableFields: fields });
  }

  handleChange(event) {
    const { formFields } = this.state;
    this.setState({
      formFields: {
        ...formFields,
        [event.target.name]: event.target.value,
      },
      isQueryButtonDisabled: false,
    });
  }

  handleFormValidation() {
    const { availableFields, formFields } = this.state;
    const validatedFields = [];
    availableFields.map((key) => {
      const valueOfKeyInState = formFields[key];
      if (valueOfKeyInState === '' || valueOfKeyInState === undefined) {
        validatedFields.pop(key);
      } else {
        validatedFields.push(key);
      }
      return true;
    });
    if (availableFields.length === validatedFields.length) {
      this.setState({ isQueryButtonDisabled: false });
    } else {
      this.setState({ isQueryButtonDisabled: true });
    }
  }

  render() {
    const {
      activeObject, queryClicked, queryAllClicked, selectedObjectName,
    } = this.props;
    const { isQueryButtonDisabled, formFields } = this.state;
    return (
      <form>
        <div className="form-group">
          {selectedObjectName === 'select' ? null
            : (
              <div>
                <label className="mt-4">Keys</label>
                {activeObject.keys.map((key, i) => <Field {...key} key={i} index={`${activeObject.objectName}-${key.name}`} handleChange={this.handleChange} handleValidation={this.handleFormValidation} />)}
                <button type="submit" className="btn btn-primary" id="queryClicked" onClick={e => queryClicked(e, activeObject.objectName, formFields)} disabled={isQueryButtonDisabled}>Query</button>
                <button type="submit" className="btn btn-primary ml-2" id="queryAllClicked" onClick={e => queryAllClicked(e, activeObject.objectName)}>Query All</button>
              </div>
            )
           }
        </div>
      </form>
    );
  }
}

AssetSearch.propTypes = {
  activeObject: PropTypes.object.isRequired,
  queryClicked: PropTypes.func.isRequired,
  queryAllClicked: PropTypes.func.isRequired,
  formFields: PropTypes.object.isRequired,
};

export default AssetSearch;

const Field = ({
  index, name, handleChange, handleKeyUp,
}) => (
  <div key={index} className="form-group">
    <label>{name}</label>
    <input type="text" className="form-control" name={name} onChange={handleChange} onKeyUp={handleKeyUp} />
  </div>);

Field.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
