import React, { useState, useEffect } from "react";
import { getDetails } from "../../services/FactoryService";
import FactoryDetails from "./FactoryDetails";

const Factory = props => {
  const [details, setDetails] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDetails();
      setDetails(data);
    };
    fetchData();
  }, []);

  const listProducts = async brandID => {
    // const data = await getProductDetails(brandID);
    //setProductDetails(data);
  };
  const handleClick = path => {
    props.history.push(`/factory/${path}`);
  };

  const man = JSON.parse(details && details.objectBytes);
  const prodDetails = JSON.parse(productDetails && JSON.stringify(productDetails.objectBytes));
  return (
    <div>
      <FactoryDetails man={man} />
      <button
        onClick={() => {
          handleClick("untaggedProducts");
        }}
        className={`btn btn-link `}
      >
        {" "}
        Untagged Products
      </button>
      <button onClick={() => {
           handleClick("unassignedTags");
      }} className={`btn btn-link`}
      >
        {" "}
        Unassigned Tags
      </button>
      <button onClick={() => {
           handleClick("viewScans");
      }} className={`btn btn-link`}>
        {" "}
        View Scans{" "}
      </button>
      <button onClick={() => {
           handleClick("unshippedProducts");
      }} className={`btn btn-link`}>
        {" "}
        Ship Products{" "}
      </button>

      {/*   <ManDetails man={man} />            
            <QueryProduct man={man} prodDetails={prodDetails} getProducts={listProducts} />
            <AddProduct manufacturer={details ? details.objectBytes : '1'} /> */}
    </div>
  );
};

export default Factory;
