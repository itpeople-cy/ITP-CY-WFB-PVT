import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';

// AssetResults works in conjunction with AssetSearch
// It displays the Assets or spins while waiting
const AssetResults = ({ assetName, assets, isLoading }) => (
  <div className="row">
    <div className="col-12">
      {isLoading ? <Spinner /> : (
        <div className="accordion" id="accordionExample">
          {assets.length ? assets.map((asset, i) => <Asset assetName={assetName} key={i} index={i} asset={asset} />)
            : (
              <div className="col-12">
                No Assets Found
              </div>
            )
          }
        </div>
      )}
    </div>
  </div>
);

AssetResults.propTypes = {
  assets: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  assetName: PropTypes.string.isRequired,
};

export default AssetResults;

const Asset = ({ assetName, asset, index }) => {
  const assetObject = JSON.stringify(asset, null, '\t');
  return (
    <div className="card">
      <div className="card-header" id={`heading-${index}`}>
        <h5 className="mb-0">
          <button className="btn btn-link" type="button" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls="collapseOne">
            {`${assetName}#`}
            {
              index
            }
          </button>
        </h5>
      </div>
      <div id={`collapse${index}`} className="collapse" aria-labelledby={`heading-${index}`} data-parent="#accordionExample">
        <div className="card-body">
          {assetObject}
        </div>
      </div>
    </div>
  );
};

Asset.propTypes = {
  asset: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  assetName: PropTypes.string.isRequired,

};
