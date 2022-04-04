import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';

class Accordion extends Component {
  renderView() {
    const { isLoading } = this.props;

    return isLoading ? <Spinner /> : (
      <div className="col-12">
        No items
      </div>
    );
  }

  render() {
    const { items } = this.props;
    return (
      <div className="row">
        <div className="col-12">
          <div className="accordion" id="accordionExample">
            { !items.length ? this.renderView() : items.map((item, i) => <AccordionItem headerText={`BlockNumber #${item.blockNumber}`} key={i} index={i} item={item} />) }
          </div>
        </div>
      </div>
    );
  }
}

Accordion.propTypes = {
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Accordion;

const AccordionItem = ({
  headerText, item, index,
}) => (
  <div className="card">
    <div className="card-header" id={`heading-${index}`}>
      <h5 className="mb-0">
        <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls="collapseOne">
          {headerText || `Item# ${item}`}
        </button>
      </h5>
    </div>
    <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading-${index}`} data-parent="#accordionExample">
      <div className="card-body">
        {JSON.stringify(item.transactions)}
      </div>
    </div>
  </div>
);
AccordionItem.propTypes = {
  headerText: PropTypes.array.isRequired,
  item: PropTypes.array.isRequired,
  index: PropTypes.array.isRequired,
};

const Transactions = ({ block }) => (
  <div className="card">
    {
      <div>{block.transactions}</div>
      }
  </div>
);
Transactions.propTypes = {
  block: PropTypes.array.isRequired,
};
