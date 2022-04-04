import React from 'react';
import PropTypes from 'prop-types';


const Card = ({ className, children, title }) => (
  <div className={className}>
    <div className="card dashboard-card shadow-sm mt-4 mt-xl-0">
      <hr />
      <div className="card-header dashboard-header">
        {title}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  </div>
);

Card.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};
export default Card;
